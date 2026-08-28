"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

const SPECIAL_WORKS: Record<string, { label: string; consoleMessage: string }> = {
  "three-nocturnes": {
    label: "T H R E E   N O C T U R N E S",
    consoleMessage: "Some melodies are written for one person, even if that person never hears them.",
  },
  linconnue: {
    label: "L ' I N C O N N U E",
    consoleMessage: "Twelve pieces for someone I never met, but somehow already knew.",
  },
  "images-d-elle": {
    label: "I M A G E S   D ' E L L E",
    consoleMessage: "Two images of someone I carry with me, her presence, and her mystery.",
  },
};

interface SpecialWorkArtworkProps {
  image?: string;
  title: string;
  workId: string;
}

export function SpecialWorkArtwork({ image, title, workId }: SpecialWorkArtworkProps) {
  const special = SPECIAL_WORKS[workId];
  const [open, setOpen] = useState(false);
  const clickCount = useRef(0);
  const resetTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!special) return;
    const art = `\n╔══════════════════════════════════════════════════════════════╗\n║                                                              ║\n║              ${special.label.padEnd(31, " ")}               ║\n║                                                              ║\n║  ${special.consoleMessage.padEnd(58, " ")}  ║\n║                                                              ║\n╚══════════════════════════════════════════════════════════════╝`;
    console.info(`%c${art}`, "color:#c3a15b;font-family:monospace;font-size:11px;line-height:1.4");
    console.info("%c✧ If you typed her name, you already know why this exists. ✧", "color:#c3a15b;font-family:Georgia,serif;font-style:italic");
  }, [special]);

  useEffect(() => {
    if (!open) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [open]);

  useEffect(() => () => {
    if (resetTimer.current) clearTimeout(resetTimer.current);
  }, []);

  const registerClick = () => {
    if (!special) return;
    clickCount.current += 1;
    if (resetTimer.current) clearTimeout(resetTimer.current);
    resetTimer.current = setTimeout(() => { clickCount.current = 0; }, 500);
    if (clickCount.current >= 3) {
      clickCount.current = 0;
      setOpen(true);
    }
  };

  return (
    <>
      <div className={`detail-art reveal${special ? " easter-art" : ""}`} onClick={registerClick} title={special ? "Some scores keep a secret" : undefined}>
        {image ? <Image src={image} alt={`${title} artwork`} fill priority sizes="(max-width: 900px) 100vw, 38vw" /> : <span className="work-art-fallback">{title.slice(0, 1)}</span>}
      </div>
      {open && (
        <div className="easter-modal" role="dialog" aria-modal="true" aria-labelledby="easter-title" onClick={() => setOpen(false)}>
          <div className="easter-modal-card" onClick={(event) => event.stopPropagation()}>
            <div className="easter-modal-star" aria-hidden="true">✧</div>
            <strong id="easter-title">For my missing Hande.</strong>
            <p>I’ll keep the distance you asked for. I just needed one page where you still exist.</p>
            <button className="button button-ghost" type="button" onClick={() => setOpen(false)}>Close</button>
          </div>
        </div>
      )}
    </>
  );
}

export function SpecialWorkTitle({ title, workId }: { title: string; workId: string }) {
  const [specialDate] = useState(() => {
    const now = new Date();
    return now.getMonth() === 7 && now.getDate() === 25;
  });

  return (
    <h1 className="display detail-title reveal">
      {title}
      {SPECIAL_WORKS[workId] && specialDate && <span className="easter-date-star" title="Wherever you are today, I hope you’re surrounded by light ✧">✧</span>}
    </h1>
  );
}
