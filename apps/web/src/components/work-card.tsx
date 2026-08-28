"use client";

import Image from "next/image";
import Link from "next/link";
import { ListPlus, Play } from "lucide-react";
import { useAudio } from "@/components/audio-player";
import type { Work } from "@/lib/types";

export function WorkCard({ work, priority = false }: { work: Work; priority?: boolean }) {
  const { playWork, queueWork } = useAudio();
  const image = work.thumbnailUrl || work.imageUrl;
  const playable = Boolean(work.audioUrl || work.movements?.some((movement) => movement.audioUrl));

  return (
    <article className="work-card reveal">
      <Link href={`/works/${work.id}`} className="work-art" aria-label={`View ${work.title}`}>
        {image ? <Image src={image} alt="" fill sizes="(max-width: 620px) 100vw, (max-width: 900px) 50vw, 33vw" priority={priority} /> : <span className="work-art-fallback" aria-hidden="true">{work.title.slice(0, 1)}</span>}
      </Link>
      <div className="work-body">
        <p className="work-meta">{work.year} · {work.instrumentation.slice(0, 2).join(", ")}</p>
        <h3 className="work-title"><Link href={`/works/${work.id}`}>{work.title}</Link></h3>
        <div className="work-controls">
          <Link href={`/works/${work.id}`} className="text-link">Details</Link>
          {playable && (
            <div>
              <button className="icon-button" type="button" aria-label={`Add ${work.title} to queue`} onClick={() => queueWork(work)}><ListPlus size={17} /></button>{" "}
              <button className="icon-button" type="button" aria-label={`Play ${work.title}`} onClick={() => playWork(work)}><Play size={17} fill="currentColor" /></button>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
