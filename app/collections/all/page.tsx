import { Metadata } from "next";
import CollectionsAllClient from "./CollectionAllClient";

export const metadata: Metadata = {
  title: "Our Lookbooks & Collections | Atlascub",
  description: "Browse through all curated clothing lookbooks at Atlascub. From high-density seasonal capsules to timeless handloom silhouettes, discover garments tailored for the modern individual.",
  openGraph: {
    title: "Our Lookbooks & Collections | Atlascub",
    description: "Browse through all curated clothing lookbooks at Atlascub. Discover garments tailored for the modern individual.",
    url: "https://www.atlascub.in/collections/all",
    type: "website",
  },
};

export default function CollectionsAllPage() {
  return <CollectionsAllClient />;
}