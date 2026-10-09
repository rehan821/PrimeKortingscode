import { cn } from "@/lib/cn";

const SIZES = {
  xs: "h-8 w-8 text-[0.65rem]",
  sm: "h-10 w-10 text-xs",
  md: "h-14 w-14 text-sm",
  lg: "h-20 w-20 text-lg",
} as const;

function isLight(hex: string): boolean {
  const value = hex.replace("#", "");
  if (value.length !== 6) return false;
  const r = parseInt(value.slice(0, 2), 16);
  const g = parseInt(value.slice(2, 4), 16);
  const b = parseInt(value.slice(4, 6), 16);
  // Relative luminance approximation
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255 > 0.62;
}

interface StoreLogoProps {
  name: string;
  initials?: string;
  brandColor?: string;
  size?: keyof typeof SIZES;
  className?: string;
}

/**
 * Placeholder brand mark — a letter avatar derived from store data.
 * Keeps the site fast (no third-party logo hotlinking) while reserving a
 * clean slot for real logo assets served by the API later.
 */
export function StoreLogo({ name, initials, brandColor, size = "md", className }: StoreLogoProps) {
  const background = brandColor ?? "#27364f";
  const label = (initials ?? name.slice(0, 2)).slice(0, 3);
  const foreground = isLight(background) ? "#0c1626" : "#ffffff";

  return (
    <span
      aria-hidden="true"
      className={cn(
        "inline-flex shrink-0 select-none items-center justify-center rounded-xl font-bold leading-none tracking-tight",
        SIZES[size],
        className,
      )}
      style={{ backgroundColor: background, color: foreground }}
    >
      {label}
    </span>
  );
}
