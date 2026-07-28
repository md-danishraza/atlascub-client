"use client";

import { cn } from "@/lib/utils";
import { InfiniteSlider } from "@/components/infinite-slider"; // Ensure you have this component installed
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";

type Testimonial = {
  quote: string;
  image: string;
  name: string;
  role: string;
  company?: string;
};

// 9 Premium Fashion Testimonials for Atlascub
const testimonials: Testimonial[] = [
  {
    quote:
      "The Modern Festive collection completely changed my perspective on ethnic wear. The raw silk fits like a bespoke suit, but with a breathable feel.",
    image: "https://i.pravatar.cc/150?u=arjun",
    name: "Arjun Mehta",
    role: "Verified Buyer",
    company: "Mumbai",
  },
  {
    quote:
      "I have been searching for high-quality, understated linens for everyday wear. The drape on their pastel summer shirts is simply incredible.",
    image: "https://i.pravatar.cc/150?u=priya",
    name: "Priya Sharma",
    role: "Verified Buyer",
    company: "Delhi",
  },
  {
    quote:
      "What stands out about Atlascub is the attention to detail. It feels good to wear something crafted with such deep intention and respect for artisans.",
    image: "https://i.pravatar.cc/150?u=karan",
    name: "Karan Desai",
    role: "Verified Buyer",
    company: "Bangalore",
  },
  {
    quote:
      "The tailoring is immaculate. It is incredibly rare to find ready-to-wear garments that require zero alterations straight out of the box.",
    image: "https://i.pravatar.cc/150?u=aisha",
    name: "Aisha Khan",
    role: "Verified Buyer",
    company: "Hyderabad",
  },
  {
    quote:
      "Their oversized streetwear core pieces hold their shape beautifully even after multiple washes. The fabric weight is exactly what luxury should feel like.",
    image: "https://i.pravatar.cc/150?u=dev",
    name: "Dev Patel",
    role: "Verified Buyer",
    company: "Pune",
  },
  {
    quote:
      "From the plastic-free packaging to the zero-waste pattern cutting, you can tell this brand actually cares about the future of fashion.",
    image: "https://i.pravatar.cc/150?u=sneha",
    name: "Sneha Reddy",
    role: "Verified Buyer",
    company: "Chennai",
  },
  {
    quote:
      "I wore the curated sequined drape for a wedding reception and the compliments didn't stop. It strikes the perfect balance of traditional and modern.",
    image: "https://i.pravatar.cc/150?u=riya",
    name: "Riya Kapoor",
    role: "Verified Buyer",
    company: "Kolkata",
  },
  {
    quote:
      "Finally, an Indian brand that understands quiet luxury. The muted tones and structured silhouettes make building a capsule wardrobe effortless.",
    image: "https://i.pravatar.cc/150?u=vikram",
    name: "Vikram Singh",
    role: "Verified Buyer",
    company: "Chandigarh",
  },
  {
    quote:
      "The kids' festive collection is a lifesaver. My daughter was comfortable all evening, and the fabrics were cloud-soft against her skin.",
    image: "https://i.pravatar.cc/150?u=meera",
    name: "Meera Joshi",
    role: "Verified Buyer",
    company: "Ahmedabad",
  },
];

const firstColumn = testimonials.slice(0, 3);
const secondColumn = testimonials.slice(3, 6);
const thirdColumn = testimonials.slice(6, 9);

export function TestimonialsSection() {
  return (
    <section className="relative w-full overflow-hidden bg-background/30 py-20 md:py-32">
      <div className="container mx-auto px-4 md:px-6">
        {/* Section Header */}
        <div className="mx-auto flex max-w-2xl flex-col items-center justify-center gap-4 text-center">
          <span className="block text-sm tracking-[0.2em] uppercase font-secondary text-primary/80">
            Community Voices
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-primary font-bold tracking-tight text-foreground">
            Words from the Wardrobe
          </h2>
          <p className="text-muted-foreground font-body text-base md:text-lg max-w-md">
            Discover what our community has to say about their Atlascub experience, from everyday linens to modern festive wear.
          </p>
        </div>

        {/* Sliders Container */}
        <div
          className={cn(
            "mt-16 flex max-h-[600px] justify-center gap-6 overflow-hidden",
            "mask-[linear-gradient(to_bottom,transparent,black_20%,black_80%,transparent)]"
          )}
        >
          {/* Column 1 (Visible on all sizes) */}
          <InfiniteSlider direction="vertical" speed={30} speedOnHover={15}>
            {firstColumn.map((testimonial) => (
              <TestimonialsCard
                key={testimonial.name}
                testimonial={testimonial}
              />
            ))}
          </InfiniteSlider>

          {/* Column 2 (Hidden on mobile) */}
          <InfiniteSlider
            className="hidden md:block"
            direction="vertical"
            speed={50}
            speedOnHover={25}
          >
            {secondColumn.map((testimonial) => (
              <TestimonialsCard
                key={testimonial.name}
                testimonial={testimonial}
              />
            ))}
          </InfiniteSlider>

          {/* Column 3 (Hidden on mobile & tablet) */}
          <InfiniteSlider
            className="hidden lg:block"
            direction="vertical"
            speed={35}
            speedOnHover={17}
          >
            {thirdColumn.map((testimonial) => (
              <TestimonialsCard
                key={testimonial.name}
                testimonial={testimonial}
              />
            ))}
          </InfiniteSlider>
        </div>
      </div>
    </section>
  );
}

function TestimonialsCard({
  testimonial,
  className,
  ...props
}: React.ComponentProps<"figure"> & {
  testimonial: Testimonial;
}) {
  const { quote, image, name, role, company } = testimonial;
  return (
    <figure
      className={cn(
        "w-full max-w-[320px] rounded-2xl border border-border bg-card p-6 md:p-8 shadow-sm transition-all hover:shadow-md dark:bg-card/40 backdrop-blur-sm",
        className
      )}
      {...props}
    >
      <blockquote className="font-primary text-foreground/90 text-sm md:text-base leading-relaxed">
        &ldquo;{quote}&rdquo;
      </blockquote>
      <figcaption className="mt-6 flex items-center gap-3 border-t border-border/50 pt-4">
        <Avatar className="size-10 rounded-full border border-border">
          <AvatarImage alt={`${name}'s profile picture`} src={image} />
          <AvatarFallback className="font-secondary text-xs uppercase bg-primary/10 text-primary">
            {name.charAt(0)}
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <cite className="font-body font-medium not-italic text-sm text-foreground">
            {name}
          </cite>
          <span className="text-muted-foreground font-body text-xs mt-0.5">
            {role} {company && <span className="opacity-75">• {company}</span>}
          </span>
        </div>
      </figcaption>
    </figure>
  );
}