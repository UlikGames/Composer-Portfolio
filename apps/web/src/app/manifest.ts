import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return { name: "Ulvin Najafov Composer Portfolio", short_name: "Ulvin Najafov", description: "Scores and recordings by composer Ulvin Najafov.", start_url: "/", display: "standalone", background_color: "#0b0d10", theme_color: "#0b0d10" };
}
