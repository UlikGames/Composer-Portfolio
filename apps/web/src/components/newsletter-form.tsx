"use client";

import { ArrowRight } from "lucide-react";
import { useState } from "react";

export function NewsletterForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    const form = event.currentTarget;
    const email = new FormData(form).get("email");
    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, website: "" }),
      });
      const result = (await response.json()) as { message?: string };
      if (!response.ok) throw new Error(result.message || "Subscription failed.");
      form.reset();
      setStatus("success");
      setMessage("You are on the list.");
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Please try again.");
    }
  }

  return (
    <form onSubmit={submit}>
      <div className="newsletter">
        <label className="sr-only" htmlFor="newsletter-email">Email address</label>
        <input className="input" id="newsletter-email" name="email" type="email" autoComplete="email" maxLength={254} placeholder="Email for new releases" required />
        <button className="icon-button" type="submit" aria-label="Subscribe" disabled={status === "loading"}>
          <ArrowRight size={18} />
        </button>
      </div>
      <p className="form-status" data-state={status}>{message}</p>
    </form>
  );
}
