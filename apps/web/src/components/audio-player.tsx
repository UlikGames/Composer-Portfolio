"use client";

import Image from "next/image";
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { ArrowLeft, Heart, ListMusic, Maximize2, Pause, Play, Plus, Repeat, Repeat1, Shuffle, SkipBack, SkipForward, Volume2, X } from "lucide-react";
import type { Track, Work } from "@/lib/types";
import { works } from "@/lib/works";

type RepeatMode = "off" | "all" | "one";
type PlaybackSource = "direct" | "random" | "queued";
type PlayerPanel = "movements" | "queue" | "explore" | "favorites";

const FAVORITES_KEY = "composer-favorite-works";
const FAVORITES_EVENT = "composer-favorites-change";

interface AudioContextValue {
  current: Track | null;
  playing: boolean;
  playWork: (work: Work, movementIndex?: number) => void;
  queueWork: (work: Work) => void;
  playRandom: () => void;
  toggle: () => void;
}

const AudioContext = createContext<AudioContextValue | null>(null);

function subscribeFavorites(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener(FAVORITES_EVENT, callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(FAVORITES_EVENT, callback);
  };
}

function getFavoritesSnapshot() {
  return window.localStorage.getItem(FAVORITES_KEY) ?? "[]";
}

function getFavoritesServerSnapshot() {
  return "[]";
}

function parseFavoriteIds(value: string) {
  try {
    const parsed: unknown = JSON.parse(value);
    return Array.isArray(parsed) ? parsed.filter((id): id is string => typeof id === "string") : [];
  } catch {
    return [];
  }
}

function tracksFor(work: Work): Track[] {
  const artwork = work.thumbnailUrl || work.imageUrl;
  const movements = work.movements?.filter((movement) => movement.audioUrl).map((movement) => ({
    title: movement.title,
    workTitle: work.title,
    src: movement.audioUrl!,
    workId: work.id,
    artwork,
  })) ?? [];

  if (movements.length) return movements;
  return work.audioUrl ? [{ title: work.title, workTitle: work.title, src: work.audioUrl, workId: work.id, artwork }] : [];
}

function formatTime(seconds: number) {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
  const minutes = Math.floor(seconds / 60);
  return `${minutes}:${Math.floor(seconds % 60).toString().padStart(2, "0")}`;
}

export function AudioProvider({ children }: { children: React.ReactNode }) {
  const audio = useRef<HTMLAudioElement | null>(null);
  const loadedSrc = useRef<string | null>(null);
  const queueList = useRef<HTMLOListElement | null>(null);
  const lastHardwareCommand = useRef<{ action: string; at: number } | null>(null);
  const library = useMemo(() => works.flatMap(tracksFor), []);
  const playableWorks = useMemo(() => works.filter((work) => tracksFor(work).length > 0), []);
  const [queue, setQueue] = useState<Track[]>([]);
  const [upNext, setUpNext] = useState<Track[]>([]);
  const [queueOpen, setQueueOpen] = useState(true);
  const [expanded, setExpanded] = useState(true);
  const [panel, setPanel] = useState<PlayerPanel>("movements");
  const [exploreQuery, setExploreQuery] = useState("");
  const [exploreInstrumentation, setExploreInstrumentation] = useState("");
  const [exploreTag, setExploreTag] = useState("");
  const [expandedWorkId, setExpandedWorkId] = useState<string | null>(null);
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [shuffle, setShuffle] = useState(false);
  const [sourceMode, setSourceMode] = useState<PlaybackSource>("direct");
  const [repeatMode, setRepeatMode] = useState<RepeatMode>("off");
  const [elapsed, setElapsed] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.82);
  const favoritesSnapshot = useSyncExternalStore(subscribeFavorites, getFavoritesSnapshot, getFavoritesServerSnapshot);
  const current = queue[index] ?? null;
  const queuedTrackCount = upNext.length;
  const favoriteIds = useMemo(() => parseFavoriteIds(favoritesSnapshot), [favoritesSnapshot]);
  const favoriteWorks = useMemo(() => playableWorks.filter((work) => favoriteIds.includes(work.id)), [favoriteIds, playableWorks]);
  const currentWork = useMemo(() => works.find((work) => work.id === current?.workId), [current?.workId]);
  const exploreInstrumentations = useMemo(() => [...new Set(playableWorks.flatMap((work) => work.instrumentation))].sort(), [playableWorks]);
  const exploreTags = useMemo(() => [...new Set(playableWorks.flatMap((work) => work.tags))].sort(), [playableWorks]);
  const exploredWorks = useMemo(() => {
    const query = exploreQuery.trim().toLocaleLowerCase();
    return playableWorks.filter((work) => {
      if (work.id === current?.workId) return false;
      if (exploreInstrumentation && !work.instrumentation.includes(exploreInstrumentation)) return false;
      if (exploreTag && !work.tags.includes(exploreTag)) return false;
      return !query || `${work.title} ${work.instrumentation.join(" ")} ${work.tags.join(" ")}`.toLocaleLowerCase().includes(query);
    });
  }, [current?.workId, exploreInstrumentation, exploreQuery, exploreTag, playableWorks]);

  const loadWork = useCallback((work: Work, movementIndex = 0, source: PlaybackSource = "direct") => {
    const tracks = tracksFor(work);
    if (!tracks.length) return;
    setQueue(tracks);
    setIndex(Math.min(movementIndex, tracks.length - 1));
    setSourceMode(source);
    setQueueOpen(true);
    setExpanded(true);
    setPanel(tracks.length > 1 ? "movements" : "explore");
    setPlaying(true);
  }, []);

  const chooseRandom = useCallback((exclude?: string) => {
    const candidates = library.filter((track) => track.src !== exclude);
    return candidates[Math.floor(Math.random() * candidates.length)] ?? library[0];
  }, [library]);

  const loadRandomTrack = useCallback((track: Track) => {
    const workQueue = library.filter((item) => item.workId === track.workId);
    const nextQueue = workQueue.length ? workQueue : [track];
    const nextIndex = Math.max(nextQueue.findIndex((item) => item.src === track.src), 0);
    setQueue(nextQueue);
    setIndex(nextIndex);
    setSourceMode("random");
    setShuffle(true);
    setQueueOpen(true);
    setExpanded(true);
    setPanel(nextQueue.length > 1 ? "movements" : "explore");
    setPlaying(true);
  }, [library]);

  const loadQueuedTrack = useCallback((track: Track) => {
    setQueue([track]);
    setIndex(0);
    setSourceMode("queued");
    setQueueOpen(true);
    setExpanded(true);
    setPanel("queue");
    setPlaying(true);
  }, []);

  const playRandom = useCallback(() => {
    const track = chooseRandom(current?.src);
    if (!track) return;
    loadRandomTrack(track);
  }, [chooseRandom, current?.src, loadRandomTrack]);

  const playNext = useCallback((automatic = false) => {
    if (automatic && repeatMode === "one") {
      if (audio.current) {
        audio.current.currentTime = 0;
        void audio.current.play();
      }
      return;
    }

    if ((!shuffle || sourceMode !== "random") && index + 1 < queue.length) {
      setIndex((value) => value + 1);
      setPlaying(true);
      return;
    }

    if (upNext.length) {
      loadQueuedTrack(upNext[0]);
      setUpNext((value) => value.slice(1));
      return;
    }

    if (shuffle) {
      const track = chooseRandom(current?.src);
      if (track) loadRandomTrack(track);
      return;
    }

    if (repeatMode === "all" && queue.length) {
      setIndex(0);
      setPlaying(true);
    } else if (!automatic && queue.length) {
      setIndex(0);
      setPlaying(true);
    } else {
      setPlaying(false);
    }
  }, [chooseRandom, current?.src, index, loadQueuedTrack, loadRandomTrack, queue.length, repeatMode, shuffle, sourceMode, upNext]);

  useEffect(() => {
    audio.current = new Audio();
    audio.current.preload = "metadata";
    return () => audio.current?.pause();
  }, []);

  useEffect(() => {
    const element = audio.current;
    if (!element || !current) return;
    if (loadedSrc.current !== current.src) {
      element.src = current.src;
      loadedSrc.current = current.src;
      setElapsed(0);
      setDuration(0);
    }
    element.volume = volume;
    if (playing) void element.play().catch(() => setPlaying(false));
    else element.pause();
  }, [current, playing, volume]);

  useEffect(() => {
    const element = audio.current;
    if (!element) return;
    const syncTime = () => {
      setElapsed(element.currentTime);
      setDuration(Number.isFinite(element.duration) ? element.duration : 0);
    };
    const ended = () => playNext(true);
    element.addEventListener("timeupdate", syncTime);
    element.addEventListener("loadedmetadata", syncTime);
    element.addEventListener("durationchange", syncTime);
    element.addEventListener("ended", ended);
    return () => {
      element.removeEventListener("timeupdate", syncTime);
      element.removeEventListener("loadedmetadata", syncTime);
      element.removeEventListener("durationchange", syncTime);
      element.removeEventListener("ended", ended);
    };
  }, [playNext]);

  useEffect(() => {
    if (!queueOpen || panel !== "movements" || !queueList.current) return;
    const list = queueList.current;
    const frame = window.requestAnimationFrame(() => {
      const activeItem = list.querySelector<HTMLElement>('[data-current="true"]');
      if (!activeItem) return;
      const listRect = list.getBoundingClientRect();
      const activeRect = activeItem.getBoundingClientRect();
      list.scrollTop += activeRect.top - listRect.top - (list.clientHeight - activeItem.clientHeight) / 2;
    });
    return () => window.cancelAnimationFrame(frame);
  }, [index, panel, queueOpen]);

  const playWork = useCallback((work: Work, movementIndex = 0) => {
    loadWork(work, movementIndex, "direct");
    setShuffle(false);
  }, [loadWork]);

  const queueWork = useCallback((work: Work) => {
    const tracks = tracksFor(work);
    if (!tracks.length) return;
    if (!current) {
      setQueue(tracks);
      setIndex(0);
      setSourceMode("queued");
      setPlaying(false);
    } else {
      setUpNext((value) => [...value, ...tracks]);
    }
    setQueueOpen(true);
    setPanel("queue");
  }, [current]);
  const queueTrack = useCallback((track: Track) => {
    if (!current) {
      setQueue([track]);
      setIndex(0);
      setSourceMode("queued");
      setPlaying(false);
    } else {
      setUpNext((value) => [...value, track]);
    }
    setQueueOpen(true);
  }, [current]);

  const toggle = useCallback(() => current ? setPlaying((value) => !value) : playRandom(), [current, playRandom]);
  const playPrevious = useCallback(() => {
    const element = audio.current;
    if (element && element.currentTime > 3) {
      element.currentTime = 0;
      return;
    }
    if (shuffle) {
      playRandom();
      return;
    }
    setIndex((value) => value > 0 ? value - 1 : Math.max(queue.length - 1, 0));
    setPlaying(true);
  }, [playRandom, queue.length, shuffle]);

  const cycleRepeat = useCallback(() => setRepeatMode((mode) => mode === "off" ? "all" : mode === "all" ? "one" : "off"), []);
  const toggleShuffle = useCallback(() => {
    setShuffle((enabled) => {
      if (enabled) setSourceMode("direct");
      return !enabled;
    });
  }, []);
  const seek = useCallback((value: number) => {
    if (!audio.current) return;
    audio.current.currentTime = value;
    setElapsed(value);
  }, []);
  const changeVolume = useCallback((value: number) => {
    setVolume(value);
    if (audio.current) audio.current.volume = value;
  }, []);
  const stopPlayback = useCallback(() => {
    setPlaying(false);
    if (audio.current) audio.current.currentTime = 0;
    setElapsed(0);
  }, []);
  const close = useCallback(() => {
    setPlaying(false);
    setQueue([]);
    setUpNext([]);
    setIndex(0);
    setQueueOpen(false);
  }, []);
  const selectTrack = useCallback((position: number) => {
    setIndex(position);
    setSourceMode("direct");
    setShuffle(false);
    setPanel("movements");
    setPlaying(true);
  }, []);
  const playQueuedTrack = useCallback((position: number) => {
    const track = upNext[position];
    if (!track) return;
    setUpNext((value) => value.filter((_, itemPosition) => itemPosition !== position));
    loadQueuedTrack(track);
  }, [loadQueuedTrack, upNext]);
  const toggleFavorite = useCallback((workId: string) => {
    const nextIds = new Set(parseFavoriteIds(window.localStorage.getItem(FAVORITES_KEY) ?? "[]"));
    if (nextIds.has(workId)) nextIds.delete(workId);
    else nextIds.add(workId);
    window.localStorage.setItem(FAVORITES_KEY, JSON.stringify([...nextIds]));
    window.dispatchEvent(new Event(FAVORITES_EVENT));
  }, []);
  const runHardwareCommand = useCallback((action: string, command: () => void) => {
    const now = performance.now();
    const previous = lastHardwareCommand.current;
    if (previous?.action === action && now - previous.at < 350) return;
    lastHardwareCommand.current = { action, at: now };
    command();
  }, []);

  useEffect(() => {
    if (!("mediaSession" in navigator)) return;
    const session = navigator.mediaSession;
    const setHandler = (action: MediaSessionAction, handler: MediaSessionActionHandler | null) => {
      try {
        session.setActionHandler(action, handler);
      } catch {
        // Some browsers expose Media Session but do not implement every action.
      }
    };
    const handlers: [MediaSessionAction, MediaSessionActionHandler][] = [
      ["play", () => runHardwareCommand("play-pause", () => current ? setPlaying(true) : playRandom())],
      ["pause", () => runHardwareCommand("play-pause", () => setPlaying(false))],
      ["stop", () => runHardwareCommand("stop", stopPlayback)],
      ["previoustrack", () => runHardwareCommand("previous", playPrevious)],
      ["nexttrack", () => runHardwareCommand("next", () => playNext(false))],
      ["seekbackward", (details) => runHardwareCommand("seek-backward", () => seek(Math.max((audio.current?.currentTime ?? 0) - (details.seekOffset ?? 10), 0)))],
      ["seekforward", (details) => runHardwareCommand("seek-forward", () => seek(Math.min((audio.current?.currentTime ?? 0) + (details.seekOffset ?? 10), audio.current?.duration || 0)))],
      ["seekto", (details) => runHardwareCommand("seek-to", () => { if (typeof details.seekTime === "number") seek(details.seekTime); })],
    ];
    handlers.forEach(([action, handler]) => setHandler(action, handler));
    return () => handlers.forEach(([action]) => setHandler(action, null));
  }, [current, playNext, playPrevious, playRandom, runHardwareCommand, seek, stopPlayback]);

  useEffect(() => {
    const handleHardwareKeyFallback = (event: KeyboardEvent) => {
      if ("mediaSession" in navigator || event.repeat) return;
      if (event.key === "MediaPlayPause") {
        event.preventDefault();
        runHardwareCommand("play-pause", toggle);
      } else if (event.key === "MediaStop") {
        event.preventDefault();
        runHardwareCommand("stop", stopPlayback);
      } else if (event.key === "MediaTrackNext") {
        event.preventDefault();
        runHardwareCommand("next", () => playNext(false));
      } else if (event.key === "MediaTrackPrevious") {
        event.preventDefault();
        runHardwareCommand("previous", playPrevious);
      }
    };
    window.addEventListener("keydown", handleHardwareKeyFallback);
    return () => window.removeEventListener("keydown", handleHardwareKeyFallback);
  }, [playNext, playPrevious, runHardwareCommand, stopPlayback, toggle]);

  useEffect(() => {
    if (!("mediaSession" in navigator)) return;
    navigator.mediaSession.metadata = current ? new MediaMetadata({
      title: current.title,
      artist: "Ulvin Najafov",
      album: current.workTitle ?? "Composer Portfolio",
      artwork: current.artwork ? [{ src: new URL(current.artwork, window.location.origin).href }] : undefined,
    }) : null;
    navigator.mediaSession.playbackState = current ? (playing ? "playing" : "paused") : "none";
  }, [current, playing]);

  useEffect(() => {
    if (!("mediaSession" in navigator) || !current || duration <= 0) return;
    try {
      navigator.mediaSession.setPositionState({
        duration,
        playbackRate: audio.current?.playbackRate ?? 1,
        position: Math.min(Math.max(elapsed, 0), duration),
      });
    } catch {
      // Metadata remains available when position reporting is unsupported.
    }
  }, [current, duration, elapsed]);

  const value = useMemo(() => ({ current, playing, playWork, queueWork, playRandom, toggle }), [current, playing, playWork, queueWork, playRandom, toggle]);
  return (
    <AudioContext.Provider value={value}>
      {children}
      {current && expanded && (
        <div className="player" role="dialog" aria-modal="true" aria-label="Now playing">
          <header className="player-topbar">
            <button className="player-back" type="button" onClick={() => setExpanded(false)}><ArrowLeft size={16} /> Back to archive</button>
            <span aria-hidden="true">Ulvin Najafov</span>
          </header>
          <div className="player-stage">
            <section className="player-identity" aria-labelledby="player-track-title">
              <div className="player-art" aria-hidden="true">
                {current.artwork ? (
                  <>
                    <Image className="player-art-backdrop" src={current.artwork} alt="" fill sizes="(max-width: 620px) 100vw, 42vw" />
                    <Image className="player-art-cover" src={current.artwork} alt="" fill sizes="(max-width: 620px) 100vw, 42vw" priority />
                  </>
                ) : <ListMusic size={42} />}
              </div>
              <div className="player-track">
                <div className="player-track-kicker-row">
                  <span className="player-kicker">Currently playing</span>
                  {currentWork && (
                    <button className="icon-button player-favorite" data-active={favoriteIds.includes(currentWork.id)} type="button" aria-label={favoriteIds.includes(currentWork.id) ? `Remove ${currentWork.title} from favorites` : `Add ${currentWork.title} to favorites`} aria-pressed={favoriteIds.includes(currentWork.id)} onClick={() => toggleFavorite(currentWork.id)}>
                      <Heart size={18} fill={favoriteIds.includes(currentWork.id) ? "currentColor" : "none"} />
                    </button>
                  )}
                </div>
                <strong id="player-track-title">{current.workTitle ?? current.title}</strong>
                {current.workTitle && current.workTitle !== current.title && <span className="player-movement-name">{current.title}</span>}
                <span>Ulvin Najafov</span>
              </div>
            </section>
          {queueOpen && (
            <aside className="player-library" aria-label="Listening archive">
              <div className="player-panel-tabs" role="tablist" aria-label="Player browser">
                <button type="button" role="tab" aria-selected={panel === "movements"} data-active={panel === "movements"} onClick={() => setPanel("movements")}>Movements <span>{queue.length}</span></button>
                <button type="button" role="tab" aria-selected={panel === "queue"} data-active={panel === "queue"} onClick={() => setPanel("queue")}>Queue <span>{upNext.length}</span></button>
                <button type="button" role="tab" aria-selected={panel === "explore"} data-active={panel === "explore"} onClick={() => setPanel("explore")}>Explore <span>{playableWorks.length}</span></button>
                <button type="button" role="tab" aria-selected={panel === "favorites"} data-active={panel === "favorites"} onClick={() => setPanel("favorites")}>Favorites <span>{favoriteWorks.length}</span></button>
              </div>
              {panel === "movements" && (
                <div className="player-queue" role="tabpanel" aria-label="Movements">
                  <div className="player-queue-heading"><strong>Movements</strong><span>{queue.length} {queue.length === 1 ? "track" : "tracks"}</span></div>
                  <ol ref={queueList}>
                    {queue.map((track, position) => (
                      <li key={`${track.src}-${position}`}>
                        <button type="button" data-current={position === index} aria-label={`Play ${track.workTitle && track.workTitle !== track.title ? `${track.workTitle}, ${track.title}` : track.title}`} onClick={() => selectTrack(position)}>
                          <span className="player-queue-index">{String(position + 1).padStart(2, "0")}</span>
                          <span><strong>{track.title}</strong><small>{track.workTitle ?? "Ulvin Najafov"}</small></span>
                          {position === index && <span className="player-queue-playing">Playing</span>}
                        </button>
                      </li>
                    ))}
                  </ol>
                </div>
              )}
              {panel === "queue" && (
                <div className="player-up-next" role="tabpanel" aria-label="Manual queue">
                  <div className="player-queue-heading"><strong>Up next</strong><span>Manual queue has priority</span></div>
                  {upNext.length === 0 && <p className="player-panel-empty">Nothing queued yet. Add a work from Explore.</p>}
                  {upNext.map((track, position) => (
                    <button type="button" key={`${track.src}-${position}`} onClick={() => playQueuedTrack(position)}>
                      <span>{String(position + 1).padStart(2, "0")}</span>
                      <strong>{track.title}</strong>
                      <small>{track.workTitle ?? "Ulvin Najafov"}</small>
                    </button>
                  ))}
                </div>
              )}
              {panel === "explore" && (
                <div className="player-explore" role="tabpanel" aria-label="Explore playable works">
                  <div className="player-explore-filters">
                    <label><span className="sr-only">Search playable works</span><input className="input" type="search" placeholder="Search works" value={exploreQuery} onChange={(event) => setExploreQuery(event.target.value)} /></label>
                    <label><span className="sr-only">Filter by instrumentation</span><select className="select" value={exploreInstrumentation} onChange={(event) => setExploreInstrumentation(event.target.value)}><option value="">All instruments</option>{exploreInstrumentations.map((item) => <option key={item} value={item}>{item}</option>)}</select></label>
                    <label><span className="sr-only">Filter by tag</span><select className="select" value={exploreTag} onChange={(event) => setExploreTag(event.target.value)}><option value="">All tags</option>{exploreTags.map((item) => <option key={item} value={item}>{item}</option>)}</select></label>
                  </div>
                  <div className="player-explore-list">
                    {exploredWorks.map((work) => {
                      const workTracks = tracksFor(work);
                      const expanded = expandedWorkId === work.id;
                      return (
                        <article className="player-explore-work" key={work.id}>
                          <div className="player-explore-item">
                            <div className="player-explore-art" aria-hidden="true">{work.thumbnailUrl || work.imageUrl ? <Image src={work.thumbnailUrl || work.imageUrl || ""} alt="" fill sizes="56px" /> : <ListMusic size={18} />}</div>
                            <button className="player-explore-main" type="button" onClick={() => playWork(work)}><strong>{work.title}</strong><small>{work.instrumentation.join(" · ")} · {work.duration}</small></button>
                            <div className="player-explore-actions">
                              <button className="icon-button" data-active={favoriteIds.includes(work.id)} type="button" aria-label={favoriteIds.includes(work.id) ? `Remove ${work.title} from favorites` : `Add ${work.title} to favorites`} aria-pressed={favoriteIds.includes(work.id)} onClick={() => toggleFavorite(work.id)}><Heart size={16} fill={favoriteIds.includes(work.id) ? "currentColor" : "none"} /></button>
                              <button className="icon-button" type="button" aria-label={workTracks.length > 1 ? `Choose movements from ${work.title}` : `Add ${work.title} to queue`} aria-expanded={workTracks.length > 1 ? expanded : undefined} onClick={() => workTracks.length > 1 ? setExpandedWorkId((value) => value === work.id ? null : work.id) : queueTrack(workTracks[0])}><Plus size={17} /></button>
                            </div>
                          </div>
                          {expanded && (
                            <div className="player-explore-movements">
                              <button className="player-add-all" type="button" onClick={() => queueWork(work)}>Add all {workTracks.length} movements</button>
                              {workTracks.map((track, movementIndex) => (
                                <div key={track.src}>
                                  <span>{String(movementIndex + 1).padStart(2, "0")}</span>
                                  <strong>{track.title}</strong>
                                  <button className="icon-button" type="button" aria-label={`Add ${track.title} to queue`} onClick={() => queueTrack(track)}><Plus size={15} /></button>
                                </div>
                              ))}
                            </div>
                          )}
                        </article>
                      );
                    })}
                    {exploredWorks.length === 0 && <p className="player-panel-empty">No playable work matches these filters.</p>}
                  </div>
                </div>
              )}
              {panel === "favorites" && (
                <div className="player-favorites" role="tabpanel" aria-label="Favorite works">
                  <div className="player-queue-heading"><strong>Favorites</strong><span>{favoriteWorks.length} {favoriteWorks.length === 1 ? "work" : "works"}</span></div>
                  {favoriteWorks.length === 0 && <p className="player-panel-empty">No favorites yet. Use the heart beside a work to save it here.</p>}
                  <div className="player-explore-list">
                    {favoriteWorks.map((work) => (
                      <article className="player-explore-work" key={work.id}>
                        <div className="player-explore-item">
                          <div className="player-explore-art" aria-hidden="true">{work.thumbnailUrl || work.imageUrl ? <Image src={work.thumbnailUrl || work.imageUrl || ""} alt="" fill sizes="56px" /> : <ListMusic size={18} />}</div>
                          <button className="player-explore-main" type="button" onClick={() => playWork(work)}><strong>{work.title}</strong><small>{work.instrumentation.join(" · ")} · {work.duration}</small></button>
                          <div className="player-explore-actions">
                            <button className="icon-button" data-active="true" type="button" aria-label={`Remove ${work.title} from favorites`} aria-pressed="true" onClick={() => toggleFavorite(work.id)}><Heart size={16} fill="currentColor" /></button>
                            <button className="icon-button" type="button" aria-label={`Add ${work.title} to queue`} onClick={() => queueWork(work)}><Plus size={17} /></button>
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>
                </div>
              )}
            </aside>
          )}
          </div>
          <footer className="player-dock">
            <div className="player-timeline">
              <span>{formatTime(elapsed)}</span>
              <input aria-label="Track position" type="range" min="0" max={duration || 0} step="0.1" value={Math.min(elapsed, duration || 0)} onChange={(event) => seek(Number(event.target.value))} />
              <span>{formatTime(duration)}</span>
            </div>
            <div className="player-control-row">
              <div className="player-mode-controls">
                <button className="icon-button" data-active={shuffle} type="button" aria-label="Shuffle" aria-pressed={shuffle} onClick={toggleShuffle}><Shuffle size={17} /></button>
                <button className="icon-button" data-active={repeatMode !== "off"} type="button" aria-label={`Repeat mode: ${repeatMode}`} onClick={cycleRepeat}>{repeatMode === "one" ? <Repeat1 size={17} /> : <Repeat size={17} />}</button>
              </div>
              <div className="player-transport">
                <button className="icon-button" type="button" aria-label="Previous track" onClick={playPrevious}><SkipBack size={20} /></button>
                <button className="player-play" type="button" aria-label={playing ? "Pause" : "Play"} onClick={toggle}>{playing ? <Pause size={23} fill="currentColor" /> : <Play size={23} fill="currentColor" />}</button>
                <button className="icon-button" type="button" aria-label="Next track" onClick={() => playNext(false)}><SkipForward size={20} /></button>
              </div>
              <div className="player-aux-controls">
                <button className="icon-button player-queue-toggle" data-active={queueOpen} type="button" aria-label={queueOpen ? "Close queue" : "Open queue"} aria-expanded={queueOpen} onClick={() => setQueueOpen((value) => !value)}>
                  <ListMusic size={17} /><span>{queue.length + queuedTrackCount}</span>
                </button>
                <label className="player-volume">
                  <Volume2 size={17} />
                  <span className="sr-only">Volume</span>
                  <input type="range" min="0" max="1" step="0.01" value={volume} onChange={(event) => changeVolume(Number(event.target.value))} />
                </label>
              </div>
            </div>
          </footer>
        </div>
      )}
      {current && !expanded && (
        <aside className="player-mini" aria-label="Compact audio player">
          <div className="player-mini-art" aria-hidden="true">
            {current.artwork ? <Image src={current.artwork} alt="" fill sizes="64px" /> : <ListMusic size={20} />}
          </div>
          <button className="player-mini-track" type="button" aria-label="Open full player" onClick={() => setExpanded(true)}>
            <strong>{current.workTitle ?? current.title}</strong>
            <span>{current.workTitle && current.workTitle !== current.title ? current.title : "Ulvin Najafov"}</span>
          </button>
          <div className="player-mini-progress" aria-hidden="true"><span style={{ width: `${duration ? Math.min((elapsed / duration) * 100, 100) : 0}%` }} /></div>
          <div className="player-mini-transport">
            <button className="icon-button" type="button" aria-label="Previous track" onClick={playPrevious}><SkipBack size={18} /></button>
            <button className="player-mini-play" type="button" aria-label={playing ? "Pause" : "Play"} onClick={toggle}>{playing ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" />}</button>
            <button className="icon-button" type="button" aria-label="Next track" onClick={() => playNext(false)}><SkipForward size={18} /></button>
          </div>
          <div className="player-mini-actions">
            {currentWork && <button className="icon-button" data-active={favoriteIds.includes(currentWork.id)} type="button" aria-label={favoriteIds.includes(currentWork.id) ? `Remove ${currentWork.title} from favorites` : `Add ${currentWork.title} to favorites`} aria-pressed={favoriteIds.includes(currentWork.id)} onClick={() => toggleFavorite(currentWork.id)}><Heart size={17} fill={favoriteIds.includes(currentWork.id) ? "currentColor" : "none"} /></button>}
            <button className="icon-button" type="button" aria-label="Open full player" onClick={() => setExpanded(true)}><Maximize2 size={17} /></button>
            <button className="icon-button" type="button" aria-label="Close player" onClick={close}><X size={17} /></button>
          </div>
        </aside>
      )}
    </AudioContext.Provider>
  );
}

export function useAudio() {
  const context = useContext(AudioContext);
  if (!context) throw new Error("useAudio must be used inside AudioProvider");
  return context;
}
