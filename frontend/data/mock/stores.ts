import type { Store } from "@/types";

/**
 * DEVELOPMENT MOCK DATA — fictional structural data for layout/UX only.
 * These are NOT live or verified offers. Real data arrives via the API layer.
 */
export const mockStores: Store[] = [
  {
    id: "bol-com",
    slug: "bol-com",
    name: "bol.com",
    nameEn: "bol.com",
    description:
      "De grootste online warenhuis van Nederland met miljoenen producten, van boeken en speelgoed tot elektronica en huishoudelijke artikelen.",
    descriptionEn:
      "The Netherlands' largest online department store, with millions of products from books and toys to electronics and homeware.",
    websiteUrl: "https://www.bol.com/nl/nl/",
    brandColor: "#0B4FD8",
    initials: "b",
    isFeatured: true,
    popularity: 100,
    faq: [
      {
        question: "Hoe gebruik ik een kortingscode van bol.com?",
        answer:
          "Plak de code in het kortingscodeveld in je winkelwagen voordat je afrekent. De korting wordt direct verrekend met je bestelling.",
      },
      {
        question: "Werken kortingscodes altijd bij bol.com?",
        answer:
          "Niet elke code geldt op elk product. Controleer de voorwaarden bij de code: sommige codes gelden alleen op bepaalde categorieën of bij een minimaal bestelbedrag.",
      },
      {
        question: "Kan ik meerdere codes tegelijk gebruiken?",
        answer:
          "Doorgaans kun je per bestelling één kortingscode inwisselen. Bekijk de actievoorwaarden voor de exacte regels.",
      },
    ],
    createdAt: "2025-01-10T09:00:00.000Z",
    updatedAt: "2026-10-01T09:00:00.000Z",
  },
  {
    id: "zalando",
    slug: "zalando",
    name: "Zalando",
    description:
      "Europese online modeketen met kleding, schoenen en accessoires van meer dan 2.500 merken, inclusief gratis retourneren.",
    descriptionEn:
      "European online fashion retailer with clothing, shoes and accessories from more than 2,500 brands, including free returns.",
    websiteUrl: "https://www.zalando.nl/",
    brandColor: "#1D1D1B",
    initials: "Z",
    isFeatured: true,
    popularity: 96,
    faq: [
      {
        question: "Werkt een Zalando kortingscode op sale-artikelen?",
        answer:
          "Dat verschilt per code. Bij sommige codes geldt de korting ook op afgeprijsde items, bij andere alleen op de reguliere collectie. Lees de voorwaarden bij de code.",
      },
      {
        question: "Hoe lang is een Zalando code geldig?",
        answer:
          "De geldigheidsdatum staat bij elke code vermeld. Is de datum verstreken, dan wordt de code automatisch uit ons overzicht verwijderd.",
      },
    ],
    createdAt: "2025-01-12T09:00:00.000Z",
    updatedAt: "2026-10-01T09:00:00.000Z",
  },
  {
    id: "coolblue",
    slug: "coolblue",
    name: "Coolblue",
    description:
      "Nederlandse specialist in consumer electronics, witgoed en accessoires met eigen bezorging en installatieservice.",
    descriptionEn:
      "Dutch consumer electronics, major appliances and accessories specialist with its own delivery and installation service.",
    websiteUrl: "https://www.coolblue.nl/",
    brandColor: "#00A1EC",
    initials: "cb",
    isFeatured: true,
    popularity: 94,
    faq: [
      {
        question: "Kan ik een Coolblue kortingscode combineren met een actieprijs?",
        answer:
          "Meestal wel, zolang de code niet expliciet is uitgesloten. De korting wordt pas zichtbaar in de laatste stap van het bestelproces.",
      },
    ],
    createdAt: "2025-01-15T09:00:00.000Z",
    updatedAt: "2026-10-01T09:00:00.000Z",
  },
  {
    id: "mediamarkt",
    slug: "mediamarkt",
    name: "MediaMarkt",
    description:
      "Grote Europese keten voor televisies, laptops, smartphones, witgoed en huishoudelijke apparatuur.",
    descriptionEn:
      "Large European chain for televisions, laptops, smartphones, major appliances and home appliances.",
    websiteUrl: "https://www.mediamarkt.nl/",
    brandColor: "#DF0007",
    initials: "MM",
    isFeatured: true,
    popularity: 92,
    faq: [
      {
        question: "Waar vul ik een MediaMarkt kortingscode in?",
        answer:
          "In je winkelwagen, onder het kopje 'Kortingscode invoeren'. De korting wordt direct aan je totaal toegevoegd.",
      },
    ],
    createdAt: "2025-01-18T09:00:00.000Z",
    updatedAt: "2026-10-01T09:00:00.000Z",
  },
  {
    id: "wehkamp",
    slug: "wehkamp",
    name: "wehkamp",
    description:
      "Nederlands online warenhuis met mode, wonen, elektronica en verzorging, bekend om flexibele betaalopties.",
    descriptionEn:
      "Dutch online department store for fashion, home, electronics and personal care, known for flexible payment options.",
    websiteUrl: "https://www.wehkamp.nl/",
    brandColor: "#E4002B",
    initials: "w",
    isFeatured: true,
    popularity: 88,
    createdAt: "2025-01-20T09:00:00.000Z",
    updatedAt: "2026-10-01T09:00:00.000Z",
  },
  {
    id: "amazon-nl",
    slug: "amazon-nl",
    name: "Amazon.nl",
    description:
      "Nederlandse marktplaats met een breed assortiment aan elektronica, boeken, huishoudelijke artikelen en meer.",
    descriptionEn:
      "Dutch marketplace with a broad range of electronics, books, household items and more.",
    websiteUrl: "https://www.amazon.nl/",
    brandColor: "#FF9900",
    initials: "a",
    isFeatured: true,
    popularity: 90,
    createdAt: "2025-01-22T09:00:00.000Z",
    updatedAt: "2026-10-01T09:00:00.000Z",
  },
  {
    id: "hm",
    slug: "hm",
    name: "H&M",
    description:
      "Wereldwijd modemerk met betaalbare kleding, schoenen en accessoires voor het hele gezin.",
    descriptionEn:
      "Global fashion brand with affordable clothing, shoes and accessories for the whole family.",
    websiteUrl: "https://www2.hm.com/nl_nl/",
    brandColor: "#E50010",
    initials: "H&M",
    isFeatured: true,
    popularity: 86,
    createdAt: "2025-01-25T09:00:00.000Z",
    updatedAt: "2026-10-01T09:00:00.000Z",
  },
  {
    id: "booking-com",
    slug: "booking-com",
    name: "Booking.com",
    description:
      "Wereldwijd platform voor accommodaties, van hotels en bed & breakfasts tot vakantiehuizen.",
    descriptionEn:
      "Worldwide accommodation platform, from hotels and B&Bs to holiday homes.",
    websiteUrl: "https://www.booking.com/index.nl.html",
    brandColor: "#003580",
    initials: "B",
    isFeatured: true,
    popularity: 89,
    faq: [
      {
        question: "Hoe verzilver ik een Booking.com korting?",
        answer:
          "Korting wordt meestal automatisch toegepast op geselecteerde accommodaties wanneer je via onze link boekt. Check de voorwaarden bij de deal.",
      },
    ],
    createdAt: "2025-01-28T09:00:00.000Z",
    updatedAt: "2026-10-01T09:00:00.000Z",
  },
  {
    id: "decathlon",
    slug: "decathlon",
    name: "Decathlon",
    description:
      "Sportketen met eigen merken voor meer dan 80 sporten, van hardlopen en fietsen tot kamperen.",
    descriptionEn:
      "Sports retailer with in-house brands for more than 80 sports, from running and cycling to camping.",
    websiteUrl: "https://www.decathlon.nl/",
    brandColor: "#0082C3",
    initials: "D",
    popularity: 78,
    createdAt: "2025-02-01T09:00:00.000Z",
    updatedAt: "2026-10-01T09:00:00.000Z",
  },
  {
    id: "action",
    slug: "action",
    name: "Action",
    description:
      "Prijsvechter met een wisselend assortiment aan huishoudelijke artikelen, speelgoed, decoratie en verzorging.",
    descriptionEn:
      "Value retailer with a rotating range of household items, toys, decor and personal care.",
    websiteUrl: "https://www.action.com/nl-nl/",
    brandColor: "#00AEEF",
    initials: "A",
    popularity: 80,
    createdAt: "2025-02-03T09:00:00.000Z",
    updatedAt: "2026-10-01T09:00:00.000Z",
  },
  {
    id: "hema",
    slug: "hema",
    name: "HEMA",
    description:
      "Nederlands icoon met eigen producten voor dagelijks gebruik, van voeding en verzorging tot feestartikelen.",
    descriptionEn:
      "Dutch icon with its own everyday products, from food and personal care to party supplies.",
    websiteUrl: "https://www.hema.nl/",
    brandColor: "#E30613",
    initials: "H",
    popularity: 76,
    createdAt: "2025-02-05T09:00:00.000Z",
    updatedAt: "2026-10-01T09:00:00.000Z",
  },
  {
    id: "ikea",
    slug: "ikea",
    name: "IKEA",
    description:
      "Wereldwijd woonwarenhuis met betaalbare meubels, verlichting en woonaccessoires voor elk interieur.",
    descriptionEn:
      "Worldwide home furnishings store with affordable furniture, lighting and accessories for every home.",
    websiteUrl: "https://www.ikea.com/nl/nl/",
    brandColor: "#0058A3",
    initials: "IK",
    popularity: 84,
    createdAt: "2025-02-07T09:00:00.000Z",
    updatedAt: "2026-10-01T09:00:00.000Z",
  },
  {
    id: "zara",
    slug: "zara",
    name: "Zara",
    description:
      "Spaanse modeketen met trendsnel collecties voor dames, heren en kinderen.",
    descriptionEn:
      "Spanish fashion chain with fast-turning collections for women, men and children.",
    websiteUrl: "https://www.zara.com/nl/",
    brandColor: "#111111",
    initials: "ZR",
    popularity: 82,
    createdAt: "2025-02-09T09:00:00.000Z",
    updatedAt: "2026-10-01T09:00:00.000Z",
  },
  {
    id: "asos",
    slug: "asos",
    name: "ASOS",
    description:
      "Online modewinkel met eigen merken en ruim 850 merken voor jongvolwassenen.",
    descriptionEn:
      "Online fashion retailer with its own brands and more than 850 labels for young adults.",
    websiteUrl: "https://www.asos.com/nl/",
    brandColor: "#2D2D2D",
    initials: "AS",
    popularity: 74,
    createdAt: "2025-02-11T09:00:00.000Z",
    updatedAt: "2026-10-01T09:00:00.000Z",
  },
  {
    id: "expedia",
    slug: "expedia",
    name: "Expedia",
    description:
      "Reisplatform voor vluchten, hotels, autohuur en complete vakantiepakketten.",
    descriptionEn:
      "Travel platform for flights, hotels, car rental and complete holiday packages.",
    websiteUrl: "https://www.expedia.nl/",
    brandColor: "#191E3B",
    initials: "E",
    popularity: 70,
    createdAt: "2025-02-13T09:00:00.000Z",
    updatedAt: "2026-10-01T09:00:00.000Z",
  },
  {
    id: "otto",
    slug: "otto",
    name: "OTTO",
    description:
      "Online warenhuis met mode, wonen en elektronica, met focus op betaalbaar en op afbetaling.",
    descriptionEn:
      "Online department store for fashion, home and electronics, focused on affordability and instalment plans.",
    websiteUrl: "https://www.otto.nl/",
    brandColor: "#CC0000",
    initials: "O",
    popularity: 66,
    createdAt: "2025-02-15T09:00:00.000Z",
    updatedAt: "2026-10-01T09:00:00.000Z",
  },
  {
    id: "douglas",
    slug: "douglas",
    name: "Douglas",
    description:
      "Parfumerie met beauty, huidverzorging en make-up van meer dan 700 merken.",
    descriptionEn:
      "Perfumery with beauty, skincare and makeup from more than 700 brands.",
    websiteUrl: "https://www.douglas.nl/",
    brandColor: "#111111",
    initials: "DG",
    popularity: 72,
    createdAt: "2025-02-17T09:00:00.000Z",
    updatedAt: "2026-10-01T09:00:00.000Z",
  },
  {
    id: "ici-paris-xl",
    slug: "ici-paris-xl",
    name: "ICI PARIS XL",
    description:
      "Parfumerie en beautyketen met luxe merken, verzorgingsproducten en cadeausets.",
    descriptionEn:
      "Perfumery and beauty chain with luxury brands, skincare products and gift sets.",
    websiteUrl: "https://www.iciparisxl.nl/",
    brandColor: "#1A1A1A",
    initials: "IP",
    popularity: 64,
    createdAt: "2025-02-19T09:00:00.000Z",
    updatedAt: "2026-10-01T09:00:00.000Z",
  },
  {
    id: "kruidvat",
    slug: "kruidvat",
    name: "Kruidvat",
    description:
      "Drogisterij met dagelijkse aanbiedingen op verzorging, make-up en huishoudelijke producten.",
    descriptionEn:
      "Drugstore with daily offers on personal care, makeup and household products.",
    websiteUrl: "https://www.kruidvat.nl/",
    brandColor: "#E2001A",
    initials: "K",
    popularity: 68,
    createdAt: "2025-02-21T09:00:00.000Z",
    updatedAt: "2026-10-01T09:00:00.000Z",
  },
  {
    id: "gamma",
    slug: "gamma",
    name: "GAMMA",
    description:
      "Bouwmarktketen met verf, behang, gereedschap en materiaal voor klus en tuin.",
    descriptionEn:
      "DIY store chain with paint, wallpaper, tools and materials for jobs indoors and in the garden.",
    websiteUrl: "https://www.gamma.nl/",
    brandColor: "#FFD100",
    initials: "G",
    popularity: 62,
    createdAt: "2025-02-23T09:00:00.000Z",
    updatedAt: "2026-10-01T09:00:00.000Z",
  },
  {
    id: "praxis",
    slug: "praxis",
    name: "Praxis",
    description:
      "Bouwmarkt voor iedere klus, met eigen merken, verf, verlichting en tuinmeubelen.",
    descriptionEn:
      "DIY store for every job, with own brands, paint, lighting and garden furniture.",
    websiteUrl: "https://www.praxis.nl/",
    brandColor: "#EE3124",
    initials: "P",
    popularity: 60,
    createdAt: "2025-02-25T09:00:00.000Z",
    updatedAt: "2026-10-01T09:00:00.000Z",
  },
  {
    id: "hellofresh",
    slug: "hellofresh",
    name: "HelloFresh",
    description:
      "Maaltijdboxen met recepten en ingrediënten, wekelijks bezorgd en eenvoudig aan te passen.",
    descriptionEn:
      "Meal kits with recipes and ingredients, delivered weekly and easy to customise.",
    websiteUrl: "https://www.hellofresh.nl/",
    brandColor: "#91C11E",
    initials: "HF",
    popularity: 71,
    createdAt: "2025-03-01T09:00:00.000Z",
    updatedAt: "2026-10-01T09:00:00.000Z",
  },
  {
    id: "aldi",
    slug: "aldi",
    name: "ALDI",
    description:
      "Supermarkt met scherpe basisprijzen en een wisselend assortiment aan weekacties.",
    descriptionEn:
      "Supermarket with sharp everyday prices and a rotating range of weekly offers.",
    websiteUrl: "https://www.aldi.nl/",
    brandColor: "#0050AA",
    initials: "AL",
    popularity: 58,
    createdAt: "2025-03-03T09:00:00.000Z",
    updatedAt: "2026-10-01T09:00:00.000Z",
  },
  {
    id: "jumbo",
    slug: "jumbo",
    name: "Jumbo",
    description:
      "Supermarkt met breed assortiment, boodschappenbezorging en digitale spaaracties.",
    descriptionEn:
      "Supermarket with a wide range, grocery delivery and digital savings promotions.",
    websiteUrl: "https://www.jumbo.com/",
    brandColor: "#FFCC00",
    initials: "J",
    popularity: 57,
    createdAt: "2025-03-05T09:00:00.000Z",
    updatedAt: "2026-10-01T09:00:00.000Z",
  },
];
