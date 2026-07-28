import { Metadata } from "next";
import ShopClient from "./ShopClient";

// 🚀 CORE MARKETPLACE LANDING METADATA
export const metadata: Metadata = {
  title: "Shop Premium Apparel & Modern Tailoring | Atlascub",
  description: "Browse the complete Atlascub store catalog. Discover our curated collections of premium linen shirts, relaxed oversized fits, and contemporary Indian luxury drapes for men, women, and kids.",
  keywords: [
    "buy premium clothes online",
    "luxury linen shirts India",
    "modern Indian tailoring",
    "minimalist fashion brand",
    "oversized fits",
    "Atlascub catalog"
  ],
  openGraph: {
    title: "Shop Premium Apparel & Modern Tailoring | Atlascub",
    description: "Browse the complete Atlascub store catalog. Discover curated collections of luxury linen shirts, relaxed oversized fits, and contemporary Indian tailoring.",
    url: "https://www.atlascub.in/shop",
    type: "website",
  },
};

export default function ShopIndexPage() {
  return <ShopClient />;
}