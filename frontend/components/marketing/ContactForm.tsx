"use client";

import { useState } from "react";
import type { Dictionary } from "@/i18n/dictionary";
import { buttonClass } from "@/components/ui/button";
import { InfoIcon } from "@/components/ui/icons";
import { cn } from "@/lib/cn";

interface ContactFormProps {
  dict: Dictionary;
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

type Errors = { name?: string; email?: string; message?: string };

/**
 * Contact form (demo): validates in the browser and confirms without sending.
 * The real endpoint is wired up by the backend later.
 */
export function ContactForm({ dict }: ContactFormProps) {
  const [values, setValues] = useState({ name: "", email: "", message: "" });
  const [errors, setErrors] = useState<Errors>({});
  const [sent, setSent] = useState(false);

  function update(field: keyof typeof values, value: string) {
    setValues((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const next: Errors = {};
    if (!values.name.trim()) next.name = dict.contact.errorRequired;
    if (!EMAIL_PATTERN.test(values.email.trim())) next.email = dict.contact.errorEmail;
    if (!values.message.trim()) next.message = dict.contact.errorRequired;
    setErrors(next);
    if (Object.keys(next).length === 0) setSent(true);
  }

  if (sent) {
    return (
      <div role="status" className="flex items-center gap-3 rounded-2xl border border-brand-100 bg-brand-50 px-5 py-4">
        <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-brand-700">
          <InfoIcon size={18} />
        </span>
        <div>
          <p className="text-sm font-bold text-ink-800">{dict.contact.demoHint}</p>
        </div>
      </div>
    );
  }

  const fieldClass = (invalid: boolean) =>
    cn(
      "h-11 w-full rounded-xl border bg-white px-3 text-sm text-ink-900 placeholder:text-ink-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-200",
      invalid ? "border-danger-500" : "border-ink-200 hover:border-ink-300",
    );

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      <div>
        <label htmlFor="contact-name" className="block text-sm font-semibold text-ink-800">
          {dict.contact.name}
        </label>
        <input
          id="contact-name"
          name="name"
          value={values.name}
          onChange={(event) => update("name", event.target.value)}
          aria-invalid={Boolean(errors.name)}
          className={cn("mt-1.5", fieldClass(Boolean(errors.name)))}
        />
        {errors.name ? (
          <p role="alert" className="mt-1 text-sm font-medium text-danger-600">
            {errors.name}
          </p>
        ) : null}
      </div>

      <div>
        <label htmlFor="contact-email" className="block text-sm font-semibold text-ink-800">
          {dict.contact.email}
        </label>
        <input
          id="contact-email"
          name="email"
          type="email"
          value={values.email}
          onChange={(event) => update("email", event.target.value)}
          aria-invalid={Boolean(errors.email)}
          className={cn("mt-1.5", fieldClass(Boolean(errors.email)))}
        />
        {errors.email ? (
          <p role="alert" className="mt-1 text-sm font-medium text-danger-600">
            {errors.email}
          </p>
        ) : null}
      </div>

      <div>
        <label htmlFor="contact-message" className="block text-sm font-semibold text-ink-800">
          {dict.contact.message}
        </label>
        <textarea
          id="contact-message"
          name="message"
          rows={5}
          value={values.message}
          onChange={(event) => update("message", event.target.value)}
          aria-invalid={Boolean(errors.message)}
          className={cn(
            "mt-1.5 w-full rounded-xl border bg-white px-3 py-2.5 text-sm text-ink-900 placeholder:text-ink-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-200",
            errors.message ? "border-danger-500" : "border-ink-200 hover:border-ink-300",
          )}
        />
        {errors.message ? (
          <p role="alert" className="mt-1 text-sm font-medium text-danger-600">
            {errors.message}
          </p>
        ) : null}
      </div>

      <div className="flex items-center gap-3">
        <button type="submit" className={buttonClass("primary", "md")}>
          {dict.contact.submit}
        </button>
        <p className="text-xs text-ink-500">{dict.contact.demoHint}</p>
      </div>
    </form>
  );
}
