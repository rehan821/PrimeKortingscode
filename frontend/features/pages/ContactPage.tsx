import type { Locale } from "@/types";
import type { Dictionary } from "@/i18n/dictionary";
import { siteConfig } from "@/config/site";
import { pathFor } from "@/lib/routes";
import { breadcrumbJsonLd } from "@/lib/jsonld";
import { PageHeader } from "@/components/layout/PageHeader";
import { Breadcrumbs } from "@/components/common/Breadcrumbs";
import { ContactForm } from "@/components/marketing/ContactForm";
import { MailIcon, ClockIcon, InfoIcon } from "@/components/ui/icons";
import { JsonLd } from "@/components/seo/JsonLd";

interface ContactPageProps {
  locale: Locale;
  dict: Dictionary;
}

/** Contact page — informational cards plus the (demo) message form. */
export function ContactPage({ locale, dict }: ContactPageProps) {
  const homePath = pathFor(locale, "home");

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: dict.common.home, path: homePath },
          { name: dict.contact.title, path: pathFor(locale, "contact") },
        ])}
      />
      <PageHeader title={dict.contact.title} description={dict.contact.description} />
      <div className="shell py-8">
        <Breadcrumbs
          label={dict.breadcrumb.label}
          items={[{ label: dict.common.home, path: homePath }, { label: dict.contact.title }]}
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <a
            href={`mailto:${siteConfig.contactEmail}`}
            className="flex items-start gap-3 rounded-2xl border border-ink-200 bg-white p-5 shadow-card transition hover:border-brand-300"
          >
            <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
              <MailIcon size={20} />
            </span>
            <span>
              <span className="block text-sm font-bold text-ink-900">{dict.contact.emailTitle}</span>
              <span className="mt-0.5 block text-sm text-brand-700">{siteConfig.contactEmail}</span>
            </span>
          </a>

          <div className="flex items-start gap-3 rounded-2xl border border-ink-200 bg-white p-5 shadow-card">
            <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
              <ClockIcon size={20} />
            </span>
            <span>
              <span className="block text-sm font-bold text-ink-900">
                {dict.contact.responseTitle}
              </span>
              <span className="mt-0.5 block text-sm text-ink-600">
                {dict.contact.responseValue}
              </span>
            </span>
          </div>
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-2">
          <section aria-labelledby="contact-topics">
            <h2 id="contact-topics" className="flex items-center gap-2 text-lg font-bold text-ink-900">
              <InfoIcon size={18} />
              {dict.contact.topicsTitle}
            </h2>
            <ul className="mt-3 space-y-2">
              {dict.contact.topics.map((topic) => (
                <li key={topic} className="flex items-start gap-2 text-sm text-ink-600">
                  <span aria-hidden="true" className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-500" />
                  {topic}
                </li>
              ))}
            </ul>
          </section>

          <section aria-labelledby="contact-form">
            <h2 id="contact-form" className="text-lg font-bold text-ink-900">
              {dict.contact.formTitle}
            </h2>
            <div className="mt-3">
              <ContactForm dict={dict} />
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
