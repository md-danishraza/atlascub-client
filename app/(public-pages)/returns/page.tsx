import { Metadata } from "next";
import ReturnsClient from "./ReturnsClient";

// 🚀 Server-Side SEO Layer
export const metadata: Metadata = {
  title: "Returns & Exchanges | Atlascub",
  description: "Review our 7-day return policy for premium tailored garments.",
};

export default function ReturnsPage() {
  // Pass any server-fetched data down as standard props if needed
  return <ReturnsClient />;
}