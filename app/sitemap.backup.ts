import { MetadataRoute } from "next";
import { categories } from "@/lib/constants/navigation";

const BASE_URL = "https://www.atlascub.in";
const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://api.atlascub.in/api";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // 1. Static structural storefront page paths
  const staticPaths = [
    "",
    "/shop",
    "/collections/all",
    "/wishlist",
    "/cart",
    "/search",
    "/about",
    "/contact",
    "/support",
    "/terms",
    "/privacy",
    "/returns",
    "/shipping-policy",
  ];

  const staticRoutes = staticPaths.map((route) => ({
    url: `${BASE_URL}${route}`,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: route === "" ? 1.0 : 0.6,
  }));

  // 2. Structural Category URLs (/shop/[gender]/[category] & /shop/[gender]/all)
  const categoryPaths: string[] = [];
  const genders = ["men", "women", "kids"];

  genders.forEach((gender) => {
    // Add the "all" category route for each gender
    categoryPaths.push(`/shop/${gender}/all`);

    const genderCategories =
      categories[gender as keyof typeof categories] || [];
    genderCategories.forEach((cat) => {
      categoryPaths.push(`/shop/${gender}/${cat.slug}`);
    });
  });

  const categoryRoutes = categoryPaths.map((route) => ({
    url: `${BASE_URL}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  // 3. Dynamic Parallel Data Fetching
  let collectionRoutes: MetadataRoute.Sitemap = [];
  let productRoutes: MetadataRoute.Sitemap = [];

  try {
    // We execute both fetch pipelines concurrently to minimize build-time delays
    const [collectionsRes, productsRes] = await Promise.all([
      fetch(`${API_URL}/collections`, {
        next: { revalidate: 43200 }, // Cache on CDN for 12 hours
      }),
      fetch(`${API_URL}/products?limit=500`, {
        next: { revalidate: 43200 }, // Cache on CDN for 12 hours
      }),
    ]);

    // Handle collections generation dynamically
    if (collectionsRes.ok) {
      const collectionsData = await collectionsRes.json();
      // Handle cases where the endpoint returns either a direct array or wrapping object
      const collectionsList = Array.isArray(collectionsData)
        ? collectionsData
        : collectionsData?.data || [];

      collectionRoutes = collectionsList
        .filter((col: any) => col.isActive !== false) // Ignore disabled collections
        .map((col: any) => ({
          url: `${BASE_URL}/collections/${col.slug}`,
          lastModified: new Date(col.updatedAt || new Date()),
          changeFrequency: "weekly" as const,
          priority: 0.7,
        }));
    }

    // Handle products generation dynamically
    if (productsRes.ok) {
      const productsData = await productsRes.json();
      const productsList = Array.isArray(productsData)
        ? productsData
        : productsData?.data || [];

      productRoutes = productsList.map((product: any) => ({
        url: `${BASE_URL}/product/${product.slug}`,
        lastModified: new Date(product.updatedAt || new Date()),
        changeFrequency: "weekly" as const,
        priority: 0.7,
      }));
    }
  } catch (error) {
    console.error(
      "⚠️ SEO: Parallel fetch failed for dynamic sitemap paths:",
      error
    );
  }

  // Combine all statically parsed and dynamically fetched pathways into a single sitemap index
  return [
    ...staticRoutes,
    ...categoryRoutes,
    ...collectionRoutes,
    ...productRoutes,
  ];
}
