"use client";

import { ThemeProvider } from "next-themes";
import { AudioProvider } from "@/components/audio-player";
import { EasterEggListener } from "@/components/easter-egg-listener";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="data-theme" defaultTheme="dark" enableSystem storageKey="composer-theme">
      <AudioProvider>
        <EasterEggListener />
        {children}
      </AudioProvider>
    </ThemeProvider>
  );
}
