import { Metadata } from "next";
import { ContactHero } from "@/components/contact/contact-hero";
import { QuickSupportGrid } from "@/components/contact/quick-support-grid";
import { ContactForm } from "@/components/contact/contact-form";
import { ContactInfo } from "@/components/contact/contact-info";

import { MapSection } from "@/components/contact/map-section";
import { SlugBreadcrumb } from "@/components/shared/slug-breadcrumb";
import { FAQAccordion } from "@/components/contact/faq-accordion";

export const metadata: Metadata = {
  title: "Contact | Client Services",
  description: "Get in touch with Atlascub's client services team. We're here to help with orders, sizing, returns, and styling advice.",
  openGraph: {
    title: "Contact Atlascub | Client Services",
    description: "Get in touch with our team for orders, sizing, and styling advice.",
    images: ["/images/contact/og-contact.jpg"],
  },
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 pt-6">
        <SlugBreadcrumb />
      </div>
      <ContactHero />
      <QuickSupportGrid />
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          <ContactForm />
          <ContactInfo />
        </div>
      </div>
      <div className="container mx-auto px-4 pb-12 md:pb-16">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          <FAQAccordion />
          <MapSection />
        </div>
      </div>
    </div>
  );
}