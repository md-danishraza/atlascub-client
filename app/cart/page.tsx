import { Metadata } from "next";
import CartClient from "./CartClient";


// 🚀 SECURE SERVER-SIDE METADATA
export const metadata: Metadata = {
  title: "Your Shopping Cart | Atlascub",
  description: "Review your curated selections, premium linen shirts, and custom luxury drapes in your Atlascub shopping cart before moving to secure checkout.",
  robots: {
    index: false, // Prevents bots from crawling transient user sessions
    follow: true,
  },
  openGraph: {
    title: "Your Shopping Cart | Atlascub",
    description: "Review your selected premium garments and modern Indian tailoring before purchasing.",
    url: "https://www.atlascub.in/cart",
    type: "website",
  },
};

export default function CartPage() {
  return <CartClient />;
}