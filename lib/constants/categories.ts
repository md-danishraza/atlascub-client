import { categories as navCategories } from "./navigation";

// Export the existing categories from navigation
export const categories = navCategories;

// Gender display names and metadata
export const genderMetadata = {
  men: {
    title: "Men's Collection",
    description: "Quiet Confidence. Timeless Essentials.",
    heroImage: "/images/gender/men-hero.jpg",
    gradient: "from-blue-900/40",
  },
  women: {
    title: "Women's Collection",
    description: "Effortless Silhouettes. Modern Tailoring.",
    heroImage: "/images/gender/women-hero.jpg",
    gradient: "from-rose-900/40",
  },
  kids: {
    title: "Kids' Collection",
    description: "Soft Cottons. Easy Playwear.",
    heroImage: "/images/gender/kids-hero.jpg",
    gradient: "from-emerald-900/40",
  },
};

// Category display names and metadata
export const categoryMetadata: Record<
  string,
  { title: string; description: string }
> = {
  // Men categories
  ethnic: {
    title: "Ethnic & Festive",
    description: "Premium Kurtas, Nehru Jackets & Sherwanis",
  },
  tops: {
    title: "Tops & Linens",
    description: "Oversized Tees, structural Shirts & French linen",
  },
  outerwear: {
    title: "Outerwear & Shackets",
    description: "Modern jackets & tailored utility overshirts",
  },
  bottoms: {
    title: "Bottoms & Trousers",
    description: "Pleated trousers, linen shorts & relaxed fits",
  },
  accessories: {
    title: "Accessories",
    description: "Minimalist caps, canvas bags & leather belts",
  },

  // Women categories
  "ethnic-fusion": {
    title: "Ethnic & Fusion Sets",
    description: "Designer Kurtas, Anarkalis & Sarees",
  },
  "tops-blouses": {
    title: "Tops & Blouses",
    description: "Minimalist shirts, drapes & knitted vests",
  },
  "outerwear-capes": {
    title: "Outerwear & Capes",
    description: "Flowing outerwear & contemporary blazers",
  },
  "bottoms-palazzos": {
    title: "Bottoms & Palazzos",
    description: "Wide-leg trousers & draped skirts",
  },

  // Kids categories
  "kids-ethnic": {
    title: "Festive & Ethnic Sets",
    description: "Organic cotton Kurta sets & Lehengas",
  },
  "kids-tops": {
    title: "Tops & Shirts",
    description: "Playful graphic Tees & linen shirts",
  },
  "kids-bottoms": {
    title: "Bottoms",
    description: "Easy pull-on pants & breathable shorts",
  },
  "kids-accessories": {
    title: "Outerwear & Accessories",
    description: "Sweatshirts, rain jackets & caps",
  },

  // Collections
  "modern-festive": {
    title: "Modern Festive 2026",
    description: "Traditional patterns with contemporary drapes",
  },
  "pastel-dreams": {
    title: "Pastel Dreams",
    description: "Quiet, understated pastel hues",
  },
  "summer-26": {
    title: "Summer Solstice",
    description: "Breathable resort-wear",
  },
  sale: { title: "Archive Sale", description: "Limited-time archival pricing" },
};

// Helper to get category title
export const getCategoryTitle = (slug: string): string => {
  return (
    categoryMetadata[slug]?.title ||
    slug.charAt(0).toUpperCase() + slug.slice(1)
  );
};

// Helper to get category description
export const getCategoryDescription = (slug: string): string => {
  return (
    categoryMetadata[slug]?.description || "Explore our curated collection"
  );
};
