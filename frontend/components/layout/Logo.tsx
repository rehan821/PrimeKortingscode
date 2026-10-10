import Link from "next/link";
import { siteConfig } from "@/config/site";
import { pathFor } from "@/lib/routes";
import type { Locale } from "@/types";

/** Brand mark — tag glyph with bold two-tone wordmark. */
export function Logo({
  locale,
  tone = "light",
  className,
}: {
  locale: Locale;
  tone?: "light" | "dark";
  className?: string;
}) {
  const isLight = tone === "light";

  return (
    <Link
      href={pathFor(locale, "home")}
      className={`inline-flex items-center gap-2 ${className ?? ""}`}
      aria-label={siteConfig.name}
    >
      {/* Icon mark */}
      <span
        aria-hidden="true"
        className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand-600"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          {/* Tag outline */}
          <path
            d="M4.5 4.5h6.086c.53 0 1.04.21 1.414.586l7.828 7.828a2 2 0 0 1 0 2.828l-5.086 5.086a2 2 0 0 1-2.828 0L4.086 12.5A2 2 0 0 1 3.5 11.086V5.5a1 1 0 0 1 1-1Z"
            fill="rgba(255,255,255,0.18)"
            stroke="white"
            strokeWidth="1.5"
          />
          {/* Percent symbol */}
          <circle cx="8" cy="9" r="1.1" fill="white" />
          <path d="M7.5 13.5L13 7.5" stroke="white" strokeWidth="1.6" strokeLinecap="round" />
          <circle cx="13" cy="13" r="1.1" fill="white" />
        </svg>
      </span>

      {/* Wordmark */}
      <span className="leading-none">
        <span
          className={`block text-[1.1rem] font-black tracking-tight ${
            isLight ? "text-ink-900" : "text-white"
          }`}
        >
          Prime
          <span className={isLight ? "text-brand-600" : "text-brand-300"}>Korting</span>
          <span className={`font-semibold ${isLight ? "text-ink-500" : "text-brand-200/70"}`}>
            scode
          </span>
        </span>
      </span>
    </Link>
  );
}
