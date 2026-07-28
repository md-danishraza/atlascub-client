export interface CTAButton {
  text: string;
  href: string;
}

export interface HeroSlide {
  id: number;
  overline: string;
  title: string;
  subtitle: string;
  image: string;
  mobileImage?: string;
  ctaPrimary: { text: string; href: string };
  ctaSecondary: { text: string; href: string };
}

export interface GenderPanel {
  id: string;
  title: string;
  description: string;
  image: string;
  href: string;
  gradientFrom: string;
}

export interface CuratedCampaign {
  id: number;
  title: string;
  description: string;
  image: string;
  href: string;
  accentOverlay: string;
}

export interface CategoryHighlight {
  id: string;
  title: string;
  description: string;
  image: string;
  href: string;
}

export interface InstagramPost {
  id: number;
  image: string;
  url: string;
}

export interface BrandValue {
  id: number;
  label: string;
  title: string;
  description: string;
  icon?: string; // Optional icon name for mapping
}

// --- CENTRAL EXPORTABLE DATA CONFIGURATION (DYNAMIC-READY) ---
export const heroSlides: HeroSlide[] = [
  {
    id: 1,
    overline: "The Festive Edit",
    title: "Midnight Sequins & Silk",
    subtitle:
      "Celebrate in contemporary sarees and rich hand-embroidered silhouettes crafted for the modern Indian woman.",
    image: "/images/hero/hero-women.jpg",
    ctaPrimary: { text: "Shop Womenswear", href: "/shop/women" },
    ctaSecondary: {
      text: "Explore Festive",
      href: "/collections/modern-festive",
    },
  },
  {
    id: 2,
    overline: "Summer Resort Wear",
    title: "The Artisan Print",
    subtitle:
      "Breathable linens and bold handcrafted prints designed for effortless street style and tropical getaways.",
    image: "/images/hero/hero-men.jpg",
    ctaPrimary: { text: "Shop Menswear", href: "/shop/men" },
    ctaSecondary: { text: "View Lookbook", href: "/collections/summer-26" },
  },
  {
    id: 3,
    overline: "Little Atlas Collection",
    title: "Joyful Traditions",
    subtitle:
      "Vibrant hues and cloud-soft ethnic wear to keep the little ones smiling and comfortable through every celebration.",
    image: "/images/hero/hero-kid.jpg",
    ctaPrimary: { text: "Shop Kids", href: "/shop/kids" },
    ctaSecondary: { text: "Discover Sets", href: "/shop/kids/ethnic" },
  },
  {
    id: 4,
    overline: "Core Essentials",
    title: "Warm Earth Tones",
    subtitle:
      "A curated wardrobe of rusts, ochres, and pure cottons. Build your foundation with our seasonless Indian staples.",
    image: "/images/hero/collections.jpg",
    ctaPrimary: { text: "Shop All", href: "/shop" },
    ctaSecondary: { text: "Explore Essentials", href: "/collections" },
  },
];

export const genderGrid: GenderPanel[] = [
  {
    id: "men",
    title: "MEN",
    description: "Quiet Confidence. Timeless Essentials & Tailored Kurtas.",
    image: "/images/gender/men.jpg",
    href: "/shop/men",
    gradientFrom: "from-amber-950/40",
  },
  {
    id: "women",
    title: "WOMEN",
    description: "Effortless Silhouettes. Organic Knits & Handspun Sarees.",
    image: "/images/gender/women2.jpg",
    href: "/shop/women",
    gradientFrom: "from-[#9b2c2c]/30",
  },
  {
    id: "kids",
    title: "KIDS",
    description: "Hypoallergenic Cottons. Cloud-Soft Daily Playwear.",
    image: "/images/gender/kids2.jpg",
    href: "/shop/kids",
    gradientFrom: "from-stone-900/30",
  },
];

export const curatedCampaigns: CuratedCampaign[] = [
  {
    id: 1,
    title: "Pastel Dreams",
    description: "Soft lavender mists, sage greens, and organic knitwear.",
    image: "/images/campaigns/pastel-dreams.jpg",
    href: "/collections/pastel-dreams",
    accentOverlay: "bg-[#fdf2d6]/15",
  },
  {
    id: 2,
    title: "Quiet Luxury",
    description: "Combed cotton tees and single-pleated tailored trousers.",
    image: "/images/campaigns/quiet-luxury.jpg",
    href: "/collections/quiet-luxury",
    accentOverlay: "bg-stone-500/10",
  },
  {
    id: 3,
    title: "Streetwear Core",
    description: "Heavyweight drop-shoulder hoodies and clean utility cargos.",
    image: "/images/campaigns/streetwear-core.jpg",
    href: "/collections/streetwear-core",
    accentOverlay: "bg-neutral-900/10",
  },
  {
    id: 4,
    title: "Heritage Weaves",
    description: "Rich handspun raw silk structures and traditional textures.",
    image: "/images/campaigns/heritage.jpg",
    href: "/collections/heritage",
    accentOverlay: "bg-[#9b2c2c]/10",
  },
];

export const silhouetteHighlights = {
  men: [
    {
      id: "m-ethnic",
      title: "Ethnic & Festive",
      description: "Premium Kurtas & Bandhgalas",
      image:
        "https://images.unsplash.com/photo-1760080839523-37570311861e?q=80&w=600&auto=format&fit=crop",
      href: "/shop/men/ethnic",
    },
    {
      id: "m-tops",
      title: "Tops & Linens",
      description: "Oversized Tees & Resort Shirts",
      image:
        "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?q=80&w=600&auto=format&fit=crop",
      href: "/shop/men/tops",
    },
    {
      id: "m-outerwear",
      title: "Outerwear & Shackets",
      description: "Tailored Utility & Blazers",
      image:
        "https://images.unsplash.com/photo-1592878904946-b3cd8ae243d0?q=80&w=600&auto=format&fit=crop",
      href: "/shop/men/outerwear",
    },
    {
      id: "m-bottoms",
      title: "Bottoms & Trousers",
      description: "Pleated Chinos & Drapes",
      image:
        "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?q=80&w=600&auto=format&fit=crop",
      href: "/shop/men/bottoms",
    },
  ],
  women: [
    {
      id: "w-ethnic",
      title: "Ethnic & Fusion",
      description: "Contemporary Sarees & Anarkalis",
      image:
        "https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=600&auto=format&fit=crop",
      href: "/shop/women/ethnic",
    },
    {
      id: "w-tops",
      title: "Tops & Blouses",
      description: "Minimalist Shirts & Knits",
      image:
        "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?q=80&w=600&auto=format&fit=crop",
      href: "/shop/women/tops",
    },
    {
      id: "w-outerwear",
      title: "Outerwear & Capes",
      description: "Flowing Capes & Blazers",
      image:
        "https://images.unsplash.com/photo-1637875891040-90677c6b3d37?q=80&w=600&auto=format&fit=crop",
      href: "/shop/women/outerwear",
    },
    {
      id: "w-bottoms",
      title: "Palazzos & Bottoms",
      description: "Wide-leg Trousers & Skirts",
      image:
        "https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=600&auto=format&fit=crop",
      href: "/shop/women/bottoms",
    },
  ],
  kids: [
    {
      id: "k-ethnic",
      title: "Festive & Ethnic",
      description: "Comfortable Kurta Sets",
      image:
        "https://images.unsplash.com/photo-1519457431-44ccd64a579b?q=80&w=600&auto=format&fit=crop",
      href: "/shop/kids/ethnic",
    },
    {
      id: "k-tops",
      title: "Tops & Shirts",
      description: "Playful Tees & Linens",
      image:
        "https://images.unsplash.com/photo-1503919545889-aef636e10ad4?q=80&w=600&auto=format&fit=crop",
      href: "/shop/kids/tops",
    },
    {
      id: "k-bottoms",
      title: "Bottoms",
      description: "Easy Pull-on Pants",
      image:
        "https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?q=80&w=600&auto=format&fit=crop",
      href: "/shop/kids/bottoms",
    },
    {
      id: "k-outerwear",
      title: "Outerwear",
      description: "Lightweight Jackets",
      image:
        "https://images.unsplash.com/photo-1519689680058-324335c77eba?q=80&w=600&auto=format&fit=crop",
      href: "/shop/kids/accessories",
    },
  ],
};

export const instagramFeed: InstagramPost[] = [
  {
    id: 1,
    image: "/images/instagram/post-1.jpg",
    url: "https://instagram.com/atlascub",
  },
  {
    id: 2,
    image: "/images/instagram/post-2.jpg",
    url: "https://instagram.com/atlascub",
  },
  {
    id: 3,
    image: "/images/instagram/post-3.jpg",
    url: "https://instagram.com/atlascub",
  },
  {
    id: 4,
    image: "/images/instagram/post-4.jpg",
    url: "https://instagram.com/atlascub",
  },
  {
    id: 5,
    image: "/images/instagram/post-5.jpg",
    url: "https://instagram.com/atlascub",
  },
  {
    id: 6,
    image: "/images/instagram/post-6.jpg",
    url: "https://instagram.com/atlascub",
  },
];

export const brandValues: BrandValue[] = [
  {
    id: 1,
    label: "01 / PURE MATERIALS",
    title: "Combed Cottons & Raw Silks",
    description:
      "We work directly with domestic spinners to source premium long-staple combed cottons and fine mulberry raw silk yarns.",
  },
  {
    id: 2,
    label: "02 / INDEPENDENT WEAVING",
    title: "Ethically Handspun",
    description:
      "Our clothing respects traditional Indian techniques, combining high-quality handloom structures with modern, clean lines.",
  },
  {
    id: 3,
    label: "03 / SLOW APPAREL",
    title: "Built to Outlast",
    description:
      "We don't do weekly fashion drops. Every stitch is reinforced and pre-shrunk, engineered to survive generations of daily wear.",
  },
];
