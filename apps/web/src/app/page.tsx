import Link from "next/link";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import SplitText from "@/components/SplitText";
import { ResonanceStage } from "@/components/resonance-stage";
import { FocusWorks } from "@/components/focus-works";
import { getNewWorks, works } from "@/lib/works";

export default function HomePage() {
  const latest = getNewWorks(undefined, 4);
  const featured = latest.length ? latest : works.filter((work) => work.isFeatured).slice(0, 4);

  return (
    <>
      <section className="hero">
        <div className="container hero-grid">
          <div className="hero-copy">
            <p className="eyebrow reveal">Composer · Pianist · Engineer</p>
            <SplitText
              text="Engineering emotion into music."
              tag="h1"
              className="display hero-title"
              splitType="words"
              textAlign="left"
              delay={90}
              duration={1.1}
              ease="power4.out"
              from={{ opacity: 0, yPercent: 112, rotate: 1.5 }}
              to={{ opacity: 1, yPercent: 0, rotate: 0 }}
              rootMargin="0px"
            />
            <p className="hero-lede reveal">Contemporary classical works shaped by resonance, structure and atmosphere. Explore recordings, study the scores, or begin a collaboration.</p>
            <div className="hero-actions reveal">
              <Link href="/works" className="button button-primary">Explore works <ArrowDownRight size={16} /></Link>
              <Link href="/contact" className="button button-ghost">Start a conversation <ArrowUpRight size={16} /></Link>
            </div>
          </div>
          <div className="hero-stage reveal"><ResonanceStage /></div>
        </div>
      </section>

      <section className="section hairline">
        <div className="container manifesto-grid">
          <div>
            <p className="eyebrow reveal">Composer portfolio · 2025</p>
            <h2 className="display manifesto-title reveal">Where design<br />meets sound.</h2>
          </div>
          <div>
            <p className="manifesto-copy reveal">Themes return like mechanisms. Harmony bends under pressure. A score becomes a machine built to carry feeling.</p>
            <p className="manifesto-note reveal">Ulvin Najafov is a mechanical engineering student, composer and pianist. His music sits near the Romantic tradition while drawing its momentum from modern pacing, texture and structural clarity.</p>
            <Link href="/about" className="button button-ghost reveal">Read the story <ArrowUpRight size={16} /></Link>
          </div>
        </div>
      </section>

      <FocusWorks works={featured} />

      <section className="section hairline">
        <div className="container stats reveal">
          <div className="stat"><strong>{works.length}</strong><span>Works catalogued</span></div>
          <div className="stat"><strong>{works.filter((work) => work.scoreUrl || work.scores?.length).length}</strong><span>Scores available</span></div>
          <div className="stat"><strong>{new Set(works.flatMap((work) => work.instrumentation)).size}</strong><span>Instrumental voices</span></div>
        </div>
      </section>
    </>
  );
}
