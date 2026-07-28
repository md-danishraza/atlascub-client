import { Metadata } from "next";
import CheckoutClient from "./CheckoutClient";


// 🚀 SECURE SERVER-SIDE METADATA
export const metadata: Metadata = {
  title: "Secure Checkout | Atlascub",
  description: "Complete your premium apparel order safely. Enter your shipping details and settle payments via our completely secure Razorpay processing engine.",
  robots: {
    index: false, // Critically prevents payment screens from leaking into organic search engines
    follow: true,
  },
  openGraph: {
    title: "Secure Checkout | Atlascub",
    description: "Finalize your order safely using our verified transactional payment networks.",
    url: "https://www.atlascub.in/checkout",
    type: "website",
  },
};

export default function CheckoutPage() {
  return <CheckoutClient />;
}