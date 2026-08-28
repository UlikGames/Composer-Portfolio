import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { MovementButton, WorkActions } from "@/components/work-actions";
import { SpecialWorkArtwork, SpecialWorkTitle } from "@/components/special-work-easter-egg";
import { getNewWorks, getWorkById, works } from "@/lib/works";

export function generateStaticParams() {
  return works.map((work) => ({ id: work.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const work = getWorkById(id);
  if (!work) return {};
  const description = `${work.title}, a ${work.year} work for ${work.instrumentation.join(", ")} by Ulvin Najafov.`;
  return {
    title: work.title,
    description,
    alternates: { canonical: `/works/${work.id}` },
    openGraph: { title: work.title, description, images: work.imageUrl ? [{ url: work.imageUrl }] : undefined },
  };
}

export default async function WorkDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const work = getWorkById(id);
  if (!work) notFound();
  const image = work.imageUrl || work.thumbnailUrl;
  const related = getNewWorks(work.id, 3);

  return (
    <>
      <section className="section">
        <div className="container">
          <Link href="/works" className="text-link"><ArrowLeft size={14} /> Back to catalog</Link>
          <div className="detail-grid" style={{ marginTop: "2rem" }}>
            <SpecialWorkArtwork image={image} title={work.title} workId={work.id} />
            <div>
              <p className="eyebrow reveal">{work.year} · {work.duration}</p>
              <SpecialWorkTitle title={work.title} workId={work.id} />
              <p className="page-lede reveal">A work for {work.instrumentation.join(", ")}. {work.performanceNote ?? "Recording and score materials are presented for listening, study and performance enquiries."}</p>
              <div className="tag-list reveal">{work.tags.map((tag) => <span className="tag" key={tag}>{tag}</span>)}</div>
              <WorkActions work={work} />
              {work.movements?.length ? (
                <div className="reveal" style={{ marginTop: "4rem" }}>
                  <p className="eyebrow">Movements</p>
                  <ol className="movement-list">
                    {work.movements.map((movement, index) => (
                      <li className="movement" key={`${movement.title}-${index}`}>
                        <span className="muted">{String(index + 1).padStart(2, "0")}</span>
                        <span>{movement.title}<small className="muted" style={{ display: "block", marginTop: ".25rem" }}>{movement.duration}</small></span>
                        {movement.audioUrl && <MovementButton work={work} index={index} />}
                      </li>
                    ))}
                  </ol>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </section>
      {related.length > 0 && (
        <section className="section hairline">
          <div className="container">
            <div className="section-heading"><div><p className="eyebrow">Continue listening</p><h2 className="display">Recent works</h2></div><Link href="/works" className="button button-ghost">View all <ArrowUpRight size={16} /></Link></div>
            <div className="catalog-grid">{related.map((item) => <Link key={item.id} className="work-card work-body" href={`/works/${item.id}`}><p className="work-meta">{item.year}</p><h3 className="work-title">{item.title}</h3><p className="muted">{item.instrumentation.join(", ")}</p></Link>)}</div>
          </div>
        </section>
      )}
    </>
  );
}
