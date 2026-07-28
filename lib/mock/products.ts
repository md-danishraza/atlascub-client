import { Product } from "@/types/product";
import { ProductFilters } from "../store/apis/product-api";

// Helper to generate consistent IDs
const generateId = (prefix: string, index: number) =>
  `${prefix}-${String(index).padStart(3, "0")}`;

// Mock images (using placeholders - replace with actual image URLs)
const imagePlaceholders = {
  men: {
    tops: [
      "/images/products/men/tops/oversized-tee-1.jpg",
      "/images/products/men/tops/oversized-tee-2.jpg",
      "/images/products/men/tops/linen-shirt-1.jpg",
      "/images/products/men/tops/linen-shirt-2.jpg",
    ],
    bottoms: [
      "/images/products/men/bottoms/pleated-trousers-1.jpg",
      "/images/products/men/bottoms/linen-shorts-1.jpg",
    ],
    outerwear: [
      "/images/products/men/outerwear/overshirt-1.jpg",
      "/images/products/men/outerwear/jacket-1.jpg",
    ],
    ethnic: [
      "/images/products/men/ethnic/kurta-1.jpg",
      "/images/products/men/ethnic/bandhgala-1.jpg",
    ],
    accessories: [
      "/images/products/men/accessories/cap-1.jpg",
      "/images/products/men/accessories/bag-1.jpg",
    ],
  },
  women: {
    tops: [
      "/images/products/women/tops/blouse-1.jpg",
      "/images/products/women/tops/shirt-1.jpg",
    ],
    bottoms: [
      "/images/products/women/bottoms/trousers-1.jpg",
      "/images/products/women/bottoms/palazzo-1.jpg",
    ],
    ethnic: [
      "/images/products/women/ethnic/kurta-1.jpg",
      "/images/products/women/ethnic/saree-1.jpg",
    ],
    accessories: [
      "/images/products/women/accessories/bag-1.jpg",
      "/images/products/women/accessories/scarf-1.jpg",
    ],
  },
  kids: {
    tops: [
      "/images/products/kids/tops/tee-1.jpg",
      "/images/products/kids/tops/shirt-1.jpg",
    ],
    bottoms: [
      "/images/products/kids/bottoms/pants-1.jpg",
      "/images/products/kids/bottoms/shorts-1.jpg",
    ],
    ethnic: ["/images/products/kids/ethnic/kurta-1.jpg"],
    accessories: ["/images/products/kids/accessories/cap-1.jpg"],
  },
};
