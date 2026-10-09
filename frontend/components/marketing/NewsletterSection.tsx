"use client";

import { useState } from "react";
import type { Dictionary } from "@/i18n/dictionary";
import { CheckIcon, MailIcon } from "@/components/ui/icons";
import { cn } from "@/lib/cn";

interface NewsletterSectionProps {
  dict: Dictionary;
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/**
 * Newsletter signup (demo): validates in the browser and confirms without
 * sending anything — the real endpoint is wired up by the backend later.
 */
export function NewsletterSection({ dict }: NewsletterSectionProps) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "error" | "success">("idle");

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!EMAIL_PATTERN.test(email.trim())) {
      setStatus("error");
      return;
    }
    setStatus("success");
  }

  if (status === "success") {
    return (
      <div className="flex items-center gap-3 rounded-2xl border border-success-100 bg-success-50 px-5 py-4">
        <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-success-500 text-white">
          <CheckIcon size={18} />
        </span>
        <div>
          <p className="text-sm font-bold text-success-700">{dict.newsletter.success}</p>
          <p className="text-xs text-success-600">{dict.newsletter.demoHint}</p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="w-full max-w-xl">
      <div className="flex flex-col gap-2.5 sm:flex-row">
        <label htmlFor="newsletter-email" className="sr-only">
          {dict.newsletter.placeholder}
        </label>
        <div className="relative flex-1">
          <span className="pointer-events-none absolute inset-y-0 left-3.5 flex items-center text-ink-400">
            <MailIcon size={18} />
          </span>
          <input
            id="newsletter-email"
            type="email"
            name="email"
            value={email}
            onChange={(event) => {
              setEmail(event.target.value);
              if (status === "error") setStatus("idle");
            }}
            placeholder={dict.newsletter.placeholder}
            aria-invalid={status === "error"}
            aria-describedby={status === "error" ? "newsletter-error" : undefined}
            className={cn(
              "h-12 w-full rounded-xl border bg-white pl-10 pr-3 text-sm text-ink-900 placeholder:text-ink-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-200",
              status === "error" ? "border-danger-500" : "border-ink-200 hover:border-ink-300",
            )}
          />
        </div>
        <button
          type="submit"
          className="h-12 shrink-0 rounded-xl bg-brand-600 px-6 text-sm font-bold text-white transition-colors hover:bg-brand-700"
        >
          {dict.newsletter.submit}
        </button>
      </div>
      {status === "error" ? (
        <p id="newsletter-error" role="alert" className="mt-2 text-sm font-medium text-danger-600">
          {dict.newsletter.error}
        </p>
      ) : (
        <p className="mt-2 text-xs text-ink-500">{dict.newsletter.consent}</p>
      )}
    </form>
  );
}
