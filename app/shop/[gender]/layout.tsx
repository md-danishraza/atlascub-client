import { ReactNode } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Metadata } from "next";
import { genderMetadata } from "@/lib/constants/categories";

interface GenderLayoutProps {
  children: ReactNode;
  params: Promise<{ gender: string }>;
}

// 🚀 GENERATE DYNAMIC DEPARTMENT METADATA
export async function generateMetadata({ params }: { params: Promise<{ gender: string }> }): Promise<Metadata> {
  const { gender } = await params;
  const data = genderMetadata[gender as keyof typeof genderMetadata];

  if (!data) return { title: "Shop Apparel | Atlascub" };

  const formatTitle = `${data.title} | Premium Modern Collection | Atlascub`;

  return {
    title: formatTitle,
    description: data.description || `Explore our tailored selection of luxury garments in the Atlascub ${gender} department. Premium fabrics, timeless styles.`,
    openGraph: {
      title: formatTitle,
      description: data.description,
      url: `https://www.atlascub.in/shop/${gender}`,
      type: "website",
      images: data.heroImage ? [{ url: data.heroImage, alt: data.title }] : [],
    },
  };
}

export default async function GenderLayout({ children, params }: GenderLayoutProps) {
  const { gender } = await params;
  const metadata = genderMetadata[gender as keyof typeof genderMetadata];

  if (!metadata) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Gender Hero Banner */}
      <div className="relative h-[280px] md:h-[320px] overflow-hidden bg-muted">
        <div className="absolute inset-0 z-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={metadata.heroImage}
            alt={metadata.title}
            className="h-full w-full object-cover"
          />
          <div className={`absolute inset-0 bg-gradient-to-r ${metadata.gradient} to-transparent`} />
        </div>
        <div className="relative z-10 container mx-auto flex h-full flex-col justify-end px-4 pb-12">
          <h1 className="heading-xl font-primary text-white">{metadata.title}</h1>
          <p className="mt-2 text-white/80 max-w-md">{metadata.description}</p>
        </div>
      </div>
      
      {/* Category Navigation - Add "All" link */}
      <div className="container mx-auto px-4 mt-6">
        <div className="flex flex-wrap gap-3 border-b border-border pb-4">
          <Link
            href={`/shop/${gender}`}
            className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
          >
            Featured
          </Link>
          <Link
            href={`/shop/${gender}/all`}
            className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
          >
            All Products
          </Link>
        </div>
      </div>
      
      {/* Page Content Canvas Injection */}
      {children}
    </div>
  );
}