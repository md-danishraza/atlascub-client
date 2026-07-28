import { Metadata } from "next";
import ShippingPolicyClient from "./ShippingClient";

// 🚀 Production-Ready Shipping SEO Metadata
export const metadata: Metadata = {
  title: "Shipping & Delivery Timelines | Atlascub",
  description: "Find complete details on Atlascub's domestic shipping matrices, tracking processes, and localized delivery timelines across India.",
  openGraph: {
    title: "Shipping & Delivery Timelines | Atlascub",
    description: "Get transparent insights on standard courier timelines, order fulfillment frames, and transit schedules.",
    url: "https://www.atlascub.in/shipping-policy",
    type: "website",
  },
};

export default function ShippingPolicyPage() {
  return <ShippingPolicyClient />;
}