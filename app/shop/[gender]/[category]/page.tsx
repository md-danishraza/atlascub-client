import { Metadata } from "next";
import CategoryClient from "./CategoryClient"; // Ensure this matches your exact filename casing

type Props = {
  params: Promise<{ gender: string; category: string }>;
};

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://api.atlascub.in/api";

// 🚀 GENERATE HIGHLY CONTEXTUAL DYNAMIC SEARCH KEYWORDS MATCHING BACKEND
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { gender, category: categorySlug } = await params;

  // Clean fallback strings in case data parsing cycles encounter missing models
  const cleanGender = gender.charAt(0).toUpperCase() + gender.slice(1);
  const fallbackTitle = categorySlug.charAt(0).toUpperCase() + categorySlug.slice(1).replace("-", " ");

  try {
    // 🔍 FIX: Updated to match your exact NestJS controller structure: /categories/gender/:gender/slug/:slug
    const response = await fetch(`${API_URL}/categories/gender/${gender}/slug/${categorySlug}`, {
      next: { revalidate: 3600 }, // Cache metadata contexts for an hour to protect database performance
    });

    const result = response.ok ? await response.json() : null;
    const category = result?.data || result;

    const categoryTitle = category?.name || fallbackTitle;
    const cleanTitle = `${categoryTitle} for ${cleanGender} | Premium Silhouettes | Atlascub`;
    const cleanDescription = category?.description || `Shop premium, tailored ${categoryTitle.toLowerCase()} for ${gender} at Atlascub. Discover minimalist style statements, luxury drapes, and high-quality Indian workmanship.`;

    return {
      title: cleanTitle,
      description: cleanDescription,
      keywords: [categoryTitle, `${gender} ${categoryTitle}`, "Atlascub shop", "premium garments"],
      openGraph: {
        title: cleanTitle,
        description: cleanDescription,
        url: `https://www.atlascub.in/shop/${gender}/${categorySlug}`,
        type: "website",
      },
    };
  } catch (error) {
    console.error("⚠️ SEO Engine: Failed to gather dynamic category parameters:", error);
    return {
      title: `${fallbackTitle} for ${cleanGender} | Atlascub`,
      description: `Explore curated collections of premium ${fallbackTitle.toLowerCase()} at Atlascub.`,
    };
  }
}

export default function CategoryPage() {
  return <CategoryClient />;
}