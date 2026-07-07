import { HeroSection } from "@/components/home/hero-section";
import { GenderGrid } from "@/components/home/gender-grid";
import { FeaturedCollection } from "@/components/home/featured-section";

import { CategoryShowcase } from "@/components/home/category-showcase";
import { BrandValues } from "@/components/home/brand-values";
import { DiscoverMore } from "@/components/home/discover-section";
import { NewsletterSignup } from "@/components/home/newsletter-signup";
import { FloatingBlobs } from "@/components/home/floating-blob";
import { TestimonialsSection } from "@/components/home/testimonials";
import { FeatureSection } from "@/components/home/feature-section";
import { FaqsSection } from "@/components/home/faq-section";
import { InstagramFeedLive } from "@/components/home/ig-feed";
import { CinematicShowcase } from "@/components/home/cinematic-showcase-images";
import { Metadata } from "next";


// 🚀 HOMEPAGE SPECIALIZED METADATA
export const metadata: Metadata = {
  title: "Atlascub | Premium Modern Clothing & Luxury Drapes",
  description: "Discover curated luxury apparel at Atlascub. Elevate your everyday wardrobe with our signature premium linen shirts, oversized silhouettes, and minimalist modern Indian tailoring.",
  openGraph: {
    title: "Atlascub | Premium Modern Clothing & Luxury Drapes",
    description: "Discover curated luxury apparel at Atlascub. Elevate your everyday wardrobe with premium linen shirts, oversized silhouettes, and minimalist modern Indian tailoring.",
    url: "https://www.atlascub.in",
    type: "website",
  },
};

export default function HomePage() {
  return (
    <main>
      <FloatingBlobs />
       {/* 1. Hero Section with Scroll Parallax */}
       <HeroSection />
       {/* 6. Category Silhouette Showcase */}
       <CategoryShowcase />
       
        {/* 5. discover products */}
        <DiscoverMore/>
          {/* 3. Featured Collections */}
          <GenderGrid />
        {/* 2. Brand Sourcing Values */}
        <BrandValues />
      
        {/* best work */}
        <CinematicShowcase/>
        
        <FeaturedCollection/>
        {/* 4. Gender/Department Split Grid */}
        <FeatureSection/>
        {/* 7. Dynamic Newsletter Signup */}
        <NewsletterSignup />
        {/*  */}
        <TestimonialsSection/>
        {/* 8. Instagram Community Grid */}
        {/* <InstagramFeed />  */}
        <InstagramFeedLive/>
        <FaqsSection/>
    </main>
  );
}