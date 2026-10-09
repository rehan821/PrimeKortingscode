"use client";

import { useState } from "react";
import type { Locale, CouponWithRelations } from "@/types";
import type { Dictionary } from "@/i18n/dictionary";
import type { ExpiryInfo } from "@/lib/expiry";
import { buttonClass, type ButtonSize, type ButtonVariant } from "@/components/ui/button";
import { TagIcon } from "@/components/ui/icons";
import { CouponModal } from "./CouponModal";

interface CouponRevealButtonProps {
  coupon: CouponWithRelations;
  locale: Locale;
  dict: Dictionary;
  expiryInfo: ExpiryInfo;
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
}

/** Client-side interaction only: the button opens the precomputed reveal dialog. */
export function CouponRevealButton({
  coupon,
  locale,
  dict,
  expiryInfo,
  variant = "secondary",
  size = "md",
  className,
}: CouponRevealButtonProps) {
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
        <CouponModal
          coupon={coupon}
          locale={locale}
          dict={dict}
          expiryInfo={expiryInfo}
          onClose={() => setOpen(false)}
        />
      ) : null}
    </>
  );
}
