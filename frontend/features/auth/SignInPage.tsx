"use client";

import { useEffect, useRef, useState, type ClipboardEvent, type FormEvent, type KeyboardEvent } from "react";
import Link from "next/link";
import type { Locale } from "@/types";
import type { Dictionary } from "@/i18n/dictionary";
import { Logo } from "@/components/layout/Logo";
import { siteConfig } from "@/config/site";
import { pathFor } from "@/lib/routes";

/* ============================================================================
 *  Sign-in / Sign-up page — email first, then a one-time code (or password).
 *
 *  Visual pattern follows the reference screens: purple brand bar, centred
 *  card on light grey, pill buttons, six-digit code boxes. Every user-facing
 *  string comes from the dictionary (`auth` section), so new locales only
 *  need translated JSON.
 *
 *  This is a frontend demo: no credentials leave the browser. The flow is
 *  fully interactive so it can later be wired to a real auth API by swapping
 *  the submit handlers.
 * ========================================================================== */

type Step = "email" | "code" | "password" | "done";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const CODE_LENGTH = 6;
const RESEND_SECONDS = 30;

/** Masks an address the way the reference does: r***5@gmail.com */
function maskEmail(email: string): string {
  const [local = "", domain = ""] = email.split("@");
  if (!domain) return email;
  const head = local.slice(0, 1);
  const tail = local.length > 2 ? local.slice(-1) : "";
  return `${head}***${tail}@${domain}`;
}

interface SignInPageProps {
  locale: Locale;
  dict: Dictionary;
  /** Copyright year — computed server-side (Client Components must not call `new Date()` during prerender). */
  year: number;
}

export function SignInPage({ locale, dict, year }: SignInPageProps) {
  const t = dict.auth ?? {};
  const privacyHref = pathFor(locale, "privacy");
  const homeHref = pathFor(locale, "home");

  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [code, setCode] = useState<string[]>(Array(CODE_LENGTH).fill(""));
  const [codeError, setCodeError] = useState("");
  const [notice, setNotice] = useState("");
  const [resendIn, setResendIn] = useState(0);

  const emailInputRef = useRef<HTMLInputElement | null>(null);
  const codeRefs = useRef<Array<HTMLInputElement | null>>([]);

  /* Desktop matches the reference's focused email box; mobile skips the
     automatic keyboard. */
  useEffect(() => {
    if (step === "email" && typeof window !== "undefined" && window.innerWidth >= 640) {
      emailInputRef.current?.focus();
    }
  }, [step]);

  /* Resend countdown. */
  useEffect(() => {
    if (resendIn <= 0) return;
    const timer = setTimeout(() => setResendIn((s) => s - 1), 1000);
    return () => clearTimeout(timer);
  }, [resendIn]);

  /* Notices (social login, forgot password, resend) clear themselves. */
  useEffect(() => {
    if (!notice) return;
    const timer = setTimeout(() => setNotice(""), 4500);
    return () => clearTimeout(timer);
  }, [notice]);

  /* ---------------------------------------------------------------- actions */

  function goToCode() {
    setStep("code");
    setCode(Array(CODE_LENGTH).fill(""));
    setCodeError("");
    setResendIn(RESEND_SECONDS);
    setTimeout(() => codeRefs.current[0]?.focus(), 50);
  }

  function submitEmail(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const value = email.trim();
    if (!EMAIL_RE.test(value)) {
      setEmailError(t.errorEmail ?? "");
      emailInputRef.current?.focus();
      return;
    }
    setEmailError("");
    goToCode();
  }

  function verifyCode(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (code.filter(Boolean).length < CODE_LENGTH) {
      setCodeError(t.errorCompleteCode ?? "");
      return;
    }
    setCodeError("");
    setStep("done");
  }

  function submitPassword(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!EMAIL_RE.test(email.trim()) || !password) {
      setEmailError(!EMAIL_RE.test(email.trim()) ? (t.errorEmail ?? "") : "");
      return;
    }
    setStep("done");
  }

  function onCodeChange(index: number, raw: string) {
    const digits = raw.replace(/\D/g, "");
    if (!digits) {
      setCode((prev) => prev.map((d, i) => (i === index ? "" : d)));
      return;
    }
    if (digits.length === 1) {
      setCode((prev) => prev.map((d, i) => (i === index ? digits : d)));
      setCodeError("");
      if (index < CODE_LENGTH - 1) codeRefs.current[index + 1]?.focus();
      return;
    }
    /* Pasted sequence — fill forward from this box. */
    const slots = digits.slice(0, CODE_LENGTH - index).split("");
    setCode((prev) => prev.map((d, i) => (i >= index && i < index + slots.length ? slots[i - index] : d)));
    setCodeError("");
    codeRefs.current[Math.min(index + slots.length, CODE_LENGTH - 1)]?.focus();
  }

  function onCodeKeyDown(index: number, event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Backspace" && !code[index] && index > 0) {
      codeRefs.current[index - 1]?.focus();
    }
  }

  function onCodePaste(event: ClipboardEvent<HTMLInputElement>) {
    const text = event.clipboardData.getData("text").replace(/\D/g, "");
    if (!text) return;
    event.preventDefault();
    const start = code.findIndex((d) => !d);
    onCodeChange(start === -1 ? 0 : start, text);
  }

  /* ------------------------------------------------------------------ chrome */

  return (
    <div className="signin-page flex min-h-screen flex-col bg-[#f5f5f6]">
      {/* Purple brand bar — replaces the site header on this page. */}
      <div className="flex h-16 items-center justify-center bg-brand-600 sm:h-20">
        <Logo locale={locale} tone="dark" className="scale-110 sm:scale-125" />
      </div>

      <main className="flex-1 px-5 py-8 sm:py-12">
        <h1 className="text-center text-[26px] font-bold leading-tight text-ink-950 sm:text-4xl">
          {t.heading}
        </h1>

        <div className="relative mx-auto mt-8 w-full max-w-[480px] sm:mt-12">
          {/* Decorative soft shapes (desktop only) — echoes the reference's
              side illustrations without borrowing any brand imagery. */}
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 hidden lg:block">
            <div className="absolute -left-52 top-4 h-72 w-72 rounded-full bg-gradient-to-br from-rose-200/70 to-brand-100/60" />
            <div className="absolute -right-56 -top-10 h-80 w-80 rounded-full bg-gradient-to-br from-brand-200/60 to-fuchsia-300/40" />
            <div className="absolute -left-44 top-12 w-40 -rotate-6 rounded-2xl bg-white p-4 shadow-[0_10px_30px_rgba(23,7,87,0.12)]">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-brand-50">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="text-brand-600">
                  <path d="M4.5 4.5h6.086c.53 0 1.04.21 1.414.586l7.828 7.828a2 2 0 0 1 0 2.828l-5.086 5.086a2 2 0 0 1-2.828 0L4.086 12.5A2 2 0 0 1 3.5 11.086V5.5a1 1 0 0 1 1-1Z" />
                  <path d="M7.5 13.5 13 7.5" strokeLinecap="round" />
                </svg>
              </span>
              <p className="mt-3 text-lg font-bold leading-tight text-ink-950">
                {locale === "nl" ? "15% korting" : "15% off"}
              </p>
              <p className="mt-1 text-xs font-medium text-ink-500">
                {locale === "nl" ? "Nu beschikbaar" : "Available now"}
              </p>
            </div>
          </div>

          {/* ---------------------------------------------------------- card */}
          <div className="rounded-2xl bg-white px-5 py-7 shadow-[0_10px_40px_rgba(23,7,87,0.08)] sm:px-10 sm:py-9">
            {/* Demo notices (social login, forgot password, resend) */}
            {notice ? (
              <p role="status" className="mb-5 rounded-xl bg-brand-50 px-4 py-3 text-center text-sm font-medium text-brand-700">
                {notice}
              </p>
            ) : null}

            {/* ---------------------------------------------- step: email */}
            {step === "email" ? (
              <>
                <p className="text-center text-[15px] font-bold text-ink-500">{t.continueWith}</p>

                <form onSubmit={submitEmail} noValidate className="mt-5">
                  <label htmlFor="signin-email" className="block text-[15px] font-bold text-ink-950">
                    {t.emailLabel}
                  </label>
                  <input
                    id="signin-email"
                    ref={emailInputRef}
                    type="email"
                    inputMode="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (emailError) setEmailError("");
                    }}
                    placeholder={t.emailPlaceholder}
                    aria-invalid={Boolean(emailError)}
                    aria-describedby={emailError ? "signin-email-error" : undefined}
                    className={`mt-2 h-12 w-full rounded-xl border bg-white px-4 text-base text-ink-950 outline-none transition-colors placeholder:text-ink-400 focus:border-brand-500 focus:ring-2 focus:ring-brand-200 sm:h-[52px] ${
                      emailError ? "border-red-500" : "border-ink-300"
                    }`}
                  />
                  {emailError ? (
                    <p id="signin-email-error" className="mt-1.5 text-sm font-medium text-red-600">
                      {emailError}
                    </p>
                  ) : null}

                  <button
                    type="submit"
                    className="mt-4 h-12 w-full rounded-full bg-brand-600 text-base font-bold text-white transition-colors hover:bg-brand-700 sm:h-[52px]"
                  >
                    {t.continue}
                  </button>
                </form>

                <Divider label={t.or} className="my-5" />

                <button
                  type="button"
                  onClick={() => setStep("password")}
                  className="h-12 w-full rounded-full border border-ink-300 text-base font-semibold text-ink-500 transition-colors hover:bg-ink-50"
                >
                  {t.passwordLogin}
                </button>

                <SocialRow onPick={() => setNotice(t.socialNotice ?? "")} labels={socialLabels(locale)} />

                <p className="mt-6 text-center text-sm leading-relaxed text-ink-600">
                  {t.termsBefore}
                  <Link href={privacyHref} className="font-semibold text-ink-950 underline underline-offset-2">
                    {t.termsOfService}
                  </Link>
                  {t.and}
                  <Link href={privacyHref} className="font-semibold text-ink-950 underline underline-offset-2">
                    {t.privacyPolicy}
                  </Link>
                  {t.termsAfter}
                </p>
              </>
            ) : null}

            {/* ---------------------------------------------- step: code */}
            {step === "code" ? (
              <>
                <h2 className="text-center text-2xl font-bold text-ink-950">{t.codeTitle}</h2>
                <p className="mt-3 text-center text-[15px] leading-relaxed text-ink-600">
                  {t.sentTo} <span className="font-bold text-ink-950">{maskEmail(email.trim())}</span>
                </p>
                <p className="mt-3 text-center text-[15px] leading-relaxed text-ink-600">
                  <span className="font-bold text-ink-950">{t.oneTimeLinkBold}</span> {t.oneTimeLinkRest}
                </p>

                <Divider label={t.or} className="my-5" />

                <form onSubmit={verifyCode} noValidate>
                  <p className="text-center text-[15px] font-bold text-ink-950">{t.codePrompt}</p>

                  <div className="mt-4 flex justify-center gap-2" onPaste={onCodePaste}>
                    {code.map((digit, index) => (
                      <input
                        key={index}
                        ref={(el) => {
                          codeRefs.current[index] = el;
                        }}
                        value={digit}
                        onChange={(e) => onCodeChange(index, e.target.value)}
                        onKeyDown={(e) => onCodeKeyDown(index, e)}
                        inputMode="numeric"
                        autoComplete={index === 0 ? "one-time-code" : "off"}
                        maxLength={CODE_LENGTH}
                        aria-label={`${t.codeLabel} ${index + 1}`}
                        className={`h-14 w-full max-w-[52px] rounded-xl border-2 bg-white text-center text-xl font-bold text-ink-950 outline-none transition-colors focus:border-brand-500 ${
                          codeError ? "border-red-400" : "border-ink-300"
                        }`}
                      />
                    ))}
                  </div>

                  {codeError ? (
                    <p role="alert" className="mt-2 text-center text-sm font-medium text-red-600">
                      {codeError}
                    </p>
                  ) : null}

                  <button
                    type="submit"
                    disabled={code.filter(Boolean).length < CODE_LENGTH}
                    className={`mt-5 h-12 w-full rounded-full text-base font-bold text-white transition-colors sm:h-[52px] ${
                      code.filter(Boolean).length < CODE_LENGTH
                        ? "cursor-not-allowed bg-ink-300"
                        : "bg-black hover:bg-ink-800"
                    }`}
                  >
                    {t.verify}
                  </button>
                </form>

                <p className="mt-6 text-center text-[15px] text-ink-500">{t.didntReceive}</p>
                <div className="mt-2 flex justify-center gap-6">
                  <button
                    type="button"
                    onClick={() => setStep("email")}
                    className="text-[15px] font-bold text-ink-950 underline underline-offset-2"
                  >
                    {t.changeEmail}
                  </button>
                  <button
                    type="button"
                    disabled={resendIn > 0}
                    onClick={() => {
                      setResendIn(RESEND_SECONDS);
                      setNotice(t.resent ?? "");
                    }}
                    className={`text-[15px] font-bold underline underline-offset-2 ${
                      resendIn > 0 ? "cursor-not-allowed text-ink-400" : "text-ink-950"
                    }`}
                  >
                    {resendIn > 0 ? (t.resendIn ?? "").replace("{n}", String(resendIn)) : t.resendEmail}
                  </button>
                </div>
              </>
            ) : null}

            {/* ------------------------------------------ step: password */}
            {step === "password" ? (
              <>
                <h2 className="text-center text-2xl font-bold text-ink-950">{t.passwordTitle}</h2>

                <form onSubmit={submitPassword} noValidate className="mt-5">
                  <label htmlFor="signin-password-email" className="block text-[15px] font-bold text-ink-950">
                    {t.emailLabel}
                  </label>
                  <input
                    id="signin-password-email"
                    type="email"
                    inputMode="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t.emailPlaceholder}
                    className="mt-2 h-12 w-full rounded-xl border border-ink-300 bg-white px-4 text-base text-ink-950 outline-none transition-colors placeholder:text-ink-400 focus:border-brand-500 focus:ring-2 focus:ring-brand-200 sm:h-[52px]"
                  />

                  <label htmlFor="signin-password" className="mt-4 block text-[15px] font-bold text-ink-950">
                    {t.passwordLabel}
                  </label>
                  <div className="relative mt-2">
                    <input
                      id="signin-password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder={t.passwordPlaceholder}
                      className="h-12 w-full rounded-xl border border-ink-300 bg-white px-4 pr-16 text-base text-ink-950 outline-none transition-colors placeholder:text-ink-400 focus:border-brand-500 focus:ring-2 focus:ring-brand-200 sm:h-[52px]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((s) => !s)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-bold text-ink-500 hover:text-ink-800"
                    >
                      {showPassword ? t.hidePassword : t.showPassword}
                    </button>
                  </div>

                  <button
                    type="submit"
                    disabled={!password}
                    className={`mt-5 h-12 w-full rounded-full text-base font-bold text-white transition-colors sm:h-[52px] ${
                      !password ? "cursor-not-allowed bg-ink-300" : "bg-black hover:bg-ink-800"
                    }`}
                  >
                    {t.logIn}
                  </button>
                </form>

                <div className="mt-5 flex flex-col items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setNotice(t.forgotNotice ?? "")}
                    className="text-sm font-medium text-ink-500 underline underline-offset-2 hover:text-ink-800"
                  >
                    {t.forgotPassword}
                  </button>
                  <button
                    type="button"
                    onClick={() => setStep("email")}
                    className="text-[15px] font-bold text-ink-950 underline underline-offset-2"
                  >
                    {t.useCodeLink}
                  </button>
                </div>
              </>
            ) : null}

            {/* --------------------------------------------- step: done */}
            {step === "done" ? (
              <div className="py-4 text-center">
                <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-brand-50">
                  <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" className="text-brand-600" aria-hidden="true">
                    <path d="m5 13 4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
                <h2 className="mt-4 text-2xl font-bold text-ink-950">{t.successTitle}</h2>
                <p className="mx-auto mt-2 max-w-[340px] text-[15px] leading-relaxed text-ink-600">
                  {t.successBody}
                </p>
                <Link
                  href={homeHref}
                  className="mt-6 inline-flex h-12 items-center rounded-full bg-black px-8 text-base font-bold text-white transition-colors hover:bg-ink-800"
                >
                  {t.continueHome}
                </Link>
              </div>
            ) : null}
          </div>
        </div>
      </main>

      {/* Minimal copyright line — replaces the site footer on this page. */}
      <footer className="border-t border-ink-200 bg-[#f5f5f6] py-6 text-center text-sm text-ink-500">
        © {year} {siteConfig.name}. {dict.footer?.rights}
      </footer>
    </div>
  );
}

/* ------------------------------------------------------------------ parts */

function Divider({ label, className }: { label?: string; className?: string }) {
  return (
    <div className={`flex items-center gap-3 ${className ?? ""}`} aria-hidden="true">
      <span className="h-px flex-1 bg-ink-200" />
      <span className="text-sm font-bold text-ink-950">{label}</span>
      <span className="h-px flex-1 bg-ink-200" />
    </div>
  );
}

function socialLabels(locale: Locale) {
  return locale === "nl"
    ? { google: "Doorgaan met Google", facebook: "Doorgaan met Facebook", apple: "Doorgaan met Apple", yahoo: "Doorgaan met Yahoo" }
    : { google: "Continue with Google", facebook: "Continue with Facebook", apple: "Continue with Apple", yahoo: "Continue with Yahoo" };
}

function SocialRow({ onPick, labels }: { onPick: () => void; labels: Record<string, string> }) {
  const base =
    "flex h-11 w-11 items-center justify-center rounded-full border border-ink-300 bg-white transition-colors hover:border-ink-400 hover:bg-ink-50";
  return (
    <div className="mt-6 flex justify-center gap-3">
      <button type="button" onClick={onPick} aria-label={labels.google} className={base}>
        <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
          <path fill="#4285F4" d="M23.5 12.3c0-.9-.1-1.5-.3-2.2H12v4.1h6.5c-.1 1.1-.8 2.7-2.4 3.8l3.7 2.9c2.3-2.1 3.7-5.2 3.7-8.6z" />
          <path fill="#34A853" d="M12 24c3.2 0 5.9-1.1 7.9-2.9l-3.7-2.9c-1 .7-2.4 1.2-4.2 1.2-3.2 0-5.9-2.1-6.9-5l-3.9 3c2 3.9 6 6.6 10.8 6.6z" />
          <path fill="#FBBC05" d="M5.1 14.4c-.3-.8-.4-1.5-.4-2.4s.2-1.7.4-2.4l-3.9-3C.4 8.2 0 10 0 12s.4 3.8 1.2 5.4l3.9-3z" />
          <path fill="#EA4335" d="M12 4.7c1.8 0 3 .8 3.7 1.4l2.7-2.6C16.9 1.1 14.7 0 12 0 7.2 0 3.2 2.7 1.2 6.6l3.9 3c1-2.9 3.7-4.9 6.9-4.9z" />
        </svg>
      </button>
      <button type="button" onClick={onPick} aria-label={labels.facebook} className={base}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="#1877F2" aria-hidden="true">
          <path d="M24 12c0-6.6-5.4-12-12-12S0 5.4 0 12c0 6 4.4 11 10.1 11.9v-8.4H7.1V12h3V9.4c0-3 1.8-4.7 4.5-4.7 1.3 0 2.7.2 2.7.2v3h-1.5c-1.5 0-2 .9-2 1.9V12h3.3l-.5 3.5h-2.8v8.4C19.6 23 24 18 24 12z" />
        </svg>
      </button>
      <button type="button" onClick={onPick} aria-label={labels.apple} className={base}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="text-black" aria-hidden="true">
          <path d="M16.7 12.8c0-2.6 2.1-3.8 2.2-3.9-1.2-1.8-3.1-2-3.8-2-1.6-.2-3.1.9-3.9.9-.8 0-2.1-.9-3.4-.9-1.8 0-3.4 1-4.3 2.6-1.8 3.2-.5 7.9 1.3 10.5.9 1.3 1.9 2.7 3.3 2.6 1.3-.1 1.8-.9 3.4-.9s2 .9 3.4.8c1.4 0 2.3-1.3 3.2-2.6 1-1.5 1.4-2.9 1.4-3-.1 0-2.8-1.1-2.8-4.1zM14.2 4.8c.7-.9 1.2-2.1 1.1-3.3-1 0-2.3.7-3 1.6-.7.8-1.3 2-1.1 3.2 1.1.1 2.3-.6 3-1.5z" />
        </svg>
      </button>
      <button type="button" onClick={onPick} aria-label={labels.yahoo} className={base}>
        <span className="text-[15px] font-black italic text-[#6001d2]" aria-hidden="true">Y!</span>
      </button>
    </div>
  );
}
