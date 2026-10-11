import type { NextConfig } from "next";

/**
 * Locale routing:
 *
 * - Dutch (default) lives at the root: `/winkels`, `/kortingscodes`, …
 * - English lives under `/en`: `/en/stores`, `/en/coupons`, …
 *
 * The internal route tree is `app/[locale]/…` for both locales, so Dutch
 * public paths are rewritten onto `/nl/…` (`beforeFiles`). Direct requests
 * for the internal `/nl/…` URLs are permanently redirected back to the
 * public Dutch URLs to avoid duplicate content.
 */
const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  experimental: {
    // Server-rendered 404 for every unmatched URL (see app/global-not-found.tsx).
    globalNotFound: true,
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  images: {
    // Local, generated raster assets only — SVG uploads stay disabled.
  },
  async redirects() {
    return [
      { source: "/nl", destination: "/", permanent: true },
      { source: "/nl/:path*", destination: "/:path*", permanent: true },
      // English-template path names opened under the Dutch root (or via the
      // /nl strip above) land on the real Dutch page instead of a 404.
      { source: "/stores/:slug*", destination: "/winkels/:slug*", permanent: true },
      { source: "/categories/:slug*", destination: "/categorieen/:slug*", permanent: true },
      { source: "/coupons/:slug*", destination: "/kortingscodes/:slug*", permanent: true },
      { source: "/search", destination: "/zoeken", permanent: true },
      { source: "/privacy", destination: "/privacybeleid", permanent: true },
      { source: "/sign-in", destination: "/inloggen", permanent: true },
    ];
  },
  async rewrites() {
    return {
      beforeFiles: [
        { source: "/", destination: "/nl" },
        { source: "/winkels/:slug*", destination: "/nl/winkels/:slug*" },
        { source: "/categorieen/:slug*", destination: "/nl/categorieen/:slug*" },
        { source: "/kortingscodes/:slug*", destination: "/nl/kortingscodes/:slug*" },
        { source: "/deals/:slug*", destination: "/nl/deals/:slug*" },
        { source: "/zoeken", destination: "/nl/zoeken" },
        { source: "/blog/:slug*", destination: "/nl/blog/:slug*" },
        { source: "/contact", destination: "/nl/contact" },
        { source: "/privacybeleid", destination: "/nl/privacybeleid" },
        { source: "/inloggen", destination: "/nl/inloggen" },
      ],
    };
  },
};

export default nextConfig;
