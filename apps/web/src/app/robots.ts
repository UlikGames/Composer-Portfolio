import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return { rules: { userAgent: "*", allow: "/", disallow: ["/api/", "/hande"] }, sitemap: "https://composer-ulik.vercel.app/sitemap.xml" };
}
