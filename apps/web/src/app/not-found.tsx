import Link from "next/link";

export default function NotFound() {
  return <div className="container section"><p className="eyebrow">404 · Tacet</p><h1 className="display page-title">Nothing sounds<br />at this address.</h1><Link className="button button-primary" href="/works">Return to the works</Link></div>;
}
