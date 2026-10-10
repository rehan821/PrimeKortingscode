import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionary";
import { buildMetadata } from "@/lib/seo";
import { SignInPage } from "@/features/auth/SignInPage";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export function generateStaticParams(): { locale: string }[] {
  return [{ locale: "nl" }, { locale: "en" }];
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const dict = await getDictionary(locale);
  return buildMetadata({
    locale,
    key: "signin",
    title: dict.auth.metaTitle,
    description: dict.auth.metaDescription,
    // Auth screens are noindexed and kept out of the sitemap on purpose.
    noIndex: true,
  });
}

export default function SignInRoute({ params }: PageProps) {
  // Suspense boundary lets the dynamic part (request-time year) stream
  // while the route itself stays prerenderable — required by cacheComponents.
  return (
    <Suspense fallback={null}>
      <SignInContent params={params} />
    </Suspense>
  );
}

async function SignInContent({ params }: PageProps) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = await getDictionary(locale);
  // Render at request time (cacheComponents): the copyright year is "now".
  await connection();
  return <SignInPage locale={locale} dict={dict} year={new Date().getFullYear()} />;
}
