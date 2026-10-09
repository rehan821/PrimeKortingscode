import { cn } from "@/lib/cn";

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
