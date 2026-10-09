import { cn } from "@/lib/cn";

export function getBrandForegroundColor(hex?: string): "#1b1722" | "#ffffff" {
  if (!hex || !/^#[\da-f]{6}$/i.test(hex)) return "#ffffff";
  const channels = [1, 3, 5].map((index) => parseInt(hex.slice(index, index + 2), 16) / 255);
  const luminance = channels.map((value) => value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4);
  return luminance[0] * 0.2126 + luminance[1] * 0.7152 + luminance[2] * 0.0722 > 0.42 ? "#1b1722" : "#ffffff";
}

const SIZES = {
  xs: "min-h-7 px-1.5 text-[0.65rem]",
  sm: "min-h-9 px-2 text-xs",
  md: "min-h-11 px-2.5 text-sm",
  lg: "min-h-14 px-3 text-base",
} as const;

interface StoreLogoProps {
  name: string;
  initials?: string;
  brandColor?: string;
  size?: keyof typeof SIZES;
  className?: string;
}

/** Text-first merchant label. No logo asset is available in the store data. */
export function StoreLogo({ name, initials, brandColor, size = "md", className }: StoreLogoProps) {
  void initials;

  return (
    <span
      aria-label={name}
      className={cn(
        "inline-flex max-w-full shrink-0 select-none items-center justify-center truncate rounded-md border border-ink-200 bg-white font-extrabold leading-none tracking-tight text-ink-800",
        SIZES[size],
        className,
      )}
      style={brandColor ? { borderBottomColor: brandColor, borderBottomWidth: "2px" } : undefined}
    >
      {name}
    </span>
  );
}
