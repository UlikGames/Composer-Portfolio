"use client";

import { FocusCards } from "@/components/ui/focus-cards";
import type { Work } from "@/lib/types";

export function FocusWorks({ works }: { works: Work[] }) {
  const cards = works
    .map((work) => ({ title: work.title, src: work.thumbnailUrl || work.imageUrl || "" }))
    .filter((card) => card.src)
    .slice(0, 4);

  if (!cards.length) return null;

  return (
    <section className="focus-works-section hairline" aria-labelledby="focus-works-title">
      <div className="container">
        <div className="focus-works-heading">
          <div>
            <p className="eyebrow">Selected transmissions</p>
            <h2 className="display" id="focus-works-title">Latest works</h2>
          </div>
          <p>Four recent pieces from the catalog. Open Works to search by title, instrumentation, or tag.</p>
        </div>
        <FocusCards cards={cards} />
      </div>
    </section>
  );
}
