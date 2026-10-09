import type { Metadata } from "next";
import type { Locale } from "@/types";
import { siteConfig, siteUrl } from "@/config/site";
import { alternatePathFor, pathFor, type RouteKey } from "@/lib/routes";

interface BuildMetadataOptions {
  locale: Locale;
  /** Route key — canonical + hreflang are derived from it. */
  key: RouteKey;
  /** Entity slug for parameterised routes. */
  slug?: string;
  /** Page title (site name is appended via the title template). */
  title: string;
  description: string;
  /** Home page sets an absolute title (site name only). */
  titleAbsolute?: boolean;
  ogType?: "website" | "article";
  /** Root-relative image path in /public. */
  image?: string;
  publishedTime?: string;
  modifiedTime?: string;
  authors?: string[];
  noIndex?: boolean;
}

const OG_LOCALE: Record<Locale, string> = { nl: "nl_NL", en: "en_GB" };
const DEFAULT_OG_IMAGE = "/og-default.svg";

/**
 * Builds complete page metadata: title, description, canonical URL,
 * localized hreflang alternates, Open Graph and Twitter card.
 * Used by every route's `generateMetadata`.
 */
export function buildMetadata({
  locale,
  key,
  slug,
  title,
  description,
  titleAbsolute = false,
  ogType = "website",
  image = DEFAULT_OG_IMAGE,
  publishedTime,
  modifiedTime,
  authors,
  noIndex = false,
}: BuildMetadataOptions): Metadata {
  const path = pathFor(locale, key, slug);
  const canonical = siteUrl(path);
  const other = locale === "nl" ? "en" : "nl";
  const alternate = siteUrl(alternatePathFor(locale, key, slug, other));
  const defaultPath = siteUrl(pathFor("nl", key, slug));
  const imageAbs = image.startsWith("http") ? image : siteUrl(image);

  return {
    title: titleAbsolute ? title : { default: title, template: `%s | ${siteConfig.name}` },
    description,
    alternates: {
      canonical,
      languages: {
        nl: siteUrl(pathFor("nl", key, slug)),
        en: siteUrl(pathFor("en", key, slug)),
        "x-default": defaultPath,
        [other]: alternate,
      },
    },
    openGraph: {
      type: ogType,
      url: canonical,
      siteName: siteConfig.name,
      title,
      description,
      locale: OG_LOCALE[locale],
      alternateLocale: OG_LOCALE[other],
      images: [{ url: imageAbs, width: 1200, height: 630, alt: title }],
      ...(publishedTime ? { publishedTime } : {}),
      ...(modifiedTime ? { modifiedTime } : {}),
      ...(authors ? { authors } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageAbs],
    },
    ...(noIndex ? { robots: { index: false, follow: false } } : {}),
  };
}
