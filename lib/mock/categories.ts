export interface Category {
  name: string;
  slug: string;
  description: string;
  image: string;
  productCount: number;
}

export const genderCategories = {
  men: {
    name: "Men",
    slug: "men",
    heroImage: "/images/gender/men-hero.jpg",
    description: "Quiet Confidence. Timeless Essentials.",
    categories: [
      {
        name: "Ethnic & Festive",
        slug: "ethnic",
        description:
          "Premium Kurtas, Nehru Jackets, Bandhgalas, and Sherwanis for festive milestones.",
        image: "/images/categories/men/ethnic.jpg",
      },
      {
        name: "Tops & Linens",
        slug: "tops",
        description:
          "Oversized Tees, structural Shirts, drapes, and lightweight French linen wear.",
        image: "/images/categories/men/tops.jpg",
      },
      {
        name: "Outerwear & Shackets",
        slug: "outerwear",
        description:
          "Modern jackets, tailored utility overshirts, and unstructured blazers.",
        image: "/images/categories/men/outerwear.jpg",
      },
      {
        name: "Bottoms & Trousers",
        slug: "bottoms",
        description:
          "Pleated trousers, linen shorts, and relaxed-fit tapered trousers.",
        image: "/images/categories/men/bottoms.jpg",
      },
      {
        name: "Accessories",
        slug: "accessories",
        description: "Minimalist caps, canvas bags, and premium leather belts.",
        image: "/images/categories/men/accessories.jpg",
      },
    ],
  },
  women: {
    name: "Women",
    slug: "women",
    heroImage: "/images/gender/women-hero.jpg",
    description: "Effortless Silhouettes. Modern Tailoring.",
    categories: [
      {
        name: "Ethnic & Fusion Sets",
        slug: "ethnic",
        description:
          "Designer Kurtas, effortless Anarkalis, contemporary Sarees, and Indigo drapes.",
        image: "/images/categories/women/ethnic.jpg",
      },
      {
        name: "Tops & Blouses",
        slug: "tops",
        description:
          "Minimalist shirts, drapes, knitted vests, and tailored blouses.",
        image: "/images/categories/women/tops.jpg",
      },
      {
        name: "Outerwear & Capes",
        slug: "outerwear",
        description:
          "Flowing outerwear, contemporary blazers, and lightweight layered capes.",
        image: "/images/categories/women/outerwear.jpg",
      },
      {
        name: "Bottoms & Palazzos",
        slug: "bottoms",
        description:
          "Wide-leg trousers, flared palazzos, draped skirts, and structured shorts.",
        image: "/images/categories/women/bottoms.jpg",
      },
      {
        name: "Accessories",
        slug: "accessories",
        description:
          "Aesthetic tote bags, handcrafted jewelry, and handspun scarves.",
        image: "/images/categories/women/accessories.jpg",
      },
    ],
  },
  kids: {
    name: "Kids",
    slug: "kids",
    heroImage: "/images/gender/kids-hero.jpg",
    description: "Soft Cottons. Easy Playwear.",
    categories: [
      {
        name: "Festive & Ethnic Sets",
        slug: "ethnic",
        description:
          "Comfortable organic cotton Kurta sets and miniature Lehengas.",
        image: "/images/categories/kids/ethnic.jpg",
      },
      {
        name: "Tops & Shirts",
        slug: "tops",
        description: "Playful graphic Tees and comfortable linen shirts.",
        image: "/images/categories/kids/tops.jpg",
      },
      {
        name: "Bottoms",
        slug: "bottoms",
        description:
          "Easy pull-on pants, elastic trousers, and breathable shorts.",
        image: "/images/categories/kids/bottoms.jpg",
      },
      {
        name: "Outerwear & Accessories",
        slug: "accessories",
        description:
          "Comfy sweatshirts, lightweight rain jackets, and dynamic caps.",
        image: "/images/categories/kids/accessories.jpg",
      },
    ],
  },
};

export const getAllCategories = () => {
  return [
    ...genderCategories.men.categories.map((c) => ({ ...c, gender: "men" })),
    ...genderCategories.women.categories.map((c) => ({
      ...c,
      gender: "women",
    })),
    ...genderCategories.kids.categories.map((c) => ({ ...c, gender: "kids" })),
  ];
};

export const getCategoryBySlug = (gender: string, slug: string) => {
  const genderData = genderCategories[gender as keyof typeof genderCategories];
  return genderData?.categories.find((c) => c.slug === slug);
};
