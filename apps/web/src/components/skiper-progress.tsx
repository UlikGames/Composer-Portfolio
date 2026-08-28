"use client";

import dynamic from "next/dynamic";

const Skiper89 = dynamic(
  () => import("@/components/ui/skiper-ui/skiper89").then((module) => module.Skiper89),
  { ssr: false },
);

export function SkiperProgress() {
  return <div className="skiper-progress-host"><Skiper89 /></div>;
}
