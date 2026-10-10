import type { MetadataRoute } from "next";
import { siteUrl } from "@/config/site";

/** Crawler policy: index the public site, keep the internal `/nl` tree out. */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/nl"],
      },
    ],
    sitemap: siteUrl("/sitemap.xml"),
    host: siteUrl("/"),
  };
}
