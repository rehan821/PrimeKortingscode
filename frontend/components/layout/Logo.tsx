import Link from "next/link";
import { siteConfig } from "@/config/site";
import { pathFor } from "@/lib/routes";
import type { Locale } from "@/types";

/** Brand mark — a compact tag glyph plus the wordmark. */
export function Logo({
  locale,
  tone = "light",
  className,
}: {
  locale: Locale;
  /** `light` = on white backgrounds, `dark` = on ink backgrounds. */
  tone?: "light" | "dark";
  className?: string;
}) {
  return (
    <Link
      href={pathFor(locale, "home")}
      className={`inline-flex items-center gap-2.5 ${className ?? ""}`}
      aria-label={siteConfig.name}
    >
      <span
        aria-hidden="true"
        className={`inline-flex h-9 w-9 items-center justify-center rounded-xl text-white shadow-sm ${
          tone === "dark" ? "bg-brand-500" : "bg-brand-600"
        }`}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M4 12.2V5.5A1.5 1.5 0 0 1 5.5 4h6.7c.4 0 .8.16 1.06.44l7.3 7.3a1.5 1.5 0 0 1 0 2.12l-6.7 6.7a1.5 1.5 0 0 1-2.12 0l-7.3-7.3A1.5 1.5 0 0 1 4 12.2Z"
            fill="currentColor"
            opacity="0.22"
          />
          <path
            d="M4 12.2V5.5A1.5 1.5 0 0 1 5.5 4h6.7c.4 0 .8.16 1.06.44l7.3 7.3a1.5 1.5 0 0 1 0 2.12l-6.7 6.7a1.5 1.5 0 0 1-2.12 0l-7.3-7.3A1.5 1.5 0 0 1 4 12.2Z"
            stroke="currentColor"
            strokeWidth="1.6"
          />
          <path d="M8.4 8.4l4.6 4.6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          <circle cx="8.7" cy="8.7" r="1.2" fill="currentColor" />
          <circle cx="13.1" cy="13.1" r="1.2" fill="currentColor" />
        </svg>
      </span>
      <span
        className={`text-[1.05rem] font-extrabold leading-none tracking-tight ${
          tone === "dark" ? "text-white" : "text-ink-900"
        }`}
      >
        Prime
        <span className={tone === "dark" ? "text-brand-300" : "text-brand-600"}>
          Kortingscode
        </span>
      </span>
    </Link>
  );
}
