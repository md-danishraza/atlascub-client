"use client";

import React, { useRef, useEffect } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Sparkles } from "lucide-react";

// ✅ Register GSAP plugins (only once)
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const showcaseImages = [
  {
    id: 1,
    src: "https://i.pinimg.com/736x/1d/70/61/1d7061329782764e32e4b32ab321f8c3.jpg",
    alt: "Bespoke Sherwani - Men's Wedding Collection",
    className: "top-[50%] left-[50%] w-[85vw] md:w-[32vw] aspect-[2/3]",
    z: 0,
    priority: true,
  },
  {
    id: 2,
    src: "https://i.pinimg.com/736x/ee/ae/dc/eeaedcf7cf080cdfc54ac283c35ae2ad.jpg",
    alt: "Rich Embroidered Lehenga - Festive Edit",
    className: "top-[25%] left-[15%] w-[60vw] md:w-[22vw] aspect-[2/3]",
    z: -800,
    priority: true,
  },
  {
    id: 3,
    src: "https://i.pinimg.com/1200x/03/a7/65/03a765279fc7253df63c31e46b8f44d3.jpg",
    alt: "Contemporary Silk Drape - Modern Festive",
    className: "top-[75%] left-[78%] w-[55vw] md:w-[24vw] aspect-[3/2]",
    z: -1600,
    priority: true,
  },
  {
    id: 4,
    src: "https://i.pinimg.com/1200x/8c/9e/53/8c9e5337b185ec1b98ad979938be6b2b.jpg",
    alt: "Mustard Fusion Kurta - Everyday Ethnic",
    className: "top-[15%] left-[82%] w-[60vw] md:w-[22vw] aspect-[2/3]",
    z: -2400,
  },
  {
    id: 5,
    src: "https://i.pinimg.com/736x/ab/6b/5b/ab6b5b24036222cc12ca0ae26fc35890.jpg",
    alt: "Linen Short Kurta - Men's Casuals",
    className: "top-[82%] left-[18%] w-[55vw] md:w-[20vw] aspect-[2/3]",
    z: -3200,
  },
  {
    id: 6,
    src: "https://i.pinimg.com/736x/f4/48/62/f448624fcfc283e2a1c0045fb52f377d.jpg",
    alt: "Handwoven Saree - Heritage Collection",
    className: "top-[50%] left-[50%] w-[80vw] md:w-[28vw] aspect-[2/3]",
    z: -4000,
  },
  {
    id: 7,
    src: "https://i.pinimg.com/1200x/4b/54/9e/4b549e5b8c1478150ab6010af6b8a889.jpg",
    alt: "Textured Nehru Jacket - Festive Layers",
    className: "top-[30%] left-[88%] w-[50vw] md:w-[24vw] aspect-[3/2]",
    z: -4800,
  },
  {
    id: 8,
    src: "https://i.pinimg.com/736x/55/eb/c0/55ebc0eb5218c80ba05f0d035b915ea0.jpg",
    alt: "Intricate Hand Embroidery Details",
    className: "top-[68%] left-[8%] w-[55vw] md:w-[20vw] aspect-[2/3]",
    z: -5600,
  },
  {
    id: 9,
    src: "https://i.pinimg.com/736x/f9/64/17/f96417d05914ffcacd7e8aeca71b8258.jpg",
    alt: "Bridal Reds and Golds - Atlascub Couture",
    className: "top-[18%] left-[48%] w-[45vw] md:w-[18vw] aspect-[2/3]",
    z: -6400,
  },
  {
    id: 10,
    src: "https://i.pinimg.com/736x/ca/7d/36/ca7d36aea08c130c34a2e41334f201c1.jpg",
    alt: "Flowing Lehenga Twirl - Grand Finale",
    className: "top-[85%] left-[55%] w-[65vw] md:w-[26vw] aspect-[2/3]",
    z: -7200,
  },
];

export function CinematicShowcase() {
  const containerRef = useRef<HTMLDivElement>(null);
  const galleryRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || !galleryRef.current || !viewportRef.current) return;

    // ✅ Ensure all elements are ready
    const container = containerRef.current;
    const gallery = galleryRef.current;
    const viewport = viewportRef.current;

    // ✅ Set perspective based on screen width
    const isMobile = window.innerWidth < 768;
    viewport.style.perspective = isMobile ? "450px" : "1100px";

    // ✅ Create a GSAP context for proper cleanup
    const ctx = gsap.context(() => {
      // ✅ Main gallery animation
      gsap.to(gallery, {
        z: 7650,
        ease: "none",
        scrollTrigger: {
          trigger: container,
          start: "top top",
          end: "bottom bottom",
          scrub: isMobile ? true : 0.5,
          invalidateOnRefresh: true,
        },
      });

      // ✅ Text fade animation
      gsap.to(".showcase-text", {
        opacity: 0,
        scale: isMobile ? 1.05 : 1.15,
        y: isMobile ? -20 : -40,
        ease: isMobile ? "none" : "power1.out",
        scrollTrigger: {
          trigger: container,
          start: "top top",
          end: isMobile ? "+=600" : "+=1200",
          scrub: true,
        },
      });

      // ✅ Desktop only: ambient floating cards
      if (!isMobile) {
        gsap.to(".showcase-card", {
          y: "-=15",
          x: "+=6",
          rotationZ: "0.5",
          duration: 4,
          yoyo: true,
          repeat: -1,
          ease: "sine.inOut",
          stagger: {
            amount: 1.5,
            from: "center",
          },
        });
      }

      // ✅ Force refresh to ensure ScrollTrigger calculates correctly
      ScrollTrigger.refresh();
    }, container);

    // ✅ Handle resize to refresh ScrollTrigger
    const handleResize = () => {
      ScrollTrigger.refresh();
    };

    window.addEventListener("resize", handleResize);

    return () => {
      ctx.revert(); // ✅ Clean up GSAP animations
      window.removeEventListener("resize", handleResize);
      ScrollTrigger.getAll().forEach((st) => st.kill()); // ✅ Kill all ScrollTriggers
    };
  }, []);

  // Structured Data (JSON-LD)
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "Atlascub Bespoke Collection",
    "description": "Explore our premium heritage crafts, tailored silhouettes, and luxury Indian textile designs.",
    "about": {
      "@type": "Brand",
      "name": "Atlascub",
      "description": "Premium modern clothing and drapes"
    },
    "image": showcaseImages.map((img) => img.src),
  };

  return (
    <>
      {/* ✅ SEO: JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <section
        ref={containerRef}
        className="relative h-[550vh] md:h-[400vh] bg-background/30 text-foreground"
        aria-label="Atlascub Bespoke Collection Showcase"
      >
        {/* ✅ SEO: Accessible hidden content for screen readers & crawlers */}
        <div className="sr-only">
          <h2>The Atlascub Archive — Bespoke Mastery Exhibit</h2>
          <p>
            Explore our premium heritage crafts, tailored silhouettes, and luxury Indian textile
            designs. Featuring bespoke sherwanis, embroidered lehengas, silk drapes, fusion kurtas,
            handwoven sarees, nehru jackets, and intricate hand embroidery.
          </p>
          <ul>
            {showcaseImages.map((img) => (
              <li key={img.id}>{img.alt}</li>
            ))}
          </ul>
        </div>

        {/* Dynamic Viewport Container */}
        <div
          ref={viewportRef}
          className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center transition-colors duration-300"
        >
          {/* Central Brand Title */}
          <div className="showcase-text absolute z-20 flex flex-col items-center pointer-events-none select-none px-4">
            <div className="flex items-center justify-center gap-2 mb-3 text-primary/80">
              <Sparkles className="h-4 w-4" aria-hidden="true" />
              <span className="text-xs font-secondary uppercase tracking-[0.35em] font-semibold text-center text-muted-foreground">
                The Atlascub Archive
              </span>
            </div>
            <h2 className="font-primary text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight text-center leading-[1.1] text-foreground">
              Bespoke <br className="hidden sm:block" /> Mastery.
            </h2>
            <p className="sr-only">
              Discover our collection of bespoke Indian fashion, featuring handcrafted garments for
              every occasion.
            </p>
          </div>

          {/* 3D Gallery Deck */}
          <div
            ref={galleryRef}
            className="absolute inset-0 w-full h-full transform-gpu"
            style={{ transformStyle: "preserve-3d" }}
            aria-hidden="true"
          >
            {showcaseImages.map((img) => (
              <div
                key={img.id}
                className={`showcase-card absolute shadow-[0_20px_40px_-10px_rgba(0,0,0,0.15)] dark:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] border border-neutral-200/20 dark:border-neutral-800/30 rounded-xl overflow-hidden bg-muted will-change-transform ${img.className}`}
                style={{
                  transform: `translate(-50%, -50%) translateZ(${img.z}px)`,
                  backfaceVisibility: "hidden",
                }}
              >
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  priority={img.priority}
                  sizes="(max-width: 768px) 85vw, 30vw"
                  className="object-cover object-center transform scale-[1.02]"
                />
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}