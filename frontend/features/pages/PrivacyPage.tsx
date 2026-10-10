import type { Locale } from "@/types";
import type { Dictionary } from "@/i18n/dictionary";
import { pathFor } from "@/lib/routes";
import { formatDate } from "@/lib/date";
import { breadcrumbJsonLd } from "@/lib/jsonld";
import { PageHeader } from "@/components/layout/PageHeader";
import { Breadcrumbs } from "@/components/common/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";

interface PrivacyPageProps {
  locale: Locale;
  dict: Dictionary;
}

/** Last content review date — shown as "last updated". */
const LAST_UPDATED = "2026-10-01T00:00:00.000Z";

/** Privacy policy page — original, plain-language, dictionary-driven copy. */
export function PrivacyPage({ locale, dict }: PrivacyPageProps) {
  const homePath = pathFor(locale, "home");

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: dict.common.home, path: homePath },
          { name: dict.privacy.title, path: pathFor(locale, "privacy") },
        ])}
      />
      <PageHeader title={dict.privacy.title} description={dict.privacy.description} />
      <div className="shell py-8">
        <Breadcrumbs
          label={dict.breadcrumb.label}
          items={[{ label: dict.common.home, path: homePath }, { label: dict.privacy.title }]}
        />

        <article className="mx-auto max-w-3xl">
          <p className="text-sm text-ink-500">
            {dict.privacy.lastUpdated}: {formatDate(LAST_UPDATED, locale)}
          </p>

          <div className="mt-6 space-y-8">
            {dict.privacy.sections.map((section) => (
              <section key={section.heading}>
                <h2 className="text-lg font-bold text-ink-900">{section.heading}</h2>
                <p className="mt-2 text-sm leading-relaxed text-ink-600">{section.body}</p>
              </section>
            ))}
          </div>

          <p className="mt-8 rounded-xl bg-ink-50 px-4 py-3 text-xs text-ink-500">
            {dict.footer.demoNote}
          </p>
        </article>
      </div>
    </>
  );
}
