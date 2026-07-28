import { Metadata } from "next";
import ProductDetailClient from "./ProductDetailClient";

type Props = {
  params: Promise<{ slug: string }>;
};

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://api.atlascub.in/api";

let jsonLd:any = null;

// 🚀 GENERATE DYNAMIC SEO METADATA MATCHING YOUR BACKEND ROUTE
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  try {
    // 🔍 Directly targeting your single product parameter endpoint: /products/:id_or_slug
    const response = await fetch(`${API_URL}/products/${slug}`, {
      next: { revalidate: 3600 }, // Cache metadata for 1 hour to protect database performance
    });

    if (!response.ok) throw new Error(`Product SEO fetch failed with status: ${response.status}`);

    const result = await response.json();
    
    // Resilient parsing: extract direct object or support a standard data wrapper fallback
    const product = result?.data || result;

    if (!product || !product.name) return { title: "Product Not Found | Atlascub" };

    const cleanTitle = `${product.name} | Atlascub`;
    const cleanDescription = product.description 
      ? product.description.replace(/<[^>]*>/g, "").substring(0, 155) + "..." 
      : "Discover premium tailored apparel at Atlascub.";
    
    const productImage = product.images?.[0]?.url || "/og-image.png";


    jsonLd = {
      "@context": "https://schema.org",
      "@type": "Product",
      "name": product.name,
      "image": product.images?.map((img: any) => img.url) || [],
      "description": product.description?.replace(/<[^>]*>/g, ""),
      "sku": product.id,
      "mpn": product.slug,
      "offers": {
        "@type": "Offer",
        "url": `https://www.atlascub.in/product/${product.slug}`,
        "priceCurrency": "INR",
        "price": product.price,
        "itemCondition": "https://schema.org/NewCondition",
        "availability": product.inStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
        "seller": {
          "@type": "Organization",
          "name": "Atlascub"
        }
      }
    };

    return {
      title: cleanTitle,
      alternates: {
        canonical: `/product/${slug}`, 
      },
      description: cleanDescription,
      keywords: [product.name, product.category?.name || "apparel", "Atlascub fashion", "premium tailoring"],
      openGraph: {
        title: cleanTitle,
        description: cleanDescription,
        url: `https://www.atlascub.in/product/${slug}`,
        type: "article",
        images: [
          {
            url: productImage,
            width: 800,
            height: 1000,
            alt: product.name,
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title: cleanTitle,
        description: cleanDescription,
        images: [productImage],
      },
    };



  } catch (error) {
    console.error("⚠️ SEO Engine: Error building dynamic product metadata:", error);
    return {
      title: "Premium Apparel | Atlascub",
      description: "Discover curated modern Indian apparel and premium tailored silhouettes.",
    };
  }
}




export default function ProductDetailPage() {
  return(
    <>
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
    <ProductDetailClient />
    </>
  )
}