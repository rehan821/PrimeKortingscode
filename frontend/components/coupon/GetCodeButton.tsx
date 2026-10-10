import type { Locale, CouponWithRelations } from "@/types";
import type { Dictionary } from "@/i18n/dictionary";
import { getExpiryInfo } from "@/lib/expiry";
import type { ButtonSize, ButtonVariant } from "@/components/ui/button";
import { CouponRevealButton } from "./CouponRevealButton";

interface GetCodeButtonProps {
  coupon: CouponWithRelations;
  locale: Locale;
  dict: Dictionary;
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
}

/** Server wrapper passes serialized expiry state into the small client control. */
export async function GetCodeButton(props: GetCodeButtonProps) {
  const expiryInfo = await getExpiryInfo(props.coupon.expiresAt);
  return <CouponRevealButton {...props} expiryInfo={expiryInfo} />;
}
