import { NextResponse } from "next/server";
import { categories } from "@/lib/constants/navigation";

// 🛡️ URL Path Sanitizer: Cleans trailing slashes
const sanitizeUrl = (url: string) => url.replace(/\/+$/, "");

const BASE_URL = sanitizeUrl(
  process.env.NEXT_PUBLIC_APP_URL || "https://www.atlascub.in"
);
const API_URL = sanitizeUrl(
  process.env.NEXT_PUBLIC_API_URL || "https://api.atlascub.in/api"
);

// 🛡️ Safe Date Wrapper: Prevents "Invalid Date" crashes during string serialization
function safeDateString(dateInput: any): string {
  if (!dateInput) return new Date().toISOString().split("T")[0];
  const parsed = new Date(dateInput);
  return isNaN(parsed.getTime())
    ? new Date().toISOString().split("T")[0]
    : parsed.toISOString().split("T")[0];
}

export async function GET() {
  try {
    const todayStr = new Date().toISOString().split("T")[0];

    let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">`;

    // 1. Static Pages
    const staticPaths = [
      { path: "", priority: "1.0", changefreq: "daily" },
      { path: "/shop", priority: "0.9", changefreq: "daily" },
      { path: "/collections/all", priority: "0.8", changefreq: "weekly" },
      { path: "/about", priority: "0.7", changefreq: "monthly" },
      { path: "/contact", priority: "0.7", changefreq: "monthly" },
      { path: "/support", priority: "0.6", changefreq: "monthly" },
      { path: "/terms", priority: "0.5", changefreq: "monthly" },
      { path: "/privacy", priority: "0.5", changefreq: "monthly" },
      { path: "/returns", priority: "0.5", changefreq: "monthly" },
      { path: "/shipping-policy", priority: "0.5", changefreq: "monthly" },
    ];

    for (const page of staticPaths) {
      xml += `
  <url>
    <loc>${BASE_URL}${page.path}</loc>
    <lastmod>${todayStr}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`;
    }

    // 2. Gender + Category Pages
    const genders = ["men", "women", "kids"];
    for (const gender of genders) {
      xml += `
  <url>
    <loc>${BASE_URL}/shop/${gender}/all</loc>
    <lastmod>${todayStr}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`;

      const genderCategories =
        categories[gender as keyof typeof categories] || [];
      for (const cat of genderCategories) {
        if (!cat.slug) continue;
        xml += `
  <url>
    <loc>${BASE_URL}/shop/${gender}/${cat.slug}</loc>
    <lastmod>${todayStr}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`;
      }
    }

    // 3. Dynamic Collections
    try {
      const collectionsRes = await fetch(`${API_URL}/collections`, {
        next: { revalidate: 43200 },
      });
      if (collectionsRes.ok) {
        const collectionsData = await collectionsRes.json();
        const collectionsList = Array.isArray(collectionsData)
          ? collectionsData
          : collectionsData?.data || [];

        for (const col of collectionsList) {
          // 🛡️ Filter Guard: Skip invalid or hidden collections
          if (!col || !col.slug || col.isActive === false) continue;

          xml += `
  <url>
    <loc>${BASE_URL}/collections/${col.slug.trim()}</loc>
    <lastmod>${safeDateString(col.updatedAt)}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`;
        }
      }
    } catch (e) {
      console.warn("Collections fetch failed for sitemap");
    }

    // 4. Dynamic Products
    try {
      const productsRes = await fetch(`${API_URL}/products?limit=500`, {
        next: { revalidate: 43200 },
      });
      if (productsRes.ok) {
        const productsData = await productsRes.json();
        const productsList = Array.isArray(productsData)
          ? productsData
          : productsData?.data || [];

        for (const product of productsList) {
          // 🛡️ Filter Guard: Avoid appending invalid routes to sitemap index trees
          if (!product || !product.slug) continue;

          xml += `
  <url>
    <loc>${BASE_URL}/product/${product.slug.trim()}</loc>
    <lastmod>${safeDateString(product.updatedAt)}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`;
        }
      }
    } catch (e) {
      console.warn("Products fetch failed for sitemap");
    }

    xml += `
</urlset>`;

    return new NextResponse(xml, {
      headers: {
        "Content-Type": "application/xml; charset=utf-8",
        "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=43200",
        "X-Content-Type-Options": "nosniff", // Enforces strict mime-type verification for crawlers
      },
    });
  } catch (error) {
    console.error("Sitemap generation failed:", error);
    return new NextResponse("Error generating sitemap", { status: 500 });
  }
}
