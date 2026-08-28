"use client";

import { Send } from "lucide-react";
import { useState } from "react";

export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    setStatus("loading");
    setMessage("Sending…");
    const data = Object.fromEntries(new FormData(form));
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = (await response.json()) as { message?: string };
      if (!response.ok) throw new Error(result.message || "Message could not be sent.");
      form.reset();
      setStatus("success");
      setMessage("Message sent. Thank you for reaching out.");
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Please try again.");
    }
  }

  return (
    <form className="form-grid" onSubmit={submit}>
      <div className="field"><label htmlFor="name">Name</label><input className="input" id="name" name="name" autoComplete="name" minLength={2} maxLength={80} required /></div>
      <div className="field"><label htmlFor="email">Email</label><input className="input" id="email" name="email" type="email" autoComplete="email" maxLength={254} required /></div>
      <div className="field"><label htmlFor="subject">Subject</label><select className="select" id="subject" name="subject" defaultValue="Performance enquiry" required><option>Performance enquiry</option><option>Commission</option><option>Collaboration</option><option>Score question</option><option>General message</option></select></div>
      <div className="field"><label htmlFor="message">Message</label><textarea className="textarea" id="message" name="message" minLength={10} maxLength={4000} required /></div>
      <div className="sr-only" aria-hidden="true"><label htmlFor="website">Website</label><input id="website" name="website" tabIndex={-1} autoComplete="off" /></div>
      <button className="button button-brass" type="submit" disabled={status === "loading"}><Send size={16} /> {status === "loading" ? "Sending" : "Send message"}</button>
      <p className="form-status" data-state={status} aria-live="polite">{message}</p>
    </form>
  );
}
