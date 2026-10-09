"use client";

import { useEffect, useRef } from "react";
import type { Locale, CouponWithRelations } from "@/types";
import type { Dictionary } from "@/i18n/dictionary";
import { safeRedirect } from "@/lib/url";
import { interpolate } from "@/lib/date";
import { pathFor } from "@/lib/routes";
import { StoreLogo } from "@/components/store/StoreLogo";
import { VerifiedBadge, ExpiryIndicator } from "@/components/common/Status";
import { CloseIcon, ExternalLinkIcon, InfoIcon } from "@/components/ui/icons";
import { CopyCodeButton } from "./CopyCodeButton";
import { buttonClass } from "@/components/ui/button";

interface CouponModalProps {
  coupon: CouponWithRelations;
  locale: Locale;
  dict: Dictionary;
  onClose: () => void;
}

/** Coupon reveal modal — code, copy action and store redirect in one step. */
export function CouponModal({ coupon, locale, dict, onClose }: CouponModalProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    closeButtonRef.current?.focus();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  const fallbackStore = pathFor(locale, "store", coupon.store.slug);
  const destination = safeRedirect(coupon.redirectUrl) ?? fallbackStore;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-ink-950/60 p-4 sm:items-center"
      onClick={onClose}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="coupon-modal-title"
        tabIndex={-1}
        onClick={(event) => event.stopPropagation()}
        className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-2xl bg-white p-5 shadow-pop sm:p-6"
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <StoreLogo
              name={coupon.store.name}
              initials={coupon.store.initials}
              brandColor={coupon.store.brandColor}
              size="sm"
            />
            <div>
              <p className="text-sm font-bold text-ink-900">{coupon.store.name}</p>
              <div className="mt-0.5 flex flex-wrap items-center gap-2">
                {coupon.isVerified ? <VerifiedBadge text={dict.common.verified} /> : null}
                <ExpiryIndicator
                  expiresAt={coupon.expiresAt}
                  locale={locale}
                  dict={dict}
                />
              </div>
            </div>
          </div>
          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            aria-label={dict.buttons.close}
            className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-ink-500 hover:bg-ink-100 hover:text-ink-800"
          >
            <CloseIcon size={18} />
          </button>
        </div>

        <h2 id="coupon-modal-title" className="mt-5 text-lg font-bold text-ink-900">
          {coupon.title}
        </h2>
        {coupon.discountLabel ? (
          <p className="mt-1 inline-flex rounded-md bg-accent-50 px-2 py-0.5 text-xs font-bold text-accent-700">
            {coupon.discountLabel}
          </p>
        ) : null}

        <div className="mt-4">
          {coupon.code ? (
            <>
              <p className="text-xs font-semibold uppercase tracking-wide text-ink-500">
                {dict.coupon.codeLabel}
              </p>
              <div className="mt-1.5 rounded-xl border-2 border-dashed border-brand-300 bg-brand-50 px-4 py-3 text-center">
                <span className="select-all font-mono text-lg font-bold tracking-widest text-brand-800">
                  {coupon.code}
                </span>
              </div>
              <p className="mt-2 text-center text-xs text-ink-500">{dict.coupon.modalSubtitle}</p>
            </>
          ) : (
            <p className="rounded-xl bg-ink-50 px-4 py-3 text-center text-sm text-ink-600">
              {dict.coupon.dealNotice}
            </p>
          )}
        </div>

        <div className="mt-4 space-y-2.5">
          {coupon.code ? (
            <CopyCodeButton code={coupon.code} dict={dict} />
          ) : null}
          <a
            href={destination}
            target="_blank"
            rel="noopener noreferrer sponsored"
            className={buttonClass("primary", "md", "w-full")}
          >
            {destination === fallbackStore ? (
              <InfoIcon size={16} />
            ) : (
              <ExternalLinkIcon size={16} />
            )}
            {destination === fallbackStore
              ? dict.buttons.visitStore
              : interpolate(dict.buttons.goToStore, { store: coupon.store.name })}
          </a>
        </div>

        {coupon.termsAndConditions ? (
          <details className="mt-4 rounded-xl bg-ink-50 px-4 py-3 text-sm text-ink-600">
            <summary className="cursor-pointer font-semibold text-ink-800">
              {dict.coupons.termsTitle}
            </summary>
            <p className="mt-2 text-ink-600">{coupon.termsAndConditions}</p>
          </details>
        ) : null}

        <p className="mt-4 text-center text-[11px] text-ink-400">{dict.common.demoNotice}</p>
      </div>
    </div>
  );
}
