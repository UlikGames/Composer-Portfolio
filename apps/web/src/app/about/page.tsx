import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export const metadata: Metadata = {
  title: "About",
  description: "Meet Ulvin Najafov, a mechanical engineering student, composer and pianist writing contemporary classical music.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <>
      <header className="page-hero">
        <div className="container">
          <p className="eyebrow reveal">Biography · Method · Intent</p>
          <h1 className="display page-title reveal">Built between<br /><em className="brass">two disciplines.</em></h1>
          <p className="page-lede reveal">I study machines and motion, then bring the same curiosity to melody, orchestration and form.</p>
        </div>
      </header>
      <section className="section">
        <div className="container about-grid">
          <div className="portrait-placeholder reveal" aria-label="Ulvin Najafov monogram portrait placeholder"><span>UN</span></div>
          <div className="prose reveal">
            <p>I’m Ulvin Najafov, a mechanical engineering student who also composes and performs contemporary classical music. I’m fascinated by how the same ideas appear in both worlds: tension and release, balance, symmetry, resonance and the way small details shape the whole.</p>
            <p>My musical language sits close to the Romantic tradition, with lyric melody, rich harmony and clear storytelling, but I frame it with modern pacing and texture. I’m drawn to pieces that feel designed: themes return with purpose, harmonies bend under pressure and climaxes arrive like a mechanism locking into place.</p>
            <p>Most of my work begins at the piano, where sketches become miniatures, waltzes, nocturnes and larger forms. Some pieces expand into chamber writing and orchestral color. The goal stays the same: make something emotionally direct and structurally honest.</p>
            <p>This portfolio is a living archive of scores, recordings and projects in progress. Performers, ensembles, collaborators and curious listeners are all welcome.</p>
            <Link className="button button-brass" href="/contact">Begin a collaboration <ArrowUpRight size={16} /></Link>
          </div>
        </div>
      </section>
      <section className="section hairline">
        <div className="container manifesto-grid">
          <div><p className="eyebrow reveal">Working principles</p><h2 className="display manifesto-title reveal">Clarity.<br />Pressure.<br />Release.</h2></div>
          <blockquote className="manifesto-copy reveal">“I write music like I design mechanisms: emotion needs a structure to live inside.”</blockquote>
        </div>
      </section>
    </>
  );
}
