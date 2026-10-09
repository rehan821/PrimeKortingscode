"use client";

import { useState } from "react";
import type { Locale, CouponWithRelations } from "@/types";
import type { Dictionary } from "@/i18n/dictionary";
import { buttonClass, type ButtonSize, type ButtonVariant } from "@/components/ui/button";
import { TagIcon } from "@/components/ui/icons";
import { CouponModal } from "./CouponModal";

interface GetCodeButtonProps {
  coupon: CouponWithRelations;
  locale: Locale;
  dict: Dictionary;
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
}

/**
 * "Code bekijken" — opens the coupon modal from anywhere on the page.
 * Keeps the card itself server-rendered; only this control hydrates.
 */
export function GetCodeButton({
  coupon,
  locale,
  dict,
  variant = "accent",
  size = "md",
  className,
}: GetCodeButtonProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={buttonClass(variant, size, className)}
      >
        <TagIcon size={16} />
        {dict.buttons.getCode}
      </button>
      {open ? (
        <CouponModal coupon={coupon} locale={locale} dict={dict} onClose={() => setOpen(false)} />
      ) : null}
    </>
  );
}
