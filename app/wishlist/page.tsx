import { Metadata } from "next";
import WishlistClient from "./WishlistClient";


// 🚀 SERVER-SIDE METADATA CONFIGURATION
export const metadata: Metadata = {
  title: "Your Wishlist | Atlascub",
  description: "View and manage your favorite curated premium apparel at Atlascub. Seamlessly transfer your custom drapes and modern silhouettes to your cart.",
  robots: {
    index: false, // Prevents search engines from indexing private user wishlist pages
    follow: true,
  },
  openGraph: {
    title: "Your Wishlist | Atlascub",
    description: "Save and curate your favorite premium garments and modern Indian tailoring.",
    url: "https://www.atlascub.in/wishlist",
    type: "website",
  },
};

export default function WishlistPage() {
  return <WishlistClient/>;
}