import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Atlascub | Premium Modern Clothing",
    short_name: "Atlascub",
    description:
      "Discover curated apparel at Atlascub. Premium quality, timeless design, and modern Indian tailoring.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#faf7f5",
    theme_color: "#9b2c2c",
    orientation: "portrait-primary",
    icons: [
      {
        src: "/web-app-manifest-192x192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any", // ✅ Fixed: "any" only
      },
      {
        src: "/web-app-manifest-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any", // ✅ Fixed: "any" only
      },
      {
        src: "/web-app-manifest-192x192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable", // ✅ Fixed: separate entry for maskable
      },
      {
        src: "/web-app-manifest-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable", // ✅ Fixed: separate entry for maskable
      },
      {
        src: "/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
        purpose: "any",
      },
    ],
  };
}
