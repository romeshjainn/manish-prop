import type { MetadataRoute } from "next";
import { previewMode, siteUrl } from "@/config/site";

export default function robots(): MetadataRoute.Robots {
  // Preview builds contain sample content: keep them out of search engines.
  if (previewMode) return { rules: { userAgent: "*", disallow: "/" } };
  return { rules: { userAgent: "*", allow: "/" }, sitemap: `${siteUrl}/sitemap.xml` };
}
