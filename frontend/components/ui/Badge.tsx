import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export type BadgeVariant = "verified" | "accent" | "neutral" | "danger" | "brand";

const STYLES: Record<BadgeVariant, string> = {
  verified: "bg-success-50 text-success-700 ring-success-100",
  accent: "bg-accent-50 text-accent-700 ring-accent-100",
  neutral: "bg-ink-100 text-ink-700 ring-ink-200",
  danger: "bg-danger-50 text-danger-600 ring-danger-100",
  brand: "bg-brand-50 text-brand-700 ring-brand-100",
};

interface BadgeProps {
  variant?: BadgeVariant;
  children: ReactNode;
  className?: string;
}

export function Badge({ variant = "neutral", children, className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset",
        STYLES[variant],
        className,
      )}
    >
      {children}
    </span>
  );
}
