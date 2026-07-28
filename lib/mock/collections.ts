export interface Collection {
  id: string;
  name: string;
  slug: string;
  description: string;
  heroImage: string;
  type: "festival" | "campaign" | "season" | "sale";
  badge?: string;
  productIds: string[];
}

export const mockCollections: Collection[] = [
  {
    id: "col-001",
    name: "Modern Festive 2026",
    slug: "modern-festive",
    description:
      "An elegant blend of traditional patterns and contemporary drapes. Crafted for celebrations that demand timeless sophistication.",
    heroImage: "/images/collections/modern-festive-hero.jpg",
    type: "festival",
    badge: "New",
    productIds: ["prod-006", "prod-007"],
  },
  {
    id: "col-002",
    name: "Pastel Dreams",
    slug: "pastel-dreams",
    description:
      "Quiet, understated pastel hues tailored in light cottons and linen blends. Soft tones for the dreamer in you.",
    heroImage: "/images/collections/pastel-dreams-hero.jpg",
    type: "campaign",
    productIds: ["prod-001", "prod-003", "prod-007"],
  },
  {
    id: "col-003",
    name: "Summer Solstice",
    slug: "summer-26",
    description:
      "Breathable, airy resort-wear for warm-weather adventures. Light fabrics that move with you.",
    heroImage: "/images/collections/summer-solstice-hero.jpg",
    type: "season",
    badge: "Seasonal",
    productIds: ["prod-001", "prod-003", "prod-004"],
  },
  {
    id: "col-004",
    name: "Archive Sale",
    slug: "sale",
    description:
      "Curated collections with limited-time archival pricing. Timeless pieces at exceptional value.",
    heroImage: "/images/collections/archive-sale-hero.jpg",
    type: "sale",
    badge: "Up to 40%",
    productIds: ["prod-002", "prod-005", "prod-009", "prod-010"],
  },
];

export const getCollectionBySlug = (slug: string) =>
  mockCollections.find((c) => c.slug === slug);
export const getCollectionsByType = (type: Collection["type"]) =>
  mockCollections.filter((c) => c.type === type);
