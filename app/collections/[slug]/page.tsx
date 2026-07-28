import { Metadata } from "next";
import CollectionDetailClient from "./CollectionDetailClient";

type Props = {
  params: Promise<{ slug: string }>;
};

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://api.atlascub.in/api";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;

  try {
    // Fetch active collections from the API to get the clean title and description
    const response = await fetch(`${API_URL}/collections`, {
      next: { revalidate: 3600 }, // Cache metadata context for 1 hour
    });

    if (!response.ok) throw new Error("Collection metadata fetch failed");

    const collections = await response.json();
    // Support nested data structures or flat arrays resiliently
    const sortedList = Array.isArray(collections) ? collections : collections?.data || [];
    const collection = sortedList.find((c: any) => c.slug === slug);

    if (!collection) return { title: "Collection | Atlascub" };

    const cleanTitle = `${collection.name} Collection | Atlascub`;
    const cleanDescription = collection.description || `Explore our exclusive ${collection.name} capsule. Handcrafted silhouettes, luxury fabrics, and modern Indian tailoring.`;

    return {
      title: cleanTitle,
      description: cleanDescription,
      openGraph: {
        title: cleanTitle,
        description: cleanDescription,
        url: `https://www.atlascub.in/collections/${slug}`,
        type: "website",
        images: collection.image ? [{ url: collection.image }] : [],
      },
    };
  } catch (error) {
    console.error("⚠️ SEO Engine: Failed to generate collection metadata:", error);
    return { title: "Curated Collections | Atlascub" };
  }
}

export default function CollectionDetailPage() {
  return <CollectionDetailClient />;
}