/**
 * Domain models for PrimeKortingscode.
 *
 * These types are the contract between the UI and ANY data source (local mock
 * data today, WordPress/REST API tomorrow). Keep them in sync with
 * `backend/schemas/*.schema.json`.
 */

export const LOCALES = ["nl", "en"] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "nl";

export type CouponType = "coupon" | "deal";

export type SortOption = "popular" | "newest" | "expiring" | "title";

/** Pagination envelope returned by every list service. */
export interface Paginated<T> {
  items: T[];
  page: number;
  perPage: number;
  total: number;
  totalPages: number;
}

/** Query accepted by list services. Services clamp/validate these. */
export interface ListQuery {
  page?: number;
  perPage?: number;
  q?: string;
  sort?: SortOption;
  featured?: boolean;
}

export type IconName =
  | "fashion"
  | "electronics"
  | "travel"
  | "home"
  | "beauty"
  | "sport"
  | "food"
  | "kids"
  | "books"
  | "pets"
  | "auto"
  | "finance"
  | "software"
  | "marketplace"
  | "energy"
  | "garden"
  | "toys";

export interface FaqItem {
  question: string;
  answer: string;
}

export interface Store {
  id: string;
  slug: string;
  name: string;
  /** Optional English name; the service falls back to `name`. */
  nameEn?: string;
  description: string;
  descriptionEn?: string;
  websiteUrl: string;
  /** Optional brand hints used by the placeholder logo component. */
  brandColor?: string;
  initials?: string;
  isFeatured?: boolean;
  activeCouponCount?: number;
  activeDealCount?: number;
  /** Relative sort weight — higher means more popular. */
  popularity?: number;
  faq?: FaqItem[];
  createdAt: string;
  updatedAt: string;
}

export interface StoreSummary {
  id: string;
  slug: string;
  name: string;
  brandColor?: string;
  initials?: string;
}

export interface Category {
  id: string;
  slug: string;
  name: string;
  nameEn?: string;
  description?: string;
  descriptionEn?: string;
  icon?: IconName;
  parentId?: string;
  isFeatured?: boolean;
  storeCount?: number;
  couponCount?: number;
  dealCount?: number;
  popularity?: number;
  createdAt: string;
  updatedAt: string;
}

export interface CategorySummary {
  id: string;
  slug: string;
  name: string;
  icon?: IconName;
}

export interface Coupon {
  id: string;
  slug: string;
  title: string;
  titleEn?: string;
  description?: string;
  descriptionEn?: string;
  /** Revealed in the coupon modal. Optional: a backend may withhold it in lists. */
  code?: string;
  type: CouponType;
  storeId: string;
  categoryIds: string[];
  /** Affiliate/store destination — data-driven, never hardcoded in the UI. */
  redirectUrl: string;
  isVerified: boolean;
  isFeatured: boolean;
  /** Set only for offers with an explicitly approved paid placement. */
  isSponsored?: boolean;
  discountLabel?: string;
  termsAndConditions?: string;
  usageCount?: number;
  startsAt?: string;
  expiresAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Deal {
  id: string;
  slug: string;
  title: string;
  titleEn?: string;
  description?: string;
  descriptionEn?: string;
  type: "deal";
  storeId: string;
  categoryIds: string[];
  redirectUrl: string;
  isVerified: boolean;
  isFeatured: boolean;
  /** Set only for offers with an explicitly approved paid placement. */
  isSponsored?: boolean;
  discountLabel?: string;
  priceFrom?: string;
  oldPrice?: string;
  termsAndConditions?: string;
  usageCount?: number;
  startsAt?: string;
  expiresAt?: string;
  createdAt: string;
  updatedAt: string;
}

/** Coupon enriched by the service layer (relations are never assembled in the UI). */
export interface CouponWithRelations extends Coupon {
  store: StoreSummary;
  categories: CategorySummary[];
}

export interface DealWithRelations extends Deal {
  store: StoreSummary;
  categories: CategorySummary[];
}

export interface StoreWithRelations extends Store {
  coupons: CouponWithRelations[];
  deals: DealWithRelations[];
  categories: CategorySummary[];
  relatedStores: StoreSummary[];
}

export interface CategoryWithRelations extends Category {
  stores: StoreSummary[];
  coupons: CouponWithRelations[];
  deals: DealWithRelations[];
  relatedCategories: CategorySummary[];
}

export interface BlogPost {
  id: string;
  slug: string;
  locale: Locale;
  title: string;
  excerpt: string;
  /** HTML body — server-rendered, never fetched on the client. */
  body: string;
  coverImage?: string;
  category?: string;
  tags?: string[];
  author: string;
  readingTimeMinutes?: number;
  isFeatured?: boolean;
  publishedAt: string;
  updatedAt: string;
}
