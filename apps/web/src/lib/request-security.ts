import { createHash } from "node:crypto";
import type { NextRequest } from "next/server";

const windows = new Map<string, { count: number; resetAt: number }>();

export function sameOrigin(request: NextRequest): boolean {
  const origin = request.headers.get("origin");
  if (!origin) return true;
  try {
    return new URL(origin).host === request.nextUrl.host;
  } catch {
    return false;
  }
}

export function isRateLimited(request: NextRequest, scope: string, limit: number, windowMs = 15 * 60 * 1000): boolean {
  const now = Date.now();
  if (windows.size > 1_000) {
    for (const [key, value] of windows) {
      if (value.resetAt <= now) windows.delete(key);
    }
  }
  const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const key = createHash("sha256").update(`${scope}:${forwarded}`).digest("hex");
  const entry = windows.get(key);
  if (!entry || entry.resetAt <= now) {
    windows.set(key, { count: 1, resetAt: now + windowMs });
    return false;
  }
  entry.count += 1;
  return entry.count > limit;
}

export function escapeHtml(value: string): string {
  return value.replace(/[&<>'"]/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[character] ?? character);
}

export async function safeJson(request: NextRequest, maxBytes = 12_000): Promise<unknown> {
  const contentLength = Number(request.headers.get("content-length") || 0);
  if (contentLength > maxBytes) throw new Error("PAYLOAD_TOO_LARGE");
  const text = await request.text();
  if (new TextEncoder().encode(text).byteLength > maxBytes) throw new Error("PAYLOAD_TOO_LARGE");
  return JSON.parse(text);
}
