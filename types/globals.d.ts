declare global {
  interface CustomJwtSessionClaims {
    public_metadata: {
      role?: string;
    };
  }
}

declare global {
  interface Window {
    Clerk?: {
      session?: {
        getToken: () => Promise<string | null>;
      };
    };
  }
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  compareAtPrice?: number; // Original price for sale items
  images: string[];
  sizes: string[];
  colors: ColorOption[];
  category: string;
  gender: string;
  tags: string[];
  rating: number;
  reviewCount: number;
  isNew: boolean;
  isBestSeller: boolean;
  inStock: boolean;
  createdAt: Date;
}

export interface ColorOption {
  name: string;
  value: string; // Hex code or Tailwind color class
  image?: string;
}

export interface FilterState {
  sizes: string[];
  colors: string[];
  priceRange: [number, number];
  inStockOnly: boolean;
  sortBy: "newest" | "price_asc" | "price_desc" | "popularity";
}

export interface ProductCardProps {
  product: Product;
  priority?: boolean;
}
