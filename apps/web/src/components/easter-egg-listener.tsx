"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export function EasterEggListener() {
  const router = useRouter();
  useEffect(() => {
    let sequence = "";
    const listener = (event: KeyboardEvent) => {
      if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement || event.target instanceof HTMLSelectElement) return;
      sequence = `${sequence}${event.key.toLowerCase()}`.slice(-5);
      if (sequence === "hande") router.push("/hande");
    };
    window.addEventListener("keydown", listener);
    return () => window.removeEventListener("keydown", listener);
  }, [router]);
  return null;
}
