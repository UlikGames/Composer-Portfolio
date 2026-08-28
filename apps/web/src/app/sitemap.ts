import type { MetadataRoute } from "next";
import { works } from "@/lib/works";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://composer-ulik.vercel.app";
  const staticRoutes = ["", "/works", "/about", "/contact"].map((path) => ({ url: `${base}${path}`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: path === "" ? 1 : .8 }));
  return [...staticRoutes, ...works.map((work) => ({ url: `${base}/works/${work.id}`, lastModified: new Date(), changeFrequency: "yearly" as const, priority: .65 }))];
}
