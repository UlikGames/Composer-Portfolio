"use client";

import { useDeferredValue, useMemo, useState } from "react";
import { RotateCcw, Search } from "lucide-react";
import { WorkCard } from "@/components/work-card";
import type { Work } from "@/lib/types";

export function WorksCatalog({ works, instrumentations, tags }: { works: Work[]; instrumentations: string[]; tags: string[] }) {
  const [query, setQuery] = useState("");
  const [instrumentation, setInstrumentation] = useState("all");
  const [tag, setTag] = useState("all");
  const deferredQuery = useDeferredValue(query.trim().toLowerCase());
  const filtered = useMemo(() => works.filter((work) => {
    const matchesInstrument = instrumentation === "all" || work.instrumentation.includes(instrumentation);
    const matchesTag = tag === "all" || work.tags.includes(tag);
    const haystack = `${work.title} ${work.year} ${work.instrumentation.join(" ")} ${work.tags.join(" ")}`.toLowerCase();
    return matchesInstrument && matchesTag && (!deferredQuery || haystack.includes(deferredQuery));
  }), [deferredQuery, instrumentation, tag, works]);

  const resetFilters = () => {
    setQuery("");
    setInstrumentation("all");
    setTag("all");
  };

  return (
    <>
      <div className="catalog-toolbar">
        <div className="container filters">
          <label style={{ position: "relative" }}>
            <span className="sr-only">Search works</span>
            <Search size={17} style={{ position: "absolute", left: "1rem", top: "1.05rem", color: "var(--muted)" }} />
            <input className="input" style={{ paddingLeft: "2.7rem" }} value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search title, year or tag" />
          </label>
          <label>
            <span className="filter-label">Instrument</span>
            <select className="select" value={instrumentation} onChange={(event) => setInstrumentation(event.target.value)}>
              <option value="all">All instruments</option>
              {instrumentations.map((item) => <option key={item} value={item}>{item}</option>)}
            </select>
          </label>
          <label>
            <span className="filter-label">Tag</span>
            <select className="select" value={tag} onChange={(event) => setTag(event.target.value)}>
              <option value="all">All tags</option>
              {tags.map((item) => <option key={item} value={item}>{item}</option>)}
            </select>
          </label>
          <button className="icon-button filter-reset" type="button" aria-label="Reset all filters" title="Reset filters" onClick={resetFilters} disabled={!query && instrumentation === "all" && tag === "all"}>
            <RotateCcw size={17} />
          </button>
        </div>
      </div>
      <section className="section">
        <div className="container">
          <p className="catalog-count" aria-live="polite">Showing {filtered.length} of {works.length} works</p>
          {filtered.length ? <div className="catalog-grid">{filtered.map((work) => <WorkCard key={work.id} work={work} />)}</div> : <p className="page-lede">No works match those filters.</p>}
        </div>
      </section>
    </>
  );
}
