import type { Metadata } from "next";
import { WorksCatalog } from "@/components/works-catalog";
import { getInstrumentationFilters, getTagFilters, works } from "@/lib/works";

export const metadata: Metadata = {
  title: "Works",
  description: "Browse recordings and scores for piano, chamber ensembles and orchestra by Ulvin Najafov.",
  alternates: { canonical: "/works" },
};

export default function WorksPage() {
  return (
    <>
      <header className="page-hero">
        <div className="container">
          <p className="eyebrow reveal">Catalog · {works.length} works</p>
          <h1 className="display page-title reveal">The works</h1>
          <p className="page-lede reveal">Listen across the catalog, filter by instrumental color, and open available scores. Every piece remains connected to its original recording in the Backblaze B2 archive.</p>
        </div>
      </header>
      <WorksCatalog works={works} instrumentations={getInstrumentationFilters()} tags={getTagFilters()} />
    </>
  );
}
