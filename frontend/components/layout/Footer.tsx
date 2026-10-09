import Link from "next/link";
import type { Locale } from "@/types";
import type { Dictionary } from "@/i18n/dictionary";
import { getNavItems } from "@/lib/navigation";
import { pathFor } from "@/lib/routes";
import { getPopularCategories } from "@/services/categories";
import { getCurrentYear } from "@/services/shared";
import { Logo } from "./Logo";
import { siteConfig } from "@/config/site";

interface FooterProps {
  locale: Locale;
  dict: Dictionary;
}

/** Site footer — internal links are data-driven (categories come from the service layer). */
export async function Footer({ locale, dict }: FooterProps) {
  const categories = await getPopularCategories(6, locale);
  const items = getNavItems(locale, dict);
  const year = await getCurrentYear();

  return (
    <footer className="border-t border-ink-200 bg-ink-950 text-ink-300">
      <div className="shell grid gap-9 py-10 sm:grid-cols-2 lg:grid-cols-4">
        <div className="max-w-sm">
          <Logo locale={locale} tone="dark" />
          <p className="mt-4 text-sm leading-relaxed text-ink-400">{dict.footer.aboutText}</p>
          <p className="mt-4 text-xs text-ink-500">{dict.footer.demoNote}</p>
        </div>

        <nav aria-label={dict.footer.discoverTitle}>
          <h2 className="text-sm font-bold uppercase tracking-wide text-white">
            {dict.footer.discoverTitle}
          </h2>
          <ul className="mt-4 space-y-2.5 text-sm">
            {items.map((item) => (
              <li key={item.key}>
                <Link href={item.href} className="text-ink-400 hover:text-white">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label={dict.footer.categoriesTitle}>
          <h2 className="text-sm font-bold uppercase tracking-wide text-white">
            {dict.footer.categoriesTitle}
          </h2>
          <ul className="mt-4 space-y-2.5 text-sm">
            {categories.map((category) => (
              <li key={category.id}>
                <Link
                  href={pathFor(locale, "category", category.slug)}
                  className="text-ink-400 hover:text-white"
                >
                  {category.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label={dict.footer.helpTitle}>
          <h2 className="text-sm font-bold uppercase tracking-wide text-white">
            {dict.footer.helpTitle}
          </h2>
          <ul className="mt-4 space-y-2.5 text-sm">
            <li>
              <Link href={pathFor(locale, "contact")} className="text-ink-400 hover:text-white">
                {dict.footer.contact}
              </Link>
            </li>
            <li>
              <Link href={pathFor(locale, "privacy")} className="text-ink-400 hover:text-white">
                {dict.footer.privacy}
              </Link>
            </li>
          </ul>
          <p className="mt-6 text-xs leading-relaxed text-ink-500">{dict.footer.disclaimer}</p>
        </nav>
      </div>

      <div className="border-t border-ink-800">
        <div className="shell flex flex-col gap-2 py-5 text-xs text-ink-500 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {siteConfig.name}. {dict.footer.rights}
          </p>
          <p>
            {dict.footer.legalTitle}:{" "}
            <Link href={pathFor(locale, "privacy")} className="text-ink-400 hover:text-white">
              {dict.footer.privacy}
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
