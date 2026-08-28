"use client";

export default function WorkError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return <div className="container section"><p className="eyebrow">Playback interrupted</p><h1 className="display page-title">This work could not be loaded.</h1><button className="button button-primary" type="button" onClick={reset}>Try again</button></div>;
}
