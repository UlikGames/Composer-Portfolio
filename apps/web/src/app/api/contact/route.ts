import { env } from "@composer-portfolio/env/server";
import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { z } from "zod";
import { escapeHtml, isRateLimited, safeJson, sameOrigin } from "@/lib/request-security";

const schema = z.object({
  name: z.string().trim().min(2).max(80).regex(/^[^\u0000-\u001F\u007F]+$/),
  email: z.string().trim().email().max(254),
  subject: z.enum(["Performance enquiry", "Commission", "Collaboration", "Score question", "General message"]),
  message: z.string().trim().min(10).max(4000),
  website: z.string().max(0).optional().default(""),
}).strict();

export async function POST(request: NextRequest) {
  if (!sameOrigin(request)) return NextResponse.json({ message: "Request rejected." }, { status: 403 });
  if (isRateLimited(request, "contact", 5)) return NextResponse.json({ message: "Too many messages. Please try later." }, { status: 429 });
  try {
    const parsed = schema.safeParse(await safeJson(request));
    if (!parsed.success) return NextResponse.json({ message: "Please check the form fields." }, { status: 400 });
    if (!env.RESEND_API_KEY || !(env.CONTACT_EMAIL || env.RESEND_TO_EMAIL)) {
      console.error("Contact service configuration is incomplete.");
      return NextResponse.json({ message: "Email service is temporarily unavailable." }, { status: 503 });
    }
    const { name, email, subject, message } = parsed.data;
    const resend = new Resend(env.RESEND_API_KEY);
    const result = await resend.emails.send({
      from: `Portfolio Contact <${env.RESEND_FROM_EMAIL ?? "onboarding@resend.dev"}>`,
      to: [env.CONTACT_EMAIL ?? env.RESEND_TO_EMAIL!],
      replyTo: email,
      subject: `[${subject}] Message from ${name}`,
      html: `<h2>New portfolio message</h2><p><strong>Name:</strong> ${escapeHtml(name)}</p><p><strong>Email:</strong> ${escapeHtml(email)}</p><p><strong>Subject:</strong> ${escapeHtml(subject)}</p><p style="white-space:pre-wrap">${escapeHtml(message)}</p>`,
      text: `Name: ${name}\nEmail: ${email}\nSubject: ${subject}\n\n${message}`,
    });
    if (result.error) throw new Error("RESEND_FAILED");
    return NextResponse.json({ message: "Message sent." });
  } catch (error) {
    if (error instanceof Error && error.message === "PAYLOAD_TOO_LARGE") return NextResponse.json({ message: "Message is too large." }, { status: 413 });
    console.error("Contact endpoint failed.");
    return NextResponse.json({ message: "Message could not be sent." }, { status: 500 });
  }
}
