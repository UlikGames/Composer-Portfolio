import { env } from "@composer-portfolio/env/server";
import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { z } from "zod";
import { escapeHtml, isRateLimited, safeJson, sameOrigin } from "@/lib/request-security";

const schema = z.object({ email: z.string().trim().email().max(254), website: z.string().max(0).optional().default("") }).strict();

export async function POST(request: NextRequest) {
  if (!sameOrigin(request)) return NextResponse.json({ message: "Request rejected." }, { status: 403 });
  if (isRateLimited(request, "newsletter", 8)) return NextResponse.json({ message: "Too many attempts. Please try later." }, { status: 429 });
  try {
    const parsed = schema.safeParse(await safeJson(request, 2_000));
    if (!parsed.success) return NextResponse.json({ message: "Enter a valid email address." }, { status: 400 });
    if (!env.RESEND_API_KEY || !(env.CONTACT_EMAIL || env.RESEND_TO_EMAIL)) return NextResponse.json({ message: "Subscription service is temporarily unavailable." }, { status: 503 });
    const resend = new Resend(env.RESEND_API_KEY);
    const email = parsed.data.email;
    const result = await resend.emails.send({
      from: `Portfolio Newsletter <${env.RESEND_FROM_EMAIL ?? "onboarding@resend.dev"}>`,
      to: [env.CONTACT_EMAIL ?? env.RESEND_TO_EMAIL!],
      subject: "New portfolio subscriber",
      html: `<p><strong>Email:</strong> ${escapeHtml(email)}</p>`,
      text: `New portfolio subscriber: ${email}`,
    });
    if (result.error) throw new Error("RESEND_FAILED");
    return NextResponse.json({ message: "Subscribed." });
  } catch (error) {
    if (error instanceof Error && error.message === "PAYLOAD_TOO_LARGE") return NextResponse.json({ message: "Request is too large." }, { status: 413 });
    console.error("Newsletter endpoint failed.");
    return NextResponse.json({ message: "Subscription could not be completed." }, { status: 500 });
  }
}
