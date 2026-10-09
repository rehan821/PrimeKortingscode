import type { ReactNode, SVGProps } from "react";

type IconProps = Omit<SVGProps<SVGSVGElement>, "children"> & { size?: number };

function Icon({
  size = 20,
  strokeWidth = 1.75,
  children,
  ...rest
}: IconProps & { children: ReactNode }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...rest}
    >
      {children}
    </svg>
  );
}

/* --- UI icons ----------------------------------------------------------- */

export const SearchIcon = (p: IconProps) => (
  <Icon {...p}>
    <circle cx="11" cy="11" r="7" />
    <path d="m20 20-3.5-3.5" />
  </Icon>
);

export const MenuIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M4 6h16M4 12h16M4 18h16" />
  </Icon>
);

export const CloseIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M6 6l12 12M18 6L6 18" />
  </Icon>
);

export const ChevronRightIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="m9 5 7 7-7 7" />
  </Icon>
);

export const ChevronLeftIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="m15 5-7 7 7 7" />
  </Icon>
);

export const ChevronDownIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="m5 9 7 7 7-7" />
  </Icon>
);

export const ArrowRightIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M4 12h16M14 6l6 6-6 6" />
  </Icon>
);

export const CheckIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="m5 13 4.5 4.5L19 7" />
  </Icon>
);

export const CheckBadgeIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M12 2.5l2.3 1.7 2.8-.2.9 2.7 2.4 1.5-1 2.7 1 2.7-2.4 1.5-.9 2.7-2.8-.2L12 21.5l-2.3-1.7-2.8.2-.9-2.7-2.4-1.5 1-2.7-1-2.7 2.4-1.5.9-2.7 2.8.2L12 2.5Z" />
    <path d="m8.8 12.2 2.1 2.1 4.3-4.6" />
  </Icon>
);

export const CopyIcon = (p: IconProps) => (
  <Icon {...p}>
    <rect x="9" y="9" width="11" height="11" rx="2" />
    <path d="M5 15H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v1" />
  </Icon>
);

export const ExternalLinkIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M14 4h6v6" />
    <path d="M20 4 11 13" />
    <path d="M19 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h5" />
  </Icon>
);

export const ClockIcon = (p: IconProps) => (
  <Icon {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7.5V12l3 2" />
  </Icon>
);

export const TagIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M3.5 11.5V4.5a1 1 0 0 1 1-1h7l9 9-8 8-9-9Z" />
    <circle cx="8" cy="8" r="1.4" />
  </Icon>
);

export const MailIcon = (p: IconProps) => (
  <Icon {...p}>
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <path d="m3.5 7 8.5 6 8.5-6" />
  </Icon>
);

export const SparkIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9L12 3Z" />
    <path d="M19 15.5l.8 1.7 1.7.8-1.7.8-.8 1.7-.8-1.7-1.7-.8 1.7-.8.8-1.7Z" />
  </Icon>
);

export const GlobeIcon = (p: IconProps) => (
  <Icon {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="M3 12h18M12 3c2.5 2.5 3.7 5.6 3.7 9S14.5 18.5 12 21c-2.5-2.5-3.7-5.6-3.7-9S9.5 5.5 12 3Z" />
  </Icon>
);

export const InfoIcon = (p: IconProps) => (
  <Icon {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 11v5" />
    <path d="M12 7.8v.5" />
  </Icon>
);

export const HeartIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M12 20s-7.5-4.6-7.5-9.6A4.4 4.4 0 0 1 12 7.6a4.4 4.4 0 0 1 7.5 2.8c0 5-7.5 9.6-7.5 9.6Z" />
  </Icon>
);

/* --- Category icons ------------------------------------------------------ */

export const FashionIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M8.5 3.5 4 6v4h3v10h10V10h3V6l-4.5-2.5" />
    <path d="M8.5 3.5c0 1.9 1.6 3.5 3.5 3.5s3.5-1.6 3.5-3.5" />
  </Icon>
);

export const ElectronicsIcon = (p: IconProps) => (
  <Icon {...p}>
    <rect x="3" y="4" width="18" height="12" rx="2" />
    <path d="M8 20h8M12 16v4" />
  </Icon>
);

export const TravelIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M21 3 3 10.5l6.5 2.5L12 21l3-6 6-12Z" />
    <path d="m9.5 13 4.5-4.5" />
  </Icon>
);

export const HomeIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="m3 11 9-8 9 8" />
    <path d="M5.5 9.5V21h13V9.5" />
    <path d="M10 21v-6h4v6" />
  </Icon>
);

export const BeautyIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M12 3.5 13.7 8l4.5 1.7-4.5 1.7L12 16l-1.7-4.6L5.8 9.7 10.3 8 12 3.5Z" />
    <path d="M18.5 15.5l.7 1.8 1.8.7-1.8.7-.7 1.8-.7-1.8-1.8-.7 1.8-.7.7-1.8Z" />
  </Icon>
);

export const SportIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M6.5 6.5v11M3.5 9v6M17.5 6.5v11M20.5 9v6M6.5 12h11" />
  </Icon>
);

export const FoodIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M7 3v7a2.5 2.5 0 0 1-2.5 2.5V21" />
    <path d="M4.5 3v7M9.5 3v7" />
    <path d="M17.5 3c-1.7 0-3 2.9-3 6.5s1.3 4.5 3 4.5V21" />
  </Icon>
);

export const KidsIcon = (p: IconProps) => (
  <Icon {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="M9 14.2c.8 1.1 1.9 1.7 3 1.7s2.2-.6 3-1.7" />
    <path d="M9.3 9.5v.6M14.7 9.5v.6" />
  </Icon>
);

export const BooksIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H12v16H6.5A2.5 2.5 0 0 0 4 21.5v-16Z" />
    <path d="M20 5.5A2.5 2.5 0 0 0 17.5 3H12v16h5.5a2.5 2.5 0 0 1 2.5 2.5v-16Z" />
  </Icon>
);

export const PetsIcon = (p: IconProps) => (
  <Icon {...p}>
    <circle cx="7" cy="9.5" r="2" />
    <circle cx="12" cy="7.5" r="2" />
    <circle cx="17" cy="9.5" r="2" />
    <path d="M12 12.5c-3 0-5.2 2-5.2 4.3 0 1.9 1.8 2.7 5.2 2.7s5.2-.8 5.2-2.7c0-2.3-2.2-4.3-5.2-4.3Z" />
  </Icon>
);

export const AutoIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M3.5 13 5 8.6A2 2 0 0 1 6.9 7h10.2a2 2 0 0 1 1.9 1.6l1.5 4.4v3.5h-17V13Z" />
    <path d="M3.5 13h17" />
    <circle cx="7.5" cy="14.8" r="1.1" />
    <circle cx="16.5" cy="14.8" r="1.1" />
  </Icon>
);

export const FinanceIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M17 6.8A6.2 6.2 0 0 0 7.4 12 6.2 6.2 0 0 0 17 17.2" />
    <path d="M4.5 10.5h7.5M4.5 13.5h7.5" />
  </Icon>
);

export const SoftwareIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="m8.5 8-4 4 4 4M15.5 8l4 4-4 4M13.5 5l-3 14" />
  </Icon>
);

export const MarketplaceIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M5 8h14l-1.2 12H6.2L5 8Z" />
    <path d="M9 8V6.5a3 3 0 0 1 6 0V8" />
  </Icon>
);

export const EnergyIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M13 2.5 4.8 13.6H11L10 21.5l8.2-11.1H12L13 2.5Z" />
  </Icon>
);

export const GardenIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M20 4S9 4.5 6.8 10.6C5.2 15 8.6 20 8.6 20s6.4-.9 9.6-4.3C20.6 12.7 20 4 20 4Z" />
    <path d="M8.6 20c1.4-4.8 4.4-8.3 8.6-10.6" />
  </Icon>
);

export const ToysIcon = (p: IconProps) => (
  <Icon {...p}>
    <rect x="3.5" y="3.5" width="7.5" height="7.5" rx="1.5" />
    <rect x="13" y="3.5" width="7.5" height="7.5" rx="1.5" />
    <rect x="3.5" y="13" width="7.5" height="7.5" rx="1.5" />
    <path d="M16.75 13.5v6.5M13.5 16.75h6.5" />
  </Icon>
);
