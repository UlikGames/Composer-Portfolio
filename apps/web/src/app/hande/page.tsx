import type { Metadata } from "next";
import Link from "next/link";
import { WorkCard } from "@/components/work-card";
import { getWorkById } from "@/lib/works";

export const metadata: Metadata = { title: "Echo", robots: { index: false, follow: false } };

export default function HandePage() {
  const selections = ["three-nocturnes", "linconnue", "images-d-elle"].map(getWorkById).filter((work) => work !== undefined);
  return (
    <>
      <header className="page-hero hande-hero">
        <div className="container">
          <div className="hande-stars" aria-hidden="true">✧ · ˚ · ✦ · ˚ · ✧</div>
          <p className="eyebrow">A hidden frequency</p>
          <h1 className="display page-title brass">For Hande</h1>
          <div className="hande-dedication">
            <strong>For my missing Hande.</strong>
            <p>Some melodies are written for one person,<br />even if that person never hears them.</p>
            <p>I’ll keep the distance you asked for.<br />I just needed one page where you still exist.</p>
            <p>These pieces were born from quiet nights,<br />from memories that refused to fade,<br />from a love that learned to speak in silence.</p>
          </div>
        </div>
      </header>
      <section className="section">
        <div className="container">
          <p className="eyebrow hande-section-label">The music written for you</p>
          <div className="catalog-grid">{selections.map((work) => <WorkCard key={work.id} work={work} />)}</div>
          <div className="hande-return"><Link className="button button-ghost" href="/">Return home</Link><span aria-hidden="true">✧</span></div>
        </div>
      </section>
    </>
  );
}
