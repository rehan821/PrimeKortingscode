import type { BlogPost } from "@/types";

/** DEVELOPMENT MOCK DATA — sample editorial content for layout/UX only. */
export const mockBlogPosts: BlogPost[] = [
  {
    id: "b-001",
    slug: "zo-vind-je-altijd-een-werkende-kortingscode",
    locale: "nl",
    title: "Zo vind je altijd een werkende kortingscode",
    excerpt:
      "Van browser-extensies tot nieuwsbrieven: de manieren waarop je snel een code vindt die ook echt werkt.",
    category: "Bespaartips",
    tags: ["kortingscode", "besparen", "online shoppen"],
    author: "Sanne de Vries",
    readingTimeMinutes: 5,
    isFeatured: true,
    body: `<p>Een kortingscode vinden is niet moeilijk. Een code vinden die <strong>ook echt werkt</strong> is een ander verhaal. In dit artikel lees je de stappen die wij zelf gebruiken voordat we iets bestellen.</p>
<h2>1. Controleer de geldigheidsdatum</h2>
<p>De meeste teleurstellingen komen door verlopen codes. Kijk altijd naar de datum bij de code en of er een maximale bestelwaarde geldt. Op PrimeKortingscode tonen we bij elke code de verloopdatum, zodat je niet hoeft te gokken.</p>
<h2>2. Lees de voorwaarden</h2>
<p>Een code van 20% korting geldt soms alleen op de reguliere collectie, of alleen vanaf €50. De voorwaarden staan altijd bij de code vermeld — neem de tien seconden om ze te lezen.</p>
<h2>3. Probeer de code vóór het afrekenen</h2>
<p>Plak de code in je winkelwagen voordat je betaalt. Werkt de code niet? Probeer dan een alternatief uit het overzicht: bij de meeste winkels staan meerdere acties naast elkaar.</p>
<h2>4. Combineer met cashback en ledenvoordeel</h2>
<p>Kortingscodes zijn vaak te combineren met gratis bezorging, ledenvoordeel of cashback. Zo haal je het meeste uit één bestelling.</p>
<h2>5. Meld een niet-werkende code</h2>
<p>Zie je een code die niet meer werkt? Laat het ons weten via de contactpagina. Zo houden we het overzicht voor iedereen accuraat.</p>`,
    publishedAt: "2026-09-18T10:00:00.000Z",
    updatedAt: "2026-09-18T10:00:00.000Z",
    coverImage: "/blog/kortingscode-vinden.svg",
  },
  {
    id: "b-002",
    slug: "black-friday-nederland-gids",
    locale: "nl",
    title: "Black Friday in Nederland: zo bereid je je voor",
    excerpt:
      "Een rustige voorbereiding voorkomt dat je koopt wat je niet nodig hebt — en dat je de beste deal mist.",
    category: "Koopgidsen",
    tags: ["black friday", "deals", "plannen"],
    author: "Thomas Bakker",
    readingTimeMinutes: 6,
    isFeatured: true,
    body: `<p>Black Friday is in Nederland uitgegroeid tot één van de grootste kortingsmomenten van het jaar. Juist daarom loont een goede voorbereiding.</p>
<h2>Maak een lijstje vooraf</h2>
<p>Schrijf op wat je echt nodig hebt. Aanbiedingen zijn er om te verleiden; een lijstje helpt je om alleen te kopen wat je van plan was.</p>
<h2>Volg je favoriete winkels</h2>
<p>Bewaar de winkelpagina's die je interessant vindt. Wanneer de Black Friday-deals live gaan, staan ze bovenaan het overzicht — zonder dat je hoeft te zoeken.</p>
<h2>Vergelijk de echte prijs</h2>
<p>Niet elke "was-nu" prijs is een echte korting. Vergelijk met de prijs van de afgelopen maanden voordat je toeslaat.</p>
<h2>Let op de retourvoorwaarden</h2>
<p>Acties en retourrecht gaan niet altijd samen. Controleer de voorwaarden, zodat je geen cadeau koopt dat je niet kunt terugbrengen.</p>`,
    publishedAt: "2026-09-26T10:00:00.000Z",
    updatedAt: "2026-09-26T10:00:00.000Z",
    coverImage: "/blog/black-friday.svg",
  },
  {
    id: "b-003",
    slug: "online-shoppen-bij-nederlandse-webwinkels",
    locale: "nl",
    title: "Waarom shoppen bij Nederlandse webwinkels loont",
    excerpt:
      "Snelle bezorging, eenvoudig retourneren en Nederlandse klantenservice: de voordelen op een rij.",
    category: "Koopgidsen",
    tags: ["webwinkels", "bezorging", "retour"],
    author: "Lisa Jansen",
    readingTimeMinutes: 4,
    body: `<p>Nederlandse webwinkels hebben de afgelopen jaren flink geïnvesteerd in bezorging en service. Dat merk je vooral wanneer iets niet volgens plan verloopt.</p>
<h2>Bezorging die je kent</h2>
<p>Avondbezorging, een bezorgvenster van twee uur en dezelfde dag ophalen in de winkel: het zijn standaardopties geworden.</p>
<h2>Retourneren zonder gedoe</h2>
<p>Een Nederlands retourlabel, duidelijke termijnen en vaak gratis retour — dat scheelt bij aankopen waarbij de maat of kleur tegenvalt.</p>
<h2>Klantenservice in je eigen taal</h2>
<p>Bij vragen over een bestelling of actie krijg je sneller en duidelijker antwoord, zowel via chat als telefoon.</p>
<h2>En toch vergelijken</h2>
<p>Ook buitenlanders concurreren scherp. Vergelijk daarom altijd de totale prijs: product, bezorgkosten én eventuele korting.</p>`,
    publishedAt: "2026-10-01T10:00:00.000Z",
    updatedAt: "2026-10-01T10:00:00.000Z",
    coverImage: "/blog/nederlandse-webwinkels.svg",
  },
  {
    id: "b-004",
    slug: "besparen-op-reizen-en-vakanties",
    locale: "nl",
    title: "Besparen op je vakantie zonder in te leveren op comfort",
    excerpt:
      "Van boekingsmoment tot bestemming: waar je écht het verschil maakt in de prijs.",
    category: "Reizen",
    tags: ["reizen", "vakantie", "besparen"],
    author: "Mark Visser",
    readingTimeMinutes: 5,
    body: `<p>Vakanties zijn duur geworden. Met een paar slimme keuzes houd je budget over voor wat er echt toe doet: ter plaatse.</p>
<h2>Boek buiten het hoogseizoen</h2>
<p>Vluchten en hotels variëren enorm per week. Een dag verschil in vertrek kan tientallen euro's schelen.</p>
<h2>Gebruik ledentariew</h2>
<p>Booking, Expedia en airlines bieden ledenvoordeel dat niet altijd op de voorpagina staat. Aanmelden is gratis.</p>
<h2>Vergelijk pakketten met losse boekingen</h2>
<p>Een pakket is niet altijd duurder. Reken de onderdelen los uit voordat je boekt.</p>
<h2>Zet prijsmeldingen aan</h2>
<p>Zie je een mooie deal? Zet een melding aan zodat je toeslaat wanneer de prijs daalt in plaats van wanneer jij eraan denkt.</p>`,
    publishedAt: "2026-10-04T10:00:00.000Z",
    updatedAt: "2026-10-04T10:00:00.000Z",
    coverImage: "/blog/besparen-reizen.svg",
  },
  {
    id: "b-005",
    slug: "hoe-herken-je-een-echte-aanbieding",
    locale: "nl",
    title: "Hoe herken je een échte aanbieding?",
    excerpt:
      "Prijsverhogingen voor de actie, 'gratis' met addertjes en andere trucs — leer ze herkennen.",
    category: "Bespaartips",
    tags: ["aanbiedingen", "prijs", "opletten"],
    author: "Sanne de Vries",
    readingTimeMinutes: 4,
    body: `<p>Niet elke actie is een koopje. Met deze checklist zie je sneller of een aanbieding echt voordelig is.</p>
<h2>Controleer de eerdere prijs</h2>
<p>Kijk hoe duur het product de afgelopen maanden was. Is de actieprijs gelijk aan de oude prijs, dan is er geen echte korting.</p>
<h2>Let op het aantal</h2>
<p>"2 voor de prijs van 1" kan duurder uitvallen dan één exemplaar van een ander merk. Reken het per stuk uit.</p>
<h2>Lees het kleine printje</h2>
<p>Verzendkosten, minimale bestelwaarde en uitzonderingen bepalen de echte prijs.</p>
<h2>Gebruik een prijstracker</h2>
<p>Een simpele prijsvergelijker of browser-extensie vertelt je direct of je nu toeslaat of nog even wacht.</p>`,
    publishedAt: "2026-10-06T10:00:00.000Z",
    updatedAt: "2026-10-06T10:00:00.000Z",
    coverImage: "/blog/echte-aanbieding.svg",
  },
  {
    id: "b-006",
    slug: "saving-money-on-your-groceries",
    locale: "en",
    title: "How to cut your grocery bill without cutting quality",
    excerpt:
      "Practical habits that lower your weekly shop cost while keeping dinner interesting.",
    category: "Saving tips",
    tags: ["groceries", "saving", "habits"],
    author: "Emma Brown",
    readingTimeMinutes: 4,
    body: `<p>Grocery prices add up fast. A few consistent habits make a real difference over a month.</p>
<h2>Plan around one list</h2>
<p>Write the list before you shop and stick to it. Impulse buys are where budgets quietly disappear.</p>
<h2>Compare unit prices</h2>
<p>Bigger is not always cheaper. Check the price per litre or kilo instead of the shelf price.</p>
<h2>Use weekly offers deliberately</h2>
<p>Buy the offer only if it is something you would have bought anyway — otherwise you are spending, not saving.</p>`,
    publishedAt: "2026-09-22T10:00:00.000Z",
    updatedAt: "2026-09-22T10:00:00.000Z",
    coverImage: "/blog/grocery-savings.svg",
  },
];
