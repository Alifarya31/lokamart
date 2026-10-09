// TEMPORARY mock data for /preview/seller. Deleted together with src/app/preview.
// Shaped like Firestore products/{productId}: prices and stock are plain numbers.

// Simple generated thumbnails so the preview needs no image files or external URLs.
const thumb = (background, shape) =>
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" fill="${background}"/>${shape}</svg>`
  );

const SHAPES = {
  "Home & Living": thumb("#e7efe9", '<rect x="30" y="38" width="40" height="42" rx="6" fill="#0f766e"/><circle cx="50" cy="28" r="10" fill="#115e59"/>'),
  Workspace: thumb("#e8edf3", '<rect x="22" y="30" width="56" height="36" rx="4" fill="#334155"/><rect x="40" y="70" width="20" height="6" fill="#64748b"/>'),
  Apparel: thumb("#f3ede4", '<path d="M30 30 L42 22 H58 L70 30 L64 42 H58 V80 H42 V42 H36 Z" fill="#a16207"/>'),
  Tableware: thumb("#f1ece7", '<ellipse cx="50" cy="60" rx="30" ry="12" fill="#c2410c"/><rect x="38" y="30" width="24" height="28" rx="10" fill="#ea580c"/>'),
  Objects: thumb("#ece9f2", '<circle cx="50" cy="52" r="24" fill="#6d28d9"/><circle cx="58" cy="44" r="6" fill="#ddd6fe"/>'),
  Textiles: thumb("#e9f1f1", '<rect x="24" y="26" width="52" height="48" rx="4" fill="#0e7490"/><path d="M24 40 H76 M24 54 H76 M24 68 H76" stroke="#a5f3fc" stroke-width="3"/>'),
};

const RAW = [
  ["Matte Stoneware Dripper", "Tableware", 185000, 42],
  ["Cast Brass Sculptural Lamp", "Home & Living", 1250000, 8],
  ["Organic Linen Overshirt", "Apparel", 465000, 3],
  ["Walnut Monitor Riser", "Workspace", 720000, 53],
  ["Hand-thrown Ceramic Vase", "Objects", 340000, 19],
  ["Waffle Cotton Bath Towel", "Textiles", 129000, 26],
  ["Speckled Dinner Plate Set", "Tableware", 395000, 14],
  ["Rattan Pendant Shade", "Home & Living", 610000, 0],
  ["Merino Crewneck Sweater", "Apparel", 890000, 11],
  ["Felt Desk Mat Large", "Workspace", 215000, 37],
  ["Travertine Bookends Pair", "Objects", 545000, 6],
  ["Stonewashed Linen Duvet", "Textiles", 1450000, 9],
  ["Glazed Espresso Cup Duo", "Tableware", 98000, 64],
  ["Oak Wall Shelf Floating", "Home & Living", 475000, 22],
  ["Selvedge Denim Jacket", "Apparel", 1150000, 17],
  ["Aluminium Laptop Stand", "Workspace", 389000, 2],
  ["Beeswax Pillar Candle", "Objects", 85000, 120],
  ["Indigo Throw Blanket", "Textiles", 675000, 15],
  ["Porcelain Serving Bowl", "Tableware", 265000, 10],
  ["Woven Jute Floor Basket", "Home & Living", 299000, 31],
  ["Canvas Utility Apron", "Apparel", 245000, 48],
  ["Leather Cable Organiser", "Workspace", 155000, 75],
  ["Marble Incense Holder", "Objects", 125000, 4],
  ["Gauze Cotton Table Runner", "Textiles", 189000, 28],
];

// A few products without an image show the default product image.
const NO_IMAGE = new Set(["Rattan Pendant Shade", "Travertine Bookends Pair", "Canvas Utility Apron"]);

export const MOCK_SELLER_ID = "preview-seller";

export const MOCK_PRODUCTS = RAW.map(([name, category, price, stock], index) => ({
  id: `mock-${index + 1}`,
  sellerId: MOCK_SELLER_ID,
  name,
  category,
  price,
  stock,
  description: `${name}, made in small batches by independent makers.`,
  imageUrl: NO_IMAGE.has(name) ? "" : SHAPES[category],
  // Newest first, one day apart.
  createdAt: new Date(Date.UTC(2026, 9, 9) - index * 86_400_000).toISOString(),
}));
