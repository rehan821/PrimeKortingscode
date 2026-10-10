import Link from "next/link";
import type { Locale } from "@/types";
import type { Dictionary } from "@/i18n/dictionary";
import { CategoryIcon } from "@/components/category/CategoryIcon";
import { pathFor } from "@/lib/routes";

export type CategorySearchParams = Promise<Record<string, string | string[] | undefined>>;

/* ========================================================================
 *  STATIC CATEGORY DATA (frontend-only, no backend calls)
 * ===================================================================== */

interface CategoryGroup {
  name: string;
  href: string;
  subcategories?: Array<{
    name: string;
    href: string;
    sub?: Array<{ name: string; href: string }>;
  }>;
}

/** Top featured categories — shown as circular tiles */
const FEATURED_CATEGORIES: Array<{
  name: string;
  nameEn: string;
  icon: "beauty" | "fashion" | "electronics" | "home" | "pets";
  slug: string;
}> = [
  { name: "Beauty and Personal Care", nameEn: "Beauty and Personal Care", icon: "beauty", slug: "beauty" },
  { name: "Clothing, Shoes, Accessories", nameEn: "Clothing, Shoes, Accessories", icon: "fashion", slug: "fashion" },
  { name: "Electronics", nameEn: "Electronics", icon: "electronics", slug: "electronics" },
  { name: "Home and Garden", nameEn: "Home and Garden", icon: "home", slug: "home" },
  { name: "Pets", nameEn: "Pets", icon: "pets", slug: "pets" },
];

/** All category groups — shown as a 3-column hierarchical list */
const ALL_CATEGORY_GROUPS: CategoryGroup[] = [
  // ---- Column 1 ----
  {
    name: "AUTOMOTIVE",
    href: "/categorieen/auto",
    subcategories: [
      { name: "Motorcycles", href: "/categorieen/auto" },
      { name: "Car Stereo and Electronics", href: "/categorieen/auto" },
      { name: "Tires and Wheels", href: "/categorieen/auto" },
    ],
  },
  {
    name: "BABY",
    href: "/categorieen/kids",
    subcategories: [
      { name: "Baby Furniture", href: "/categorieen/kids" },
    ],
  },
  {
    name: "BEAUTY AND PERSONAL CARE",
    href: "/categorieen/beauty",
    subcategories: [
      { name: "Personal Care", href: "/categorieen/beauty" },
      { name: "Vitamins and Supplements", href: "/categorieen/beauty",
        sub: [{ name: "Weight Loss and Diet Supplements", href: "/categorieen/beauty" }] },
      { name: "Fragrances", href: "/categorieen/beauty" },
      { name: "Cosmetics", href: "/categorieen/beauty" },
      { name: "Skin Care", href: "/categorieen/beauty",
        sub: [
          { name: "Acne Treatment", href: "/categorieen/beauty" },
          { name: "Anti-Aging", href: "/categorieen/beauty" },
        ] },
      { name: "Hair Care", href: "/categorieen/beauty",
        sub: [
          { name: "Hair Loss Solutions", href: "/categorieen/beauty" },
          { name: "Hair Styling Tools", href: "/categorieen/beauty" },
          { name: "Wigs", href: "/categorieen/beauty" },
        ] },
      { name: "Men's Grooming", href: "/categorieen/beauty" },
      { name: "Eyewear", href: "/categorieen/beauty",
        sub: [
          { name: "Contact Lenses", href: "/categorieen/beauty" },
          { name: "Eyeglasses", href: "/categorieen/beauty" },
        ] },
      { name: "Sexual Wellness", href: "/categorieen/beauty" },
      { name: "Weight Loss and Dieting", href: "/categorieen/beauty" },
    ],
  },
  {
    name: "HEALTH AND SOCIAL SERVICES",
    href: "/categorieen/health",
    subcategories: [
      { name: "Independent Living", href: "/categorieen/health" },
      { name: "Fitness and Sports Centers", href: "/categorieen/health" },
      { name: "Child Care Services", href: "/categorieen/health" },
      { name: "Medical Equipment and Supplies", href: "/categorieen/health" },
      { name: "Oral and Dental Care", href: "/categorieen/health" },
      { name: "Dating", href: "/categorieen/health" },
    ],
  },
  {
    name: "CLOTHING, SHOES, ACCESSORIES",
    href: "/categorieen/fashion",
    subcategories: [
      { name: "Women's Clothing", href: "/categorieen/fashion",
        sub: [
          { name: "Activewear", href: "/categorieen/fashion" },
          { name: "Dresses", href: "/categorieen/fashion" },
          { name: "Shirts and Tops", href: "/categorieen/fashion" },
          { name: "Jeans and Pants", href: "/categorieen/fashion" },
          { name: "Sleepwear and Loungewear", href: "/categorieen/fashion" },
          { name: "Swimwear", href: "/categorieen/fashion" },
          { name: "Wedding and Bridal Party Dresses", href: "/categorieen/fashion" },
        ] },
      { name: "Women's Shoes", href: "/categorieen/fashion" },
      { name: "Handbags", href: "/categorieen/fashion" },
      { name: "Lingerie", href: "/categorieen/fashion" },
      { name: "Shapewear", href: "/categorieen/fashion" },
      { name: "Plus Size Clothing", href: "/categorieen/fashion" },
      { name: "Maternity Clothing", href: "/categorieen/fashion" },
      { name: "Clothing Accessories", href: "/categorieen/fashion" },
      { name: "Men's Clothing", href: "/categorieen/fashion",
        sub: [
          { name: "Activewear", href: "/categorieen/fashion" },
          { name: "Suits", href: "/categorieen/fashion" },
          { name: "Shirts and Tops", href: "/categorieen/fashion" },
          { name: "Jeans and Pants", href: "/categorieen/fashion" },
          { name: "Men's Shoes", href: "/categorieen/fashion" },
          { name: "Swimwear", href: "/categorieen/fashion" },
          { name: "Big and Tall", href: "/categorieen/fashion" },
        ] },
      { name: "Kid's Clothing", href: "/categorieen/kids" },
      { name: "Baby Clothing", href: "/categorieen/kids" },
      { name: "Jewelry and Watches", href: "/categorieen/fashion",
        sub: [
          { name: "Beads and Charms", href: "/categorieen/fashion" },
          { name: "Body Jewelry", href: "/categorieen/fashion" },
          { name: "Bracelets", href: "/categorieen/fashion" },
          { name: "Earrings", href: "/categorieen/fashion" },
          { name: "Men's Jewelry and Cufflinks", href: "/categorieen/fashion" },
          { name: "Personalized Jewelry", href: "/categorieen/fashion" },
          { name: "Rings", href: "/categorieen/fashion" },
          { name: "Wedding and Engagement Rings", href: "/categorieen/fashion" },
        ] },
    ],
  },
  {
    name: "ELECTRONICS",
    href: "/categorieen/electronics",
    subcategories: [
      { name: "Computers", href: "/categorieen/electronics",
        sub: [
          { name: "Desktops", href: "/categorieen/electronics" },
          { name: "Laptops", href: "/categorieen/electronics" },
          { name: "Networking", href: "/categorieen/electronics" },
          { name: "Hardware and Peripherals", href: "/categorieen/electronics" },
        ] },
      { name: "Cameras", href: "/categorieen/electronics" },
      { name: "TVs and Home Theater", href: "/categorieen/electronics" },
      { name: "Headphones, Earphones and Speakers", href: "/categorieen/electronics" },
      { name: "Electronics Accessories", href: "/categorieen/electronics",
        sub: [{ name: "Gadgets", href: "/categorieen/electronics" }] },
      { name: "Smart Home", href: "/categorieen/electronics",
        sub: [
          { name: "Video and Computer Games", href: "/categorieen/electronics" },
          { name: "Video Game Accessories", href: "/categorieen/electronics" },
          { name: "Video Game Consoles", href: "/categorieen/electronics" },
          { name: "Online Games", href: "/categorieen/electronics" },
        ] },
      { name: "Wearables", href: "/categorieen/electronics" },
      { name: "Cell Phones, Plans and Accessories", href: "/categorieen/electronics",
        sub: [
          { name: "Cell Phone Accessories", href: "/categorieen/electronics" },
          { name: "Cell Phones and Plans", href: "/categorieen/electronics" },
        ] },
    ],
  },
  { name: "DEPARTMENT STORES", href: "/categorieen/marketplace" },
  { name: "DISCOUNT STORES", href: "/categorieen/marketplace" },

  // ---- Column 2 ----
  {
    name: "ENTERTAINMENT AND RECREATION",
    href: "/categorieen/entertainment",
    subcategories: [
      { name: "Concerts and Event Tickets", href: "/categorieen/entertainment" },
      { name: "Movie Theaters", href: "/categorieen/entertainment" },
      { name: "Music and Musical Instruments", href: "/categorieen/entertainment" },
      { name: "Amusement and Theme Parks", href: "/categorieen/entertainment" },
      { name: "Gambling", href: "/categorieen/entertainment" },
      { name: "Party and Event Supplies", href: "/categorieen/entertainment",
        sub: [
          { name: "Birthday Supplies", href: "/categorieen/entertainment" },
          { name: "Graduation", href: "/categorieen/entertainment" },
          { name: "Invitations", href: "/categorieen/entertainment" },
          { name: "Wedding Supplies", href: "/categorieen/entertainment" },
        ] },
    ],
  },
  {
    name: "SPORTS, FITNESS AND OUTDOORS",
    href: "/categorieen/sport",
    subcategories: [
      { name: "Indoor Games and Recreation", href: "/categorieen/sport" },
      { name: "Outdoor Recreation", href: "/categorieen/sport" },
      { name: "Sportswear", href: "/categorieen/sport" },
      { name: "Team Sports Equipment", href: "/categorieen/sport" },
      { name: "Water Sports", href: "/categorieen/sport" },
      { name: "Winter Sports", href: "/categorieen/sport" },
      { name: "Golf", href: "/categorieen/sport" },
      { name: "Fitness Equipment", href: "/categorieen/sport" },
      { name: "Workout Programs", href: "/categorieen/sport" },
      { name: "Sports Teams and Clubs", href: "/categorieen/sport" },
    ],
  },
  {
    name: "HOBBY AND TOYS",
    href: "/categorieen/toys",
    subcategories: [
      { name: "Toys and Games", href: "/categorieen/toys",
        sub: [
          { name: "Action Figures", href: "/categorieen/toys" },
          { name: "Building Toys", href: "/categorieen/toys" },
          { name: "Drones", href: "/categorieen/toys" },
          { name: "Educational Toys", href: "/categorieen/toys" },
          { name: "Stuffed Animals and Dolls", href: "/categorieen/toys" },
        ] },
      { name: "Arts, Crafts and Sewing", href: "/categorieen/toys" },
      { name: "Collectibles", href: "/categorieen/toys" },
      { name: "Coins", href: "/categorieen/toys" },
      { name: "Sports Memorabilia", href: "/categorieen/toys" },
      { name: "Media", href: "/categorieen/books",
        sub: [
          { name: "Book, Magazine and Newspapers", href: "/categorieen/books" },
          { name: "Video Streaming", href: "/categorieen/entertainment" },
          { name: "Music Streaming", href: "/categorieen/entertainment" },
        ] },
    ],
  },
  {
    name: "FOOD AND GIFTS",
    href: "/categorieen/food",
    subcategories: [
      { name: "Florists", href: "/categorieen/food" },
      { name: "Gift Shops", href: "/categorieen/food",
        sub: [
          { name: "Novelty Gifts", href: "/categorieen/food" },
          { name: "Religious Gifts", href: "/categorieen/food" },
        ] },
      { name: "Personalized Gifts", href: "/categorieen/food",
        sub: [
          { name: "Baby Gifts", href: "/categorieen/food" },
          { name: "Personalized Books", href: "/categorieen/books" },
          { name: "Wedding Gifts", href: "/categorieen/food" },
        ] },
      { name: "Gift Baskets", href: "/categorieen/food" },
      { name: "Gift Cards", href: "/categorieen/food" },
      { name: "Wine Clubs", href: "/categorieen/food" },
    ],
  },
  {
    name: "FOOD AND GROCERY",
    href: "/categorieen/food",
    subcategories: [
      { name: "Wine and Spirits", href: "/categorieen/food",
        sub: [
          { name: "Wine", href: "/categorieen/food" },
          { name: "Homebrew and Winemaking Supplies", href: "/categorieen/food" },
        ] },
      { name: "Gourmet Grocery", href: "/categorieen/food",
        sub: [
          { name: "Packaged Meals and Snacks", href: "/categorieen/food" },
          { name: "Coffee", href: "/categorieen/food" },
          { name: "Tea", href: "/categorieen/food" },
        ] },
      { name: "Convenience Food Stores", href: "/categorieen/food" },
      { name: "Specialty Foods", href: "/categorieen/food",
        sub: [
          { name: "Cheese", href: "/categorieen/food" },
          { name: "Meat and Seafood", href: "/categorieen/food" },
          { name: "Desserts and Sweets", href: "/categorieen/food" },
        ] },
      { name: "Tobacco", href: "/categorieen/food",
        sub: [
          { name: "Cigars", href: "/categorieen/food" },
          { name: "Vaping", href: "/categorieen/food" },
        ] },
    ],
  },
  {
    name: "HOME AND GARDEN",
    href: "/categorieen/home",
    subcategories: [
      { name: "Furniture and Decor", href: "/categorieen/home",
        sub: [
          { name: "Bathroom Furniture and Vanities", href: "/categorieen/home" },
          { name: "Chairs", href: "/categorieen/home" },
          { name: "Mattresses", href: "/categorieen/home" },
          { name: "Patio Furniture", href: "/categorieen/home" },
          { name: "Home Decor", href: "/categorieen/home" },
        ] },
      { name: "Blinds", href: "/categorieen/home" },
      { name: "Bed and Bath", href: "/categorieen/home",
        sub: [
          { name: "Bedding", href: "/categorieen/home" },
          { name: "Pillows", href: "/categorieen/home" },
        ] },
      { name: "Cleaning and Organization", href: "/categorieen/home",
        sub: [
          { name: "Vacuums and Cleaning Products", href: "/categorieen/home" },
          { name: "Food Storage", href: "/categorieen/home" },
          { name: "Lunchbags", href: "/categorieen/home" },
        ] },
      { name: "Household Appliances", href: "/categorieen/home",
        sub: [
          { name: "Fireplaces and Woodstoves", href: "/categorieen/home" },
          { name: "Grills", href: "/categorieen/home" },
          { name: "Heating and Cooling", href: "/categorieen/home" },
          { name: "Ovens and Ranges", href: "/categorieen/home" },
          { name: "Refrigerators and Freezers", href: "/categorieen/home" },
        ] },
      { name: "Kitchen and Dining", href: "/categorieen/home",
        sub: [
          { name: "Cookware and Cutlery", href: "/categorieen/home" },
          { name: "Small Appliances", href: "/categorieen/home" },
          { name: "Tableware", href: "/categorieen/home" },
        ] },
      { name: "Lighting", href: "/categorieen/home" },
    ],
  },

  // ---- Column 3 ----
  {
    name: "LUGGAGE",
    href: "/categorieen/travel",
    subcategories: [
      { name: "Backpacks", href: "/categorieen/travel" },
    ],
  },
  {
    name: "NURSERY AND GARDEN",
    href: "/categorieen/garden",
    subcategories: [
      { name: "Seeds and Plants", href: "/categorieen/garden" },
      { name: "Pools and Supplies", href: "/categorieen/garden" },
    ],
  },
  {
    name: "HOME IMPROVEMENT AND TOOLS",
    href: "/categorieen/home",
    subcategories: [
      { name: "Power Tools", href: "/categorieen/home" },
      { name: "Woodworking Tools", href: "/categorieen/home" },
      { name: "Outdoor Power Equipment", href: "/categorieen/home" },
      { name: "Hardware and Tools", href: "/categorieen/home" },
    ],
  },
  {
    name: "PETS",
    href: "/categorieen/pets",
    subcategories: [
      { name: "Pet Food and Supplies", href: "/categorieen/pets" },
    ],
  },
  {
    name: "BUSINESS SERVICES AND SUPPLIES",
    href: "/categorieen/software",
    subcategories: [
      { name: "Office Supplies and Stationery", href: "/categorieen/software",
        sub: [
          { name: "Office Supplies", href: "/categorieen/software" },
          { name: "Stationery and Cards", href: "/categorieen/software" },
          { name: "School Supplies", href: "/categorieen/software" },
        ] },
      { name: "Office Furniture", href: "/categorieen/software" },
      { name: "Checks", href: "/categorieen/software" },
      { name: "Restaurant Supplies", href: "/categorieen/software" },
      { name: "Web Hosting", href: "/categorieen/software" },
      { name: "VPN", href: "/categorieen/software" },
      { name: "Accounting", href: "/categorieen/software" },
      { name: "Career Services", href: "/categorieen/software" },
      { name: "Ink and Toner", href: "/categorieen/software" },
      { name: "Marketing and PR", href: "/categorieen/software" },
      { name: "Business Cards and Printing", href: "/categorieen/software" },
      { name: "Custom Printing", href: "/categorieen/software" },
    ],
  },
  {
    name: "SOFTWARE",
    href: "/categorieen/software",
    subcategories: [
      { name: "Antivirus", href: "/categorieen/software" },
      { name: "Parental Control Software", href: "/categorieen/software" },
      { name: "Education Software", href: "/categorieen/software" },
      { name: "Audio and Video Editing Software", href: "/categorieen/software" },
      { name: "Graphics and Photo Editing Software", href: "/categorieen/software" },
      { name: "Maintenance and Utility Software", href: "/categorieen/software" },
      { name: "Online Backup Services", href: "/categorieen/software" },
      { name: "Productivity Software", href: "/categorieen/software" },
      { name: "Web Design and Development Software", href: "/categorieen/software" },
    ],
  },
  {
    name: "PROFESSIONAL AND EDUCATION SERVICES",
    href: "/categorieen/software",
    subcategories: [
      { name: "People Search", href: "/categorieen/software" },
      { name: "Tutoring and Test Prep", href: "/categorieen/software" },
      { name: "Professional Development", href: "/categorieen/software" },
      { name: "Photo Prints and Printing", href: "/categorieen/software" },
      { name: "Genealogy", href: "/categorieen/software" },
      { name: "Legal Services", href: "/categorieen/software" },
      { name: "Insurance", href: "/categorieen/software" },
    ],
  },
  {
    name: "FINANCIAL SERVICES",
    href: "/categorieen/finance",
    subcategories: [
      { name: "Credit Reports and Scores", href: "/categorieen/finance" },
      { name: "Tax Preparation", href: "/categorieen/finance" },
      { name: "Credit Cards and Banking", href: "/categorieen/finance" },
      { name: "Currency and Crypto Exchanges", href: "/categorieen/finance" },
      { name: "Identity Theft Protection", href: "/categorieen/finance" },
    ],
  },
  {
    name: "HOME SERVICES AND UTILITIES",
    href: "/categorieen/home",
    subcategories: [
      { name: "Contractors", href: "/categorieen/home" },
      { name: "Moving", href: "/categorieen/home",
        sub: [{ name: "Storage Facilities", href: "/categorieen/home" }] },
      { name: "Grocery Delivery", href: "/categorieen/food" },
      { name: "VoIP", href: "/categorieen/software" },
    ],
  },
  {
    name: "RESTAURANTS AND DINING",
    href: "/categorieen/food",
    subcategories: [
      { name: "Fast Food Restaurants", href: "/categorieen/food",
        sub: [
          { name: "Burger", href: "/categorieen/food" },
          { name: "Chicken", href: "/categorieen/food" },
          { name: "Pizza", href: "/categorieen/food" },
          { name: "Sandwich", href: "/categorieen/food" },
        ] },
      { name: "Food Delivery Services", href: "/categorieen/food" },
      { name: "Full-Service Restaurants", href: "/categorieen/food",
        sub: [
          { name: "Casual Dining Restaurants", href: "/categorieen/food" },
          { name: "Bar and Grill", href: "/categorieen/food" },
          { name: "Breakfast", href: "/categorieen/food" },
          { name: "Italian", href: "/categorieen/food" },
          { name: "Mexican", href: "/categorieen/food" },
          { name: "Seafood", href: "/categorieen/food" },
          { name: "Steak", href: "/categorieen/food" },
        ] },
    ],
  },
  {
    name: "TRAVEL",
    href: "/categorieen/travel",
    subcategories: [
      { name: "Hotel and Motels", href: "/categorieen/travel" },
      { name: "Flights", href: "/categorieen/travel",
        sub: [{ name: "Airlines", href: "/categorieen/travel" }] },
      { name: "Travel Agencies", href: "/categorieen/travel" },
      { name: "Car Rentals", href: "/categorieen/travel" },
      { name: "Truck and RV Rentals", href: "/categorieen/travel" },
      { name: "Rail and Car Services", href: "/categorieen/travel" },
      { name: "Cruises", href: "/categorieen/travel" },
      { name: "Short-term Rentals and Lodging", href: "/categorieen/travel" },
      { name: "Sightseeing", href: "/categorieen/travel",
        sub: [
          { name: "Amusement Parks", href: "/categorieen/entertainment" },
          { name: "Aquariums", href: "/categorieen/travel" },
          { name: "Museums", href: "/categorieen/travel" },
          { name: "Zoos", href: "/categorieen/travel" },
        ] },
    ],
  },
];

/* ========================================================================
 *  HELPER: Build a locale-aware path
 * ===================================================================== */

/**
 * Slug used by the static taxonomy below → the real slug in
 * `data/mock/categories`.
 *
 * The static list was written against a different (RetailMeNot-style)
 * taxonomy, so most of its slugs no longer exist. Resolving every href through
 * this map is what keeps the categories page free of 404s: `proxy.ts` rewrites
 * any unknown detail slug onto the not-found page.
 */
const STATIC_SLUG_TO_CATEGORY: Record<string, string> = {
  auto: "auto",
  beauty: "schoonheid",
  books: "boeken",
  electronics: "elektronica",
  entertainment: "boeken",
  fashion: "mode",
  finance: "verzekeringen",
  food: "eten-drinken",
  garden: "tuin",
  health: "schoonheid",
  home: "huis-inrichting",
  kids: "baby-kind",
  marketplace: "warenhuizen",
  pets: "dieren",
  software: "software",
  sport: "sport",
  toys: "speelgoed",
  travel: "reizen",
};

/**
 * Resolves a href from the static taxonomy into a real URL.
 *
 * `pathFor` owns the locale prefix, so English links get `/en/categories/…`
 * — the previous string replacement only swapped `/categorieen` for
 * `/categories`, which is a Dutch route, so English links 404'd too.
 *
 * An unmapped slug falls back to the categories index rather than 404ing.
 */
function hrefFor(locale: Locale, path: string): string {
  const slug = path.split("/").filter(Boolean).pop() ?? "";
  const category = STATIC_SLUG_TO_CATEGORY[slug];
  return pathFor(locale, category ? "category" : "categories", category);
}

/* ========================================================================
 *  SUBCOMPONENTS
 * ===================================================================== */

/** One circular featured-category tile */
function FeaturedTile({ category, locale }: { category: (typeof FEATURED_CATEGORIES)[number]; locale: Locale }) {
  return (
    <Link
      href={hrefFor(locale, `/categorieen/${category.slug}`)}
      className="group flex flex-col items-center text-center"
      style={{ width: "200px" }}
    >
      <div
        className="flex items-center justify-center rounded-full transition-all duration-300 group-hover:scale-105 group-hover:shadow-lg"
        style={{ width: "180px", height: "180px", backgroundColor: "#f1eff3" }}
      >
        <CategoryIcon name={category.icon} size={80} className="text-ink-700 transition-colors group-hover:text-brand-700" />
      </div>
      <span
        className="mt-6 font-bold uppercase leading-tight tracking-wide text-ink-950 transition-colors group-hover:text-brand-700"
        style={{ fontSize: "16px", width: "100%" }}
      >
        {category.name}
      </span>
    </Link>
  );
}

/** One bulleted subcategory item (recursive) */
function SubcategoryItem({
  item,
  locale,
  depth = 0,
}: {
  item: NonNullable<CategoryGroup["subcategories"]>[number];
  locale: Locale;
  depth?: number;
}) {
  return (
    <li className={depth > 0 ? "ml-6" : ""}>
      <Link
        href={hrefFor(locale, item.href)}
        className="text-base leading-relaxed text-ink-700 hover:text-brand-700 hover:underline"
      >
        {item.name}
      </Link>
      {item.sub && item.sub.length > 0 && (
        <ul className="mt-1 ml-6 space-y-1">
          {item.sub.map((sub) => (
            <SubcategoryItem key={sub.name} item={sub} locale={locale} depth={depth + 1} />
          ))}
        </ul>
      )}
    </li>
  );
}

/** One category group block (bold heading + bullet list) */
function CategoryGroupBlock({ group, locale }: { group: CategoryGroup; locale: Locale }) {
  return (
    <div className="mb-10">
      <Link
        href={hrefFor(locale, group.href)}
        className="text-base font-bold uppercase tracking-wide text-ink-950 hover:text-brand-700 hover:underline"
      >
        {group.name}
      </Link>
      {group.subcategories && group.subcategories.length > 0 && (
        <ul className="mt-4 list-disc space-y-3 pl-5">
          {group.subcategories.map((item) => (
            <SubcategoryItem key={item.name} item={item} locale={locale} />
          ))}
        </ul>
      )}
    </div>
  );
}

/** Split an array into N roughly-equal columns */
function chunkColumns<T>(items: T[], cols: number): T[][] {
  const result: T[][] = Array.from({ length: cols }, () => []);
  items.forEach((item, i) => {
    result[i % cols].push(item);
  });
  return result;
}

/* ========================================================================
 *  MAIN COMPONENT
 * ===================================================================== */

interface CategoriesPageProps {
  locale: Locale;
  dict: Dictionary;
  searchParams?: CategorySearchParams;
}

/** RetailMeNot-style categories page — Top categories + All categories list. */
export function CategoriesPage({ locale }: CategoriesPageProps) {
  const columns = chunkColumns(ALL_CATEGORY_GROUPS, 3);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      {/* ============================================================
       *  SECTION 1 — Top Coupons & Deals Categories
       * ============================================================ */}
      <section aria-labelledby="top-categories-heading">
        <h2
          id="top-categories-heading"
          className="text-4xl font-black tracking-tight text-ink-950"
        >
          Top Coupons &amp; Deals Categories
        </h2>

        <div
          className="mt-14 grid items-start justify-items-center gap-y-12"
          style={{ gridTemplateColumns: "repeat(5, 1fr)", columnGap: "40px" }}
        >
          {FEATURED_CATEGORIES.map((cat) => (
            <FeaturedTile key={cat.slug} category={cat} locale={locale} />
          ))}
        </div>
      </section>

      {/* Divider */}
      <hr className="my-14 border-ink-200" />

      {/* ============================================================
       *  SECTION 2 — All Coupons & Deals Categories
       * ============================================================ */}
      <section aria-labelledby="all-categories-heading">
        <h2
          id="all-categories-heading"
          className="text-4xl font-black tracking-tight text-ink-950"
        >
          All Coupons &amp; Deals Categories
        </h2>

        <div className="mt-10 grid gap-x-12 gap-y-0 md:grid-cols-2 lg:grid-cols-3">
          {columns.map((column, colIdx) => (
            <div key={colIdx}>
              {column.map((group) => (
                <CategoryGroupBlock key={group.name} group={group} locale={locale} />
              ))}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
