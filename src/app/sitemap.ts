import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  if (!SITE_URL) {
    return [];
  }

  return [
    { url: new URL("/Conv/", SITE_URL).toString(), changeFrequency: "monthly", priority: 1 },
    { url: new URL("/Diff/", SITE_URL).toString(), changeFrequency: "monthly", priority: 0.8 },
    { url: new URL("/Export/", SITE_URL).toString(), changeFrequency: "monthly", priority: 0.8 },
  ];
}
