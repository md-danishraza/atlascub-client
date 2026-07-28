import { Metadata } from "next";
import { AboutHero } from "@/components/about/about-hero";
import { StorySection } from "@/components/about/story-section";
import { ValuesSection } from "@/components/about/values-section";
import { JourneyTimeline } from "@/components/about/journey-timeline";
import { TeamSection } from "@/components/about/team-section";
import { CTASection } from "@/components/about/cta-section";
import { SlugBreadcrumb } from "@/components/shared/slug-breadcrumb";

export const metadata: Metadata = {
  title: "About Us",
  description: "Discover the story behind Atlascub — where heritage meets contemporary design. Learn about our commitment to craftsmanship, sustainability, and timeless style.",
  openGraph: {
    title: "About Atlascub | Our Story",
    description: "Discover the story behind Atlascub — where heritage meets contemporary design.",
    images: ["/images/about/og-about.jpg"],
  },
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background/30">
      <div className="container mx-auto px-4 pt-6">
        <SlugBreadcrumb />
      </div>
      <AboutHero />
      <StorySection />
      <ValuesSection />
      <JourneyTimeline />
      {/* <TeamSection /> */}
      <CTASection />
    </div>
  );
}