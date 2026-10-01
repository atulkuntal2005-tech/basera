/**
 * ============================================================================
 *  BASERA RESTAURANT & HOTEL — single source of truth for editable content
 * ============================================================================
 *  Everything a non-developer might want to change lives in this file:
 *   - contact details, address, Instagram
 *   - menu categories, dishes and PRICES
 *   - images (hero, gallery, etc.)
 *   - services, hotel highlights, event types
 *
 *  Search this file for the keywords below to find the spots that need
 *  real information from the owner:
 *     YOUR_GOOGLE_MAPS_LINK   -> exact Google Maps share link
 *     YOUR_REAL_MENU_PRICES   -> the PRICES object
 *     YOUR_REAL_IMAGES        -> the `images` and `galleryImages` blocks
 *     YOUR_BUSINESS_EMAIL     -> set in .env (BUSINESS_EMAIL), never here
 * ============================================================================
 */

export type ImageRef = {
  /** Stock photo id from pexels.com (representative imagery only). */
  pexelsId?: number;
  /** Path to a real photo placed in /public, e.g. "/photos/dining-hall.jpg". Wins over pexelsId. */
  src?: string;
};

export const business = {
  name: "Basera Restaurant & Hotel",
  shortName: "Basera",
  tagline: "Restaurant & Hotel",

  phoneDisplay: "+91 94122 78120",
  phoneTel: "+919412278120",
  /** International format, digits only. Used for every wa.me link on the site. */
  whatsappNumber: "919412278120",

  instagramHandle: "baserarestaurant",
  instagramUrl: "https://www.instagram.com/baserarestaurant/",

  /**
   * Public email shown to visitors. Leave empty to hide it.
   * (The address that RECEIVES enquiries is set privately in .env → BUSINESS_EMAIL.)
   */
  publicEmail: "",

  address: {
    line1: "Near 141/6, NH-2 Delhi–Agra Bypass Road",
    line2: "Shri Radha Puram, Chourah",
    city: "Mathura",
    state: "Uttar Pradesh",
    postalCode: "281001",
    country: "IN",
  },

  /**
   * YOUR_GOOGLE_MAPS_LINK
   * Paste the "Share → Copy link" URL from Google Maps here. If empty, the site
   * falls back to a search built from the written address (no invented coordinates).
   */
  mapsLink: "",

  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
};

export const fullAddress = `${business.address.line1}, ${business.address.line2}, ${business.address.city}, ${business.address.state} ${business.address.postalCode}`;

const mapsQuery = encodeURIComponent(`${business.name}, ${fullAddress}`);
export const mapsOpenUrl =
  business.mapsLink || `https://www.google.com/maps/search/?api=1&query=${mapsQuery}`;
export const mapsDirectionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${mapsQuery}`;
export const mapsEmbedUrl = `https://www.google.com/maps?q=${mapsQuery}&output=embed`;

/* ------------------------------------------------------------------------ */
/*  NAVIGATION                                                               */
/* ------------------------------------------------------------------------ */

export const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/restaurant", label: "Restaurant" },
  { href: "/menu", label: "Menu" },
  { href: "/hotel", label: "Hotel" },
  { href: "/banquet", label: "Banquet" },
  { href: "/gallery", label: "Gallery" },
  { href: "/contact", label: "Contact" },
];

/* ------------------------------------------------------------------------ */
/*  IMAGES  (YOUR_REAL_IMAGES)                                               */
/*  Stock photography from Pexels stands in until real photos are supplied.  */
/*  To swap one: replace `{ pexelsId: 123 }` with `{ src: "/photos/x.jpg" }`  */
/* ------------------------------------------------------------------------ */

export const images: Record<string, ImageRef> = {
  hero: { pexelsId: 39604990 },
  about: { pexelsId: 29148133 },
  aboutSmall: { pexelsId: 30858420 },
  restaurant: { pexelsId: 15945660 },
  restaurantSecondary: { pexelsId: 37420999 },
  hotel: { pexelsId: 2736388 },
  hotelSecondary: { pexelsId: 14883357 },
  banquet: { pexelsId: 30215011 },
  banquetSecondary: { pexelsId: 16120230 },
  menuBanner: { pexelsId: 35993886 },
  contactBanner: { pexelsId: 6876589 },
  orderBanner: { pexelsId: 17223838 },
};

export type GalleryCategory = "Food" | "Restaurant" | "Hotel" | "Events";
export type GalleryImage = ImageRef & {
  id: string;
  alt: string;
  caption: string;
  category: GalleryCategory;
  /** Layout hint for the masonry grid */
  shape: "wide" | "tall" | "square";
};

export const galleryCategories: GalleryCategory[] = ["Food", "Restaurant", "Hotel", "Events"];

export const galleryImages: GalleryImage[] = [
  { id: "g1", pexelsId: 29148133, category: "Food", shape: "wide", caption: "A thali with naan, paneer curry and rice", alt: "Representative stock photo of an Indian vegetarian thali with naan, paneer curry and rice" },
  { id: "g2", pexelsId: 15945660, category: "Restaurant", shape: "tall", caption: "Warm wooden dining interior", alt: "Representative stock photo of a restaurant interior with a wooden ceiling" },
  { id: "g3", pexelsId: 2736388, category: "Hotel", shape: "wide", caption: "A quiet room with fresh linen", alt: "Representative stock photo of a hotel room with white bedding and soft lighting" },
  { id: "g4", pexelsId: 30215011, category: "Events", shape: "wide", caption: "Floral tables for a celebration", alt: "Representative stock photo of a banquet hall set with floral centrepieces" },
  { id: "g5", pexelsId: 30858420, category: "Food", shape: "square", caption: "Paneer in a rich tomato gravy", alt: "Representative stock photo of paneer tikka masala" },
  { id: "g6", pexelsId: 14883357, category: "Hotel", shape: "tall", caption: "Comfortable beds, simple and calm", alt: "Representative stock photo of a modern bedroom with plush bedding" },
  { id: "g7", pexelsId: 20422138, category: "Food", shape: "wide", caption: "Crisp dosa with chutneys and sambar", alt: "Representative stock photo of masala dosa with chutneys and sambar" },
  { id: "g8", pexelsId: 6876621, category: "Restaurant", shape: "wide", caption: "Seating for families and groups", alt: "Representative stock photo of restaurant tables and chairs with wall art" },
  { id: "g9", pexelsId: 16120230, category: "Events", shape: "tall", caption: "Decor for a festive evening", alt: "Representative stock photo of a decorated venue with flowers and warm lights" },
  { id: "g10", pexelsId: 12737799, category: "Food", shape: "tall", caption: "Creamy paneer curry with herbs", alt: "Representative stock photo of a paneer curry in a white bowl" },
  { id: "g11", pexelsId: 164595, category: "Hotel", shape: "square", caption: "Soft lighting, restful evenings", alt: "Representative stock photo of a cosy hotel bedroom with soft lighting" },
  { id: "g12", pexelsId: 34278804, category: "Events", shape: "square", caption: "Gold accents for a special table", alt: "Representative stock photo of an elegant table setting with gold candelabra" },
  { id: "g13", pexelsId: 10135116, category: "Restaurant", shape: "square", caption: "A cosy corner to sit back in", alt: "Representative stock photo of a cosy restaurant interior" },
  { id: "g14", pexelsId: 37420999, category: "Food", shape: "wide", caption: "Flatbread, curry and chutney", alt: "Representative stock photo of Indian flatbread with curry and chutney on a wooden plate" },
];

/* ------------------------------------------------------------------------ */
/*  SERVICES / HIGHLIGHTS                                                    */
/* ------------------------------------------------------------------------ */

export const services = [
  { key: "dining", title: "Vegetarian Dining", text: "Fresh and flavourful vegetarian cuisine.", href: "/restaurant" },
  { key: "stay", title: "Comfortable Stays", text: "Relaxing rooms for your Mathura visit.", href: "/hotel" },
  { key: "events", title: "Banquet & Events", text: "A convenient venue for celebrations and gatherings.", href: "/banquet" },
  { key: "contact", title: "Easy Contact", text: "Call, WhatsApp or send an enquiry directly.", href: "/contact" },
] as const;

export const hotelHighlights = [
  { key: "stay", title: "Comfortable accommodation", text: "Rooms to rest properly after a day on the road or around Mathura." },
  { key: "ac", title: "AC rooms", text: "Air-conditioned rooms for a cool, easy stay." },
  { key: "location", title: "Convenient location", text: "On the NH-2 Delhi–Agra Bypass Road at Chourah, simple to reach." },
  { key: "food", title: "Restaurant access", text: "Our vegetarian restaurant is right where you are staying." },
  { key: "parking", title: "Parking", text: "Parking available for guests arriving by car." },
  { key: "care", title: "Guest convenience", text: "Call or message us anytime and we will help plan your stay." },
] as const;

export const eventTypes = [
  { key: "family", title: "Family Functions", text: "Get-togethers where everyone from grandparents to kids can sit down together." },
  { key: "birthday", title: "Birthday Celebrations", text: "Cake, company and a good meal." },
  { key: "anniversary", title: "Anniversaries", text: "A quiet table or a bigger evening, your call." },
  { key: "small", title: "Small Gatherings", text: "Friends, colleagues, neighbours. Easy and unhurried." },
  { key: "social", title: "Social Events", text: "Community meet-ups and get-togethers." },
  { key: "private", title: "Private Functions", text: "Tell us what you have in mind and we will talk it through." },
] as const;

/* ------------------------------------------------------------------------ */
/*  MENU                                                                     */
/* ------------------------------------------------------------------------ */

export type MenuCategory = { slug: string; name: string; blurb: string };
export type MenuItem = {
  id: string;
  name: string;
  description: string;
  category: string;
  /** null = "Price on request" */
  price: number | null;
  veg: true;
};

export const menuCategories: MenuCategory[] = [
  { slug: "starters", name: "Starters", blurb: "Something to begin with." },
  { slug: "paneer-specials", name: "Paneer Specials", blurb: "Soft paneer, slow gravies." },
  { slug: "main-course", name: "Main Course", blurb: "North Indian sabzis and curries." },
  { slug: "dal-and-curries", name: "Dal & Curries", blurb: "Comfort in a bowl." },
  { slug: "indian-breads", name: "Indian Breads", blurb: "Tandoor-fresh and buttered." },
  { slug: "rice-and-biryani", name: "Rice & Biryani", blurb: "Fragrant rice, simple or festive." },
  { slug: "chinese", name: "Chinese", blurb: "Indo-Chinese favourites." },
  { slug: "south-indian", name: "South Indian", blurb: "Dosa, idli and friends." },
  { slug: "snacks", name: "Snacks", blurb: "For tea time or any time." },
  { slug: "beverages", name: "Beverages", blurb: "Hot, cold and in between." },
];

/**
 * YOUR_REAL_MENU_PRICES
 * Add a price (in rupees) using the dish id (the dish name in lowercase with dashes).
 * Anything not listed here shows "Price on request" on the site.
 *
 *   "paneer-butter-masala": 260,
 *   "dal-tadka": 160,
 */
const PRICES: Record<string, number> = {
  // "paneer-butter-masala": 0,
};

const slugify = (s: string) =>
  s.toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

/**
 * YOUR_REAL_MENU — edit dish names / descriptions per category.
 * Format: ["Dish name", "One-line description"]
 * The list below is a typical vegetarian North Indian line-up; availability is
 * always confirmed by Basera when an order is placed.
 */
const rawMenu: Record<string, [string, string][]> = {
  starters: [
    ["Paneer Tikka", "Paneer cubes marinated in spiced curd and grilled."],
    ["Hara Bhara Kabab", "Spinach and green pea patties, pan-crisped."],
    ["Veg Seekh Kabab", "Minced vegetable kababs with gentle spice."],
    ["Mushroom Tikka", "Mushrooms marinated and grilled until smoky."],
    ["Crispy Corn", "Golden corn kernels tossed with pepper and spice."],
  ],
  "paneer-specials": [
    ["Paneer Butter Masala", "Paneer in a silky tomato, butter and cream gravy."],
    ["Shahi Paneer", "Rich, mildly sweet gravy with cashew and cream."],
    ["Kadai Paneer", "Paneer with capsicum in freshly ground kadai masala."],
    ["Palak Paneer", "Paneer folded into smooth spiced spinach."],
    ["Matar Paneer", "Paneer and green peas in a homestyle gravy."],
  ],
  "main-course": [
    ["Mix Veg", "Seasonal vegetables cooked in an onion-tomato masala."],
    ["Malai Kofta", "Soft paneer-potato dumplings in a creamy gravy."],
    ["Veg Kolhapuri", "A spicier mixed vegetable curry for those who like heat."],
    ["Aloo Gobhi", "Potato and cauliflower, dry-cooked with cumin and turmeric."],
    ["Navratan Korma", "Vegetables, fruit and nuts in a mild creamy sauce."],
  ],
  "dal-and-curries": [
    ["Dal Makhani", "Black lentils simmered slowly with butter and cream."],
    ["Dal Tadka", "Yellow dal finished with a ghee and garlic tempering."],
    ["Rajma Masala", "Kidney beans in a thick, homestyle gravy."],
    ["Chole Masala", "Chickpeas cooked with robust Punjabi spices."],
    ["Kadhi Pakora", "Tangy yogurt curry with gram-flour fritters."],
  ],
  "indian-breads": [
    ["Tandoori Roti", "Whole-wheat bread from the tandoor."],
    ["Butter Naan", "Soft leavened bread brushed with butter."],
    ["Garlic Naan", "Naan topped with garlic and coriander."],
    ["Laccha Paratha", "Flaky, layered whole-wheat paratha."],
    ["Missi Roti", "Gram-flour and wheat roti with light spices."],
  ],
  "rice-and-biryani": [
    ["Steamed Rice", "Plain basmati rice, simply steamed."],
    ["Jeera Rice", "Basmati tempered with cumin in ghee."],
    ["Veg Pulao", "Mildly spiced rice cooked with vegetables."],
    ["Veg Biryani", "Layered, aromatic rice with vegetables and whole spices."],
    ["Paneer Biryani", "Biryani rice with marinated paneer."],
  ],
  chinese: [
    ["Veg Hakka Noodles", "Wok-tossed noodles with crunchy vegetables."],
    ["Veg Fried Rice", "Rice stir-fried with vegetables and soy."],
    ["Veg Manchurian", "Vegetable dumplings in a tangy, garlicky sauce."],
    ["Chilli Paneer", "Paneer tossed with peppers, onion and chilli sauce."],
    ["Veg Spring Rolls", "Crisp rolls filled with seasoned vegetables."],
    ["Veg Momos", "Steamed dumplings with a vegetable filling."],
  ],
  "south-indian": [
    ["Plain Dosa", "Thin, crisp rice-and-lentil crepe."],
    ["Masala Dosa", "Dosa filled with spiced potato."],
    ["Idli Sambar", "Soft steamed rice cakes with sambar and chutney."],
    ["Medu Vada", "Crisp lentil doughnuts served with sambar."],
    ["Onion Uttapam", "Thick savoury pancake topped with onion."],
  ],
  snacks: [
    ["Samosa", "Crisp pastry stuffed with spiced potato and peas."],
    ["Paneer Pakora", "Paneer slices in a gram-flour batter, fried golden."],
    ["Bread Pakora", "Stuffed bread fritters, a classic with chai."],
    ["Pav Bhaji", "Buttery mashed vegetable bhaji with soft pav."],
    ["French Fries", "Crisp fries with a pinch of masala."],
    ["Veg Sandwich", "Grilled sandwich with vegetables and chutney."],
  ],
  beverages: [
    ["Masala Chai", "Tea brewed with milk and warming spices."],
    ["Cold Coffee", "Chilled, creamy coffee."],
    ["Sweet Lassi", "Thick, cool yogurt drink."],
    ["Chaas", "Spiced, salted buttermilk."],
    ["Fresh Lime Soda", "Sweet, salted or mixed, your pick."],
    ["Packaged Water", "Sealed bottled drinking water."],
  ],
};

export const menuItems: MenuItem[] = menuCategories.flatMap((c) =>
  (rawMenu[c.slug] ?? []).map(([name, description]) => {
    const id = slugify(name);
    return { id, name, description, category: c.slug, price: PRICES[id] ?? null, veg: true as const };
  }),
);

export const menuItemById = new Map(menuItems.map((m) => [m.id, m]));

/** Cards shown on the Restaurant section. `menuSlug` links into the menu page. */
export const restaurantCards = [
  { name: "North Indian", menuSlug: "main-course", text: "Sabzis, curries and everyday favourites." },
  { name: "Paneer Specials", menuSlug: "paneer-specials", text: "Butter masala, kadai, shahi and more." },
  { name: "Chinese", menuSlug: "chinese", text: "Noodles, rice and Indo-Chinese starters." },
  { name: "South Indian", menuSlug: "south-indian", text: "Dosa, idli, vada and uttapam." },
  { name: "Snacks", menuSlug: "snacks", text: "Samosa, pakora, pav bhaji and more." },
  { name: "Beverages", menuSlug: "beverages", text: "Chai, lassi, cold coffee and coolers." },
] as const;
