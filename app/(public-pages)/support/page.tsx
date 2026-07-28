import { Metadata } from "next";
import { SupportPageClient } from "./support-page-client";

export const metadata: Metadata = {
  title: "Support Center | Atlascub",
  description: "Get answers to your questions about orders, shipping, returns, and more. Our support team is here to help.",
};

export default function SupportPage() {
  return <SupportPageClient />;
}