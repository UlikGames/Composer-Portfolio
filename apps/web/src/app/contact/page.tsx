import type { Metadata } from "next";
import { Mail, Music2 } from "lucide-react";
import { ContactForm } from "@/components/contact-form";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contact composer and pianist Ulvin Najafov about performances, commissions, scores and collaborations.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <>
      <header className="page-hero"><div className="container"><p className="eyebrow reveal">Performance · Commission · Conversation</p><h1 className="display page-title reveal">Let the next piece<br /><em className="brass">begin here.</em></h1><p className="page-lede reveal">Tell me about the performance, ensemble, project or question you have in mind.</p></div></header>
      <section className="section">
        <div className="container contact-grid">
          <div className="reveal">
            <p className="eyebrow">Direct contact</p>
            <h2 className="display manifesto-title">Open to serious<br />curiosity.</h2>
            <p className="page-lede">Performers, orchestras, filmmakers, fellow composers and listeners are welcome to write.</p>
            <div style={{ display: "grid", gap: "1rem", marginTop: "2rem" }}>
              <a className="button button-ghost" href="mailto:ulvin.oguzlu@gmail.com"><Mail size={16} /> ulvin.oguzlu@gmail.com</a>
              <a className="button button-ghost" href="https://musescore.com/user/41748651" target="_blank" rel="noreferrer"><Music2 size={16} /> MuseScore profile</a>
            </div>
          </div>
          <div className="reveal"><ContactForm /></div>
        </div>
      </section>
    </>
  );
}
