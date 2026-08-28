"use client";

import { Download, ListPlus, Pause, Play } from "lucide-react";
import { useAudio } from "@/components/audio-player";
import type { Work } from "@/lib/types";

export function WorkActions({ work }: { work: Work }) {
  const { current, playing, playWork, queueWork, toggle } = useAudio();
  const active = Boolean(current?.workId === work.id);
  const playable = Boolean(work.audioUrl || work.movements?.some((movement) => movement.audioUrl));
  const scores = work.scores ?? (work.scoreUrl ? [{ title: "Download score", url: work.scoreUrl }] : []);

  return (
    <div className="hero-actions">
      {playable && <button className="button button-brass" type="button" onClick={() => active ? toggle() : playWork(work)}>{active && playing ? <Pause size={16} /> : <Play size={16} fill="currentColor" />} {active && playing ? "Pause" : "Listen"}</button>}
      {playable && <button className="button button-ghost" type="button" onClick={() => queueWork(work)}><ListPlus size={16} /> Add to queue</button>}
      {scores.map((score) => <a key={score.url} className="button button-ghost" href={score.url} target="_blank" rel="noreferrer"><Download size={16} /> {score.title}</a>)}
    </div>
  );
}

export function MovementButton({ work, index }: { work: Work; index: number }) {
  const { playWork } = useAudio();
  return <button className="icon-button" type="button" aria-label={`Play ${work.movements?.[index]?.title}`} onClick={() => playWork(work, index)}><Play size={16} fill="currentColor" /></button>;
}
