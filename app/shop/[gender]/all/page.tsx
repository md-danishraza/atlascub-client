import { Metadata } from "next";
import GenderAllClient from "./GenderAllClient";
import { genderMetadata } from "@/lib/constants/categories";

type Props = {
  params: Promise<{ gender: string }>;
};

// 🚀 GENERATE CLEAN DIRECTORY HEADERS FOR FULL ARCHIVE CRAWLS
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { gender } = await params;
  const metadata = genderMetadata[gender as keyof typeof genderMetadata];

  const cleanGender = gender.charAt(0).toUpperCase() + gender.slice(1);
  const displayTitle = metadata?.title || `${cleanGender}'s Premium Clothing`;
  
  const formattedTitle = `All ${displayTitle} | Complete Collection | Atlascub`;
  const formattedDescription = metadata?.description 
    ? `Browse all items in our ${metadata.title.toLowerCase()}. Discover minimalist design statements, luxury everyday essentials, and modern drapes.`
    : `Explore the complete catalog of premium tailored apparel for ${gender} at Atlascub. Made with luxury textiles and pristine workmanship.`;

  return {
    title: formattedTitle,
    description: formattedDescription,
    keywords: [`all ${gender} products`, `shop ${gender} clothing`, "Atlascub complete collection", "premium staples"],
    openGraph: {
      title: formattedTitle,
      description: formattedDescription,
      url: `https://www.atlascub.in/shop/${gender}/all`,
      type: "website",
    },
  };
}

export default function GenderAllProductsPage() {
  return <GenderAllClient />;
}