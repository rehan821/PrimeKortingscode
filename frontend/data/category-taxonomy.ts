import type { IconName } from "@/types";

/* ============================================================================
 *  CATEGORY PAGE TAXONOMY  —  the single place to edit the categories page
 * ============================================================================
 *
 *  This file ONLY drives the layout of the categories page
 *  (`/categorieen` and `/en/categories`). It is plain front-end data:
 *  editing it never touches the backend, the database or any other page.
 *
 *  ──────────────────────────────────────────────────────────────────────────
 *  HOW TO ADD SOMETHING (for admins)
 *  ──────────────────────────────────────────────────────────────────────────
 *
 *  1) Add a sub-item inside any group → add one line to `children`:
 *
 *        { name: "My New Subcategory" },
 *
 *     It automatically links to the category of the group it sits in.
 *
 *  2) Make an item link to a *different* category → give it a `slug`:
 *
 *        { name: "Bike Racks", slug: "sport" },
 *
 *     `slug` must be the `slug` of a category in `data/mock/categories.ts`.
 *
 *  3) Add a whole new group (a bold heading with its own bullet list):
 *
 *        { name: "MY NEW GROUP", slug: "sport", column: 2, children: [...] },
 *
 *     `column` (1 | 2 | 3) picks the desktop column. Leave it out and the
 *     group is placed automatically in the shortest column, so the three
 *     columns stay balanced as you add more.
 *
 *  4) Change one of the five circular tiles at the top → edit
 *     `FEATURED_CATEGORIES` (name + icon + slug).
 *
 *  ──────────────────────────────────────────────────────────────────────────
 *  SAFE BY DESIGN
 *  ──────────────────────────────────────────────────────────────────────────
 *
 *  • A `slug` that does not exist (typo, category removed, …) never renders
 *    a 404: the link falls back to the categories index instead.
 *  • A node without a `slug` inherits the slug of the group it belongs to,
 *    so every single item on the page always leads to a working page.
 * ========================================================================== */

/** One entry of the taxonomy tree. */
export interface CategoryNode {
  /** Exact text shown on the page (the UI upper-cases group headings). */
  name: string;
  /**
   * Slug of a real category (`data/mock/categories.ts`).
   * Omitted → the item inherits the category of the group above it.
   * Unknown → the link safely points at the categories index (no 404).
   */
  slug?: string;
  /** Nested bullet items (any depth). */
  children?: CategoryNode[];
}

/** A top-level group: bold uppercase heading + bullet list. */
export interface CategoryGroup extends CategoryNode {
  /**
   * Desktop column, 1 = left, 2 = middle, 3 = right.
   * Omit it and the group is appended to the currently shortest column.
   */
  column?: 1 | 2 | 3;
}

/** One of the five circular tiles in the "Top" section. */
export interface FeaturedCategory extends CategoryNode {
  /** Icon drawn inside the circle. */
  icon: IconName;
}

/* ============================================================================
 *  TOP SECTION — the five circular tiles
 * ============================================================================ */

export const FEATURED_CATEGORIES: FeaturedCategory[] = [
  { name: "Beauty and Personal Care", slug: "schoonheid", icon: "beauty" },
  { name: "Clothing, Shoes, Accessories", slug: "mode", icon: "fashion" },
  { name: "Electronics", slug: "elektronica", icon: "electronics" },
  { name: "Home and Garden", slug: "huis-inrichting", icon: "home" },
  { name: "Pets", slug: "dieren", icon: "pets" },
];

/* ============================================================================
 *  BOTTOM SECTION — "All Coupons & Deals Categories" (three columns)
 * ============================================================================ */

export const CATEGORY_GROUPS: CategoryGroup[] = [
  /* ---------------------------------------------------------------- column 1 */
  {
    name: "AUTOMOTIVE",
    slug: "auto",
    column: 1,
    children: [
      { name: "Motorcycles" },
      { name: "Car Stereo and Electronics" },
      { name: "Tires and Wheels" },
    ],
  },
  {
    name: "BABY",
    slug: "baby-kind",
    column: 1,
    children: [{ name: "Baby Furniture" }],
  },
  {
    name: "BEAUTY AND PERSONAL CARE",
    slug: "schoonheid",
    column: 1,
    children: [
      { name: "Personal Care" },
      {
        name: "Vitamins and Supplements",
        children: [{ name: "Weight Loss and Diet Supplements" }],
      },
      { name: "Fragrances" },
      { name: "Cosmetics" },
      {
        name: "Skin Care",
        children: [
          { name: "Acne Treatment" },
          { name: "Anti-Aging" },
        ],
      },
      {
        name: "Hair Care",
        children: [
          { name: "Hair Loss Solutions" },
          { name: "Hair Styling Tools" },
          { name: "Wigs" },
        ],
      },
      { name: "Men's Grooming" },
      {
        name: "Eyewear",
        children: [
          { name: "Contact Lenses" },
          { name: "Eyeglasses" },
        ],
      },
      { name: "Sexual Wellness" },
      { name: "Weight Loss and Dieting" },
    ],
  },
  {
    name: "HEALTH AND SOCIAL SERVICES",
    slug: "schoonheid",
    column: 1,
    children: [
      { name: "Independent Living" },
      { name: "Fitness and Sports Centers" },
      { name: "Child Care Services" },
      { name: "Medical Equipment and Supplies" },
      { name: "Oral and Dental Care" },
      { name: "Dating" },
    ],
  },
  {
    name: "CLOTHING, SHOES, ACCESSORIES",
    slug: "mode",
    column: 1,
    children: [
      {
        name: "Women's Clothing",
        children: [
          { name: "Activewear" },
          { name: "Dresses" },
          { name: "Shirts and Tops" },
          { name: "Jeans and Pants" },
          { name: "Sleepwear and Loungewear" },
          { name: "Swimwear" },
          { name: "Wedding and Bridal Party Dresses" },
        ],
      },
      { name: "Women's Shoes" },
      { name: "Handbags" },
      { name: "Lingerie" },
      { name: "Shapewear" },
      { name: "Plus Size Clothing" },
      { name: "Maternity Clothing" },
      { name: "Clothing Accessories" },
      {
        name: "Men's Clothing",
        children: [
          { name: "Activewear" },
          { name: "Suits" },
          { name: "Shirts and Tops" },
          { name: "Jeans and Pants" },
          { name: "Men's Shoes" },
          { name: "Swimwear" },
          { name: "Big and Tall" },
        ],
      },
      { name: "Kid's Clothing", slug: "baby-kind" },
      { name: "Baby Clothing", slug: "baby-kind" },
      {
        name: "Jewelry and Watches",
        children: [
          { name: "Beads and Charms" },
          { name: "Body Jewelry" },
          { name: "Bracelets" },
          { name: "Earrings" },
          { name: "Men's Jewelry and Cufflinks" },
          { name: "Personalized Jewelry" },
          { name: "Rings" },
          { name: "Wedding and Engagement Rings" },
        ],
      },
    ],
  },
  {
    name: "ELECTRONICS",
    slug: "elektronica",
    column: 1,
    children: [
      {
        name: "Computers",
        children: [
          { name: "Desktops" },
          { name: "Laptops" },
          { name: "Networking" },
          { name: "Hardware and Peripherals" },
        ],
      },
      { name: "Cameras" },
      { name: "TVs and Home Theater" },
      { name: "Headphones, Earphones and Speakers" },
      {
        name: "Electronics Accessories",
        children: [{ name: "Gadgets" }],
      },
      {
        name: "Smart Home",
        children: [
          { name: "Video and Computer Games" },
          { name: "Video Game Accessories" },
          { name: "Video Game Consoles" },
          { name: "Online Games" },
        ],
      },
      { name: "Wearables" },
      {
        name: "Cell Phones, Plans and Accessories",
        children: [
          { name: "Cell Phone Accessories" },
          { name: "Cell Phones and Plans" },
        ],
      },
    ],
  },
  { name: "DEPARTMENT STORES", slug: "warenhuizen", column: 1 },
  { name: "DISCOUNT STORES", slug: "warenhuizen", column: 1 },

  /* ---------------------------------------------------------------- column 2 */
  {
    name: "ENTERTAINMENT AND RECREATION",
    slug: "boeken",
    column: 2,
    children: [
      { name: "Concerts and Event Tickets" },
      { name: "Movie Theaters" },
      { name: "Music and Musical Instruments" },
      { name: "Amusement and Theme Parks" },
      { name: "Gambling" },
      {
        name: "Party and Event Supplies",
        children: [
          { name: "Birthday Supplies" },
          { name: "Graduation" },
          { name: "Invitations" },
          { name: "Wedding Supplies" },
        ],
      },
    ],
  },
  {
    name: "SPORTS, FITNESS AND OUTDOORS",
    slug: "sport",
    column: 2,
    children: [
      { name: "Indoor Games and Recreation" },
      { name: "Outdoor Recreation" },
      { name: "Sportswear" },
      { name: "Team Sports Equipment" },
      { name: "Water Sports" },
      { name: "Winter Sports" },
      { name: "Golf" },
      { name: "Fitness Equipment" },
      { name: "Workout Programs" },
      { name: "Sports Teams and Clubs" },
    ],
  },
  {
    name: "HOBBY AND TOYS",
    slug: "speelgoed",
    column: 2,
    children: [
      {
        name: "Toys and Games",
        children: [
          { name: "Action Figures" },
          { name: "Building Toys" },
          { name: "Drones" },
          { name: "Educational Toys" },
          { name: "Stuffed Animals and Dolls" },
        ],
      },
      { name: "Arts, Crafts and Sewing" },
      { name: "Collectibles" },
      { name: "Coins" },
      { name: "Sports Memorabilia" },
      {
        name: "Media",
        slug: "boeken",
        children: [
          { name: "Book, Magazine and Newspapers" },
          { name: "Video Streaming" },
          { name: "Music Streaming" },
        ],
      },
    ],
  },
  {
    name: "FOOD AND GIFTS",
    slug: "eten-drinken",
    column: 2,
    children: [
      { name: "Florists" },
      {
        name: "Gift Shops",
        children: [
          { name: "Novelty Gifts" },
          { name: "Religious Gifts" },
        ],
      },
      {
        name: "Personalized Gifts",
        children: [
          { name: "Baby Gifts" },
          { name: "Personalized Books", slug: "boeken" },
          { name: "Wedding Gifts" },
        ],
      },
      { name: "Gift Baskets" },
      { name: "Gift Cards" },
      { name: "Wine Clubs" },
    ],
  },
  {
    name: "FOOD AND GROCERY",
    slug: "eten-drinken",
    column: 2,
    children: [
      {
        name: "Wine and Spirits",
        children: [
          { name: "Wine" },
          { name: "Homebrew and Winemaking Supplies" },
        ],
      },
      {
        name: "Gourmet Grocery",
        children: [
          { name: "Packaged Meals and Snacks" },
          { name: "Coffee" },
          { name: "Tea" },
        ],
      },
      { name: "Convenience Food Stores" },
      {
        name: "Specialty Foods",
        children: [
          { name: "Cheese" },
          { name: "Meat and Seafood" },
          { name: "Desserts and Sweets" },
        ],
      },
      {
        name: "Tobacco",
        children: [
          { name: "Cigars" },
          { name: "Vaping" },
        ],
      },
    ],
  },
  {
    name: "HOME AND GARDEN",
    slug: "huis-inrichting",
    column: 2,
    children: [
      {
        name: "Furniture and Decor",
        children: [
          { name: "Bathroom Furniture and Vanities" },
          { name: "Chairs" },
          { name: "Mattresses" },
          { name: "Patio Furniture" },
          { name: "Home Decor" },
        ],
      },
      { name: "Blinds" },
      {
        name: "Bed and Bath",
        children: [
          { name: "Bedding" },
          { name: "Pillows" },
        ],
      },
      {
        name: "Cleaning and Organization",
        children: [
          { name: "Vacuums and Cleaning Products" },
          { name: "Food Storage" },
          { name: "Lunchbags" },
        ],
      },
      {
        name: "Household Appliances",
        children: [
          { name: "Fireplaces and Woodstoves" },
          { name: "Grills" },
          { name: "Heating and Cooling" },
          { name: "Ovens and Ranges" },
          { name: "Refrigerators and Freezers" },
        ],
      },
      {
        name: "Kitchen and Dining",
        children: [
          { name: "Cookware and Cutlery" },
          { name: "Small Appliances" },
          { name: "Tableware" },
        ],
      },
      { name: "Lighting" },
    ],
  },

  /* ---------------------------------------------------------------- column 3 */
  {
    name: "LUGGAGE",
    slug: "reizen",
    column: 3,
    children: [{ name: "Backpacks" }],
  },
  {
    name: "NURSERY AND GARDEN",
    slug: "tuin",
    column: 3,
    children: [
      { name: "Seeds and Plants" },
      { name: "Pools and Supplies" },
    ],
  },
  {
    name: "HOME IMPROVEMENT AND TOOLS",
    slug: "huis-inrichting",
    column: 3,
    children: [
      { name: "Power Tools" },
      { name: "Woodworking Tools" },
      { name: "Outdoor Power Equipment" },
      { name: "Hardware and Tools" },
    ],
  },
  {
    name: "PETS",
    slug: "dieren",
    column: 3,
    children: [{ name: "Pet Food and Supplies" }],
  },
  {
    name: "BUSINESS SERVICES AND SUPPLIES",
    slug: "software",
    column: 3,
    children: [
      {
        name: "Office Supplies and Stationery",
        children: [
          { name: "Office Supplies" },
          { name: "Stationery and Cards" },
          { name: "School Supplies" },
        ],
      },
      { name: "Office Furniture" },
      { name: "Checks" },
      { name: "Restaurant Supplies" },
      { name: "Web Hosting" },
      { name: "VPN" },
      { name: "Accounting" },
      { name: "Career Services" },
      { name: "Ink and Toner" },
      { name: "Marketing and PR" },
      { name: "Business Cards and Printing" },
      { name: "Custom Printing" },
    ],
  },
  {
    name: "SOFTWARE",
    slug: "software",
    column: 3,
    children: [
      { name: "Antivirus" },
      { name: "Parental Control Software" },
      { name: "Education Software" },
      { name: "Audio and Video Editing Software" },
      { name: "Graphics and Photo Editing Software" },
      { name: "Maintenance and Utility Software" },
      { name: "Online Backup Services" },
      { name: "Productivity Software" },
      { name: "Web Design and Development Software" },
    ],
  },
  {
    name: "PROFESSIONAL AND EDUCATION SERVICES",
    slug: "software",
    column: 3,
    children: [
      { name: "People Search" },
      { name: "Tutoring and Test Prep" },
      { name: "Professional Development" },
      { name: "Photo Prints and Printing" },
      { name: "Genealogy" },
      { name: "Legal Services" },
      { name: "Insurance" },
    ],
  },
  {
    name: "FINANCIAL SERVICES",
    slug: "verzekeringen",
    column: 3,
    children: [
      { name: "Credit Reports and Scores" },
      { name: "Tax Preparation" },
      { name: "Credit Cards and Banking" },
      { name: "Currency and Crypto Exchanges" },
      { name: "Identity Theft Protection" },
    ],
  },
  {
    name: "HOME SERVICES AND UTILITIES",
    slug: "huis-inrichting",
    column: 3,
    children: [
      { name: "Contractors" },
      {
        name: "Moving",
        children: [{ name: "Storage Facilities" }],
      },
      { name: "Grocery Delivery", slug: "eten-drinken" },
      { name: "VoIP", slug: "software" },
    ],
  },
  {
    name: "RESTAURANTS AND DINING",
    slug: "eten-drinken",
    column: 3,
    children: [
      {
        name: "Fast Food Restaurants",
        children: [
          { name: "Burger" },
          { name: "Chicken" },
          { name: "Pizza" },
          { name: "Sandwich" },
        ],
      },
      { name: "Food Delivery Services" },
      {
        name: "Full-Service Restaurants",
        children: [
          { name: "Casual Dining Restaurants" },
          { name: "Bar and Grill" },
          { name: "Breakfast" },
          { name: "Italian" },
          { name: "Mexican" },
          { name: "Seafood" },
          { name: "Steak" },
        ],
      },
    ],
  },
  {
    name: "TRAVEL",
    slug: "reizen",
    column: 3,
    children: [
      { name: "Hotel and Motels" },
      {
        name: "Flights",
        children: [{ name: "Airlines" }],
      },
      { name: "Travel Agencies" },
      { name: "Car Rentals" },
      { name: "Truck and RV Rentals" },
      { name: "Rail and Car Services" },
      { name: "Cruises" },
      { name: "Short-term Rentals and Lodging" },
      {
        name: "Sightseeing",
        children: [
          { name: "Amusement Parks" },
          { name: "Aquariums" },
          { name: "Museums" },
          { name: "Zoos" },
        ],
      },
    ],
  },
];

/** Number of nodes in a branch — used to keep the three columns balanced. */
export function countNodes(node: CategoryNode): number {
  return 1 + (node.children ?? []).reduce((total, child) => total + countNodes(child), 0);
}

/**
 * Splits the groups into three columns.
 *
 * Groups with an explicit `column` keep that column (the published layout).
 * Groups without one are appended to the currently shortest column, so a new
 * group added by an admin always lands somewhere sensible and the columns
 * stay visually balanced.
 */
export function splitIntoColumns(groups: readonly CategoryGroup[], total = 3): CategoryNode[][] {
  const columns: CategoryNode[][] = Array.from({ length: total }, () => []);
  const weights = new Array<number>(total).fill(0);

  for (const group of groups) {
    const explicit = group.column ? group.column - 1 : -1;
    let target = explicit >= 0 && explicit < total ? explicit : 0;
    if (explicit < 0 || explicit >= total) {
      target = weights.indexOf(Math.min(...weights));
    }
    columns[target].push(group);
    weights[target] += countNodes(group);
  }

  return columns;
}
