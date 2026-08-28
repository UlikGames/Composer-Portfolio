"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import ScrollStack, { ScrollStackItem } from "@/components/ScrollStack";
import { WorkCard } from "@/components/work-card";
import type { Work } from "@/lib/types";

export function FeaturedWorkStack({ works }: { works: Work[] }) {
  return (
    <ScrollStack
      className="featured-stack"
      useWindowScroll
      itemDistance={110}
      itemScale={0.035}
      itemStackDistance={18}
      stackPosition="14%"
      scaleEndPosition="5%"
      baseScale={0.88}
      rotationAmount={0}
      blurAmount={0}
    >
      {works.map((work, index) => (
        <ScrollStackItem itemClassName="featured-stack-item" key={work.id}>
          <div className="featured-stack-rail" aria-hidden="true">
            <span>{String(index + 1).padStart(2, "0")}</span>
            <span>{work.year}</span>
          </div>
          <WorkCard work={work} priority={index < 2} />
        </ScrollStackItem>
      ))}
      <ScrollStackItem itemClassName="featured-stack-close">
        <p>Sixty-three works, from solo piano miniatures to orchestral forms.</p>
        <Link href="/works" className="button button-primary">
          Enter the full catalog <ArrowUpRight size={16} />
        </Link>
      </ScrollStackItem>
    </ScrollStack>
  );
}
