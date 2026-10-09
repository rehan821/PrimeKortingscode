import { NextResponse, type NextRequest } from "next/server";
import { ROOT_SEGMENTS } from "@/lib/routes";
import { isUnknownDetailSlug } from "@/lib/known-slugs";

/**
 * Locale plumbing + 404 routing for the server:
 *
 * 1. Exposes the active locale as `x-locale`, because not-found boundaries
 *    receive no params and must still render the correct language.
 * 2. Rejects unknown single-segment paths (e.g. `/fr`): without a rewrite the
 *    `[locale]` route would match them and Next would render a blank,
 *    client-assembled error shell. Rewriting to a path no route matches lets
 *    the server-rendered `global-not-found` handle it (real 404 HTML).
 * 3. Does the same for detail URLs whose slug does not exist (e.g.
 *    `/winkels/onzin`), because static detail routes stream a 200 soft-404
 *    for unknown parameters under partial prefetching.
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const segments = pathname.split("/").filter(Boolean);
  const first = segments[0] ?? "";
  const locale = first === "en" ? "en" : "nl";

  const headers = new Headers(request.headers);
  headers.set("x-locale", locale);
  headers.set("x-pathname", pathname);

  const isUnknownRoot = segments.length === 1 && !ROOT_SEGMENTS.has(first);
  if (isUnknownRoot || isUnknownDetailSlug(pathname)) {
    const url = request.nextUrl.clone();
    url.pathname = "/nl/ontbrekend";
    return NextResponse.rewrite(url, { request: { headers } });
  }

  return NextResponse.next({ request: { headers } });
}

export const config = {
  matcher: [
    // Everything except Next internals and static files.
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|avif|ico|css|js|mjs|txt|xml|json|woff|woff2)$).*)",
  ],
};
