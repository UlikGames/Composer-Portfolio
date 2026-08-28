"use client";

export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return <div className="container section"><p className="eyebrow">The mechanism slipped</p><h1 className="display page-title">Something went wrong.</h1><p className="page-lede">The page could not complete its movement.</p><button className="button button-primary" type="button" onClick={reset}>Try again</button></div>;
}
