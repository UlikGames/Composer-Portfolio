import Link from "next/link";
import { NewsletterForm } from "@/components/newsletter-form";

export function SiteFooter() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <p className="footer-title">Sound, engineered<br />for feeling.</p>
            <p className="muted">Scores, recordings and works in progress by composer and pianist Ulvin Najafov.</p>
          </div>
          <nav className="footer-nav" aria-label="Footer navigation">
            <Link className="text-link" href="/works">Works</Link>
            <Link className="text-link" href="/about">About</Link>
            <Link className="text-link" href="/contact">Contact</Link>
            <a className="text-link" href="https://musescore.com/user/41748651" rel="noreferrer" target="_blank">MuseScore</a>
            <a className="text-link" href="https://open.spotify.com/user/1swb2wzs1183zklymc4ox9t0k" rel="noreferrer" target="_blank">Spotify</a>
          </nav>
          <div>
            <p className="eyebrow">Release notes</p>
            <p className="muted">Occasional updates when a new score or recording is ready.</p>
            <NewsletterForm />
          </div>
        </div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} Ulvin Najafov</span>
          <span>Scores and recordings for portfolio use</span>
        </div>
      </div>
    </footer>
  );
}
