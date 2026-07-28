export interface Collection {
  slug: string;
  name: string;
  description: string;
  heroImage: string;
  type: "festival" | "campaign" | "season" | "sale";
  badge?: string;
}

export const collections: Collection[] = [
  {
    slug: "modern-festive",
    name: "Modern Festive 2026",
    description:
      "An elegant blend of traditional patterns and contemporary drapes.",
    heroImage: "/images/collections/modern-festive.jpg",
    type: "festival",
    badge: "New",
  },
  {
    slug: "pastel-dreams",
    name: "Pastel Dreams",
    description:
      "Quiet, understated pastel hues tailored in light cottons and linen blends.",
    heroImage: "/images/collections/pastel-dreams.jpg",
    type: "campaign",
  },
  {
    slug: "summer-26",
    name: "Summer Solstice",
    description: "Breathable, airy resort-wear for warm-weather adventures.",
    heroImage: "/images/collections/summer-solstice.jpg",
    type: "season",
    badge: "Seasonal",
  },
  {
    slug: "sale",
    name: "Archive Sale",
    description: "Curated collections with limited-time archival pricing.",
    heroImage: "/images/collections/archive-sale.jpg",
    type: "sale",
    badge: "Up to 40%",
  },
];

export const getCollectionBySlug = (slug: string): Collection | undefined => {
  return collections.find((collection) => collection.slug === slug);
};
