"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Heart, Sparkles } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { FaInstagram } from "react-icons/fa";

interface InstagramPost {
id: string;
mediaType: "IMAGE" | "VIDEO" | "CAROUSEL_ALBUM";
mediaUrl: string;
thumbnailUrl?: string;
permalink: string;
caption: string;
}

export function InstagramFeedLive() {
const [posts, setPosts] = useState<InstagramPost[]>([]);
const [handle, setHandle] = useState("atlascub.in");
const [loading, setLoading] = useState(true);

// useEffect(() => {
// async function fetchFeed() {
// try {
// const response = await fetch("/api/instagram");
// const json = await response.json();

//     if (json.data) {
//       setPosts(json.data.slice(0, 8)); // Display exactly 8 latest posts
//     }
//     if (json.handle) {
//       setHandle(json.handle);
//     }
//   } catch (err) {
//     console.error("Failed to load Instagram feed api:", err);
//   } finally {
//     setLoading(false);
//   }
// }
// fetchFeed();


// }, []);

return (
  <section className="py-24 md:py-32 bg-background/30">
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">

    {/* Dynamic Section Header */}
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="mb-16 text-center max-w-xl mx-auto"
    >
      <div className="inline-flex items-center gap-2 mb-4 text-[#9b2c2c]">
        <FaInstagram className="h-5 w-5" />
        <span className="text-[11px] font-mono uppercase tracking-widest font-bold">
          Follow @{handle}
        </span>
      </div>
      <h2 className="heading-lg font-serif font-bold text-[#1a1a1a] tracking-tight">
        Shared Aesthetic
      </h2>
      <p className="mt-4 text-sm text-[#57534e] leading-relaxed">
        Interact with our active community. Tag your raw silk drapes or vacation linens with `#Atlascub` to be featured.
      </p>
    </motion.div>

    {/* Responsive Grid Panel (8 Posts matching modern spacing grid) */}
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-4">
      {loading ? (
        // Animated Skeletons during loading states
        Array.from({ length: 8 }).map((_, index) => (
          <div key={index} className="aspect-square w-full rounded-lg overflow-hidden border border-[#f5e8d2]">
            <Skeleton className="h-full w-full bg-[#f5e8d2]/40" />
          </div>
        ))
      ) : (
        posts.map((post, index) => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.05, ease: [0.16, 1, 0.3, 1] }}
            className="group relative aspect-square overflow-hidden rounded-lg bg-stone-100  shadow-2xs hover:shadow-xs transition-shadow"
          >
            <Link href={post.permalink} target="_blank" rel="noopener noreferrer">
              
              {/* Dynamic Rendering: Images/Videos */}
              {post.mediaType === "VIDEO" ? (
                <video
                  src={post.mediaUrl}
                  poster={post.thumbnailUrl}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                />
              ) : (
                <img
                  src={post.mediaUrl}
                  alt={post.caption || `Instagram post ${post.id}`}
                  className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                />
              )}

              {/* Fine Interactive Hover Mask */}
              <div className="absolute inset-0 bg-black/45 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="transform scale-90 group-hover:scale-100 transition-transform duration-300 flex flex-col items-center gap-2 text-white">
                  <Heart className="h-6 w-6 text-[#fdf2d6] fill-[#fdf2d6]" />
                  <span className="text-[10px] font-mono uppercase tracking-widest text-white/90">
                    View Post
                  </span>
                </div>
              </div>

            </Link>
          </motion.div>
        ))
      )}
    </div>

    {/* Dynamic CTA Link Button */}
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, delay: 0.3 }}
      className="mt-12 text-center"
    >
      <Link
        href={`https://instagram.com/${handle.replace("@", "")}`}
        target="_blank"
        className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest font-bold text-stone-500 transition-colors hover:text-[#9b2c2c] group"
      >
        <span>Launch Instagram Interface</span>
        <Sparkles className="h-4 w-4 text-[#9b2c2c] group-hover:rotate-12 transition-transform" />
      </Link>
    </motion.div>

  </div>
</section>


);
}