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
    <footer className="border-t border-brand-900 bg-brand-800 text-white/80">
      <div className="shell grid grid-cols-2 gap-x-5 gap-y-6 py-7 sm:gap-9 sm:py-10 lg:grid-cols-4">
        <div className="col-span-2 max-w-none sm:col-span-1 sm:max-w-sm">
          <Logo locale={locale} tone="dark" />
          <p className="mt-3 text-sm leading-6 text-white/75 sm:mt-4 sm:leading-relaxed">{dict.footer.aboutText}</p>
          <p className="mt-2 text-xs text-white/55 sm:mt-4">{dict.footer.demoNote}</p>
        </div>

        <nav aria-label={dict.footer.discoverTitle}>
          <h2 className="text-sm font-bold uppercase tracking-wide text-white">
            {dict.footer.discoverTitle}
          </h2>
          <ul className="mt-3 space-y-2 text-sm sm:mt-4 sm:space-y-2.5">
            {items.map((item) => (
              <li key={item.key}>
                  <Link href={item.href} className="text-white/70 hover:text-white">
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
          <ul className="mt-3 space-y-2 text-sm sm:mt-4 sm:space-y-2.5">
            {categories.map((category) => (
              <li key={category.id}>
                <Link
                  href={pathFor(locale, "category", category.slug)}
                  className="text-white/70 hover:text-white"
                >
                  {category.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav className="col-span-2 sm:col-span-1" aria-label={dict.footer.helpTitle}>
          <h2 className="text-sm font-bold uppercase tracking-wide text-white">
            {dict.footer.helpTitle}
          </h2>
          <ul className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm sm:mt-4 sm:flex-col sm:items-start sm:gap-x-0 sm:gap-y-2.5">
            <li>
              <Link href={pathFor(locale, "contact")} className="text-white/70 hover:text-white">
                {dict.footer.contact}
              </Link>
            </li>
            <li>
              <Link href={pathFor(locale, "privacy")} className="text-white/70 hover:text-white">
                {dict.footer.privacy}
              </Link>
            </li>
          </ul>
          <p className="mt-4 text-xs leading-relaxed text-white/55 sm:mt-6">{dict.footer.disclaimer}</p>
        </nav>
      </div>

      <div className="border-t border-white/15">
        <div className="shell flex flex-col gap-2 py-4 text-xs text-white/55 sm:flex-row sm:items-center sm:justify-between sm:py-5">
          <p>
            © {year} {siteConfig.name}. {dict.footer.rights}
          </p>
          <p>
            {dict.footer.legalTitle}:{" "}
            <Link href={pathFor(locale, "privacy")} className="text-white/70 hover:text-white">
              {dict.footer.privacy}
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
