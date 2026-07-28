import { NextResponse } from "next/server";

// Cache settings (Cache the Meta API response for 1 hour to prevent hitting Graph API rate limits)
let cachedFeed: any = null;
let cacheExpiry: number = 0;
const CACHE_TTL_MS = 60 * 60 * 1000; // 1 Hour

export async function GET() {
  const accessToken = process.env.INSTAGRAM_ACCESS_TOKEN;
  const instagramHandle = process.env.NEXT_PUBLIC_INSTAGRAM_HANDLE || "atlascub.in";

  // 1. If no token is provided in .env, return a structured fallback response gracefully
  if (!accessToken) {
    return NextResponse.json({
      success: false,
      message: "Instagram Access Token not configured. Serving local fallback assets.",
      handle: instagramHandle,
      data: FALLBACK_FEED,
    });
  }

  // 2. Check memory cache to prevent duplicate external requests
  const now = Date.now();
  if (cachedFeed && now < cacheExpiry) {
    return NextResponse.json({
      success: true,
      handle: instagramHandle,
      data: cachedFeed,
    });
  }

  try {
    // 3. Query the official Instagram Basic Display API (fetch 8 latest posts)
    const response = await fetch(
      `https://graph.instagram.com/me/media?fields=id,caption,media_type,media_url,permalink,thumbnail_url,timestamp&access_token=${accessToken}&limit=8`,
      { next: { revalidate: 3600 } } // Next.js level fetch cache (1 hour)
    );

    if (!response.ok) {
      throw new Error(`Meta API returned status: ${response.status}`);
    }

    const json = await response.json();
    
    // Normalize properties to ensure consistency on the client side
    const normalizedData = (json.data || []).map((item: any) => ({
      id: item.id,
      mediaType: item.media_type, // "IMAGE" | "VIDEO" | "CAROUSEL_ALBUM"
      mediaUrl: item.media_url,
      thumbnailUrl: item.thumbnail_url || null,
      permalink: item.permalink,
      caption: item.caption || "",
    }));

    // Update Cache
    cachedFeed = normalizedData;
    cacheExpiry = now + CACHE_TTL_MS;

    return NextResponse.json({
      success: true,
      handle: instagramHandle,
      data: normalizedData,
    });

  } catch (error: any) {
    console.error("Failed to fetch from Instagram Graph API, falling back:", error.message);
    return NextResponse.json({
      success: false,
      message: "Instagram API failure. Serving local fallback assets.",
      handle: instagramHandle,
      data: FALLBACK_FEED,
    });
  }
}

// Fallback high-quality editorial assets (Mix of mp4 videos and jpg drapes)
const FALLBACK_FEED = [
  {
    id: "fb_1",
    mediaType: "VIDEO",
    mediaUrl: "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260423_161253_c72b1869-400f-45ed-ac0c-52f68c2ed5bd.mp4",
    permalink: "https://instagram.com/atlascub",
    caption: "Midnight Sequins & Silk. Feel the texture of premium Indian festive drapes. #Atlascub",
  },
  {
    id: "fb_2",
    mediaType: "IMAGE",
    mediaUrl: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?q=80&w=600&h=600&auto=format&fit=crop",
    permalink: "https://instagram.com/atlascub",
    caption: "Sourcing premium linen drapes in neutral sand tones. #QuietLuxury",
  },
  {
    id: "fb_3",
    mediaType: "IMAGE",
    mediaUrl: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?q=80&w=600&h=600&auto=format&fit=crop",
    permalink: "https://instagram.com/atlascub",
    caption: "The design studio desk. Tailoring patterns for our Summer 2026 capsule drop.",
  },
  {
    id: "fb_4",
    mediaType: "VIDEO",
    mediaUrl: "https://assets.mixkit.co/videos/preview/mixkit-girl-in-neon-sign-posing-for-photoshoot-40292-large.mp4",
    permalink: "https://instagram.com/atlascub",
    caption: "Streetwear Core. Redefining modern outlines with heavy loopback cotton hoodies.",
  },
  {
    id: "fb_5",
    mediaType: "IMAGE",
    mediaUrl: "https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=600&h=600&auto=format&fit=crop",
    permalink: "https://instagram.com/atlascub",
    caption: "Details that define us. Hypoallergenic textiles crafted with precision. #Bespoke",
  },
  {
    id: "fb_6",
    mediaType: "IMAGE",
    mediaUrl: "https://images.unsplash.com/photo-1473186578172-c141e6798cf4?q=80&w=600&h=600&auto=format&fit=crop",
    permalink: "https://instagram.com/atlascub",
    caption: "Our heritage collection weavers in action. Preserving legacy, drapes after drapes.",
  },
  {
    id: "fb_7",
    mediaType: "VIDEO",
    mediaUrl: "https://assets.mixkit.co/videos/preview/mixkit-fashion-model-showing-her-skirt-design-41617-large.mp4",
    permalink: "https://instagram.com/atlascub",
    caption: "Movement meets form. Linen vacation resort shirts in deep olive green.",
  },
  {
    id: "fb_8",
    mediaType: "IMAGE",
    mediaUrl: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=600&h=600&auto=format&fit=crop",
    permalink: "https://instagram.com/atlascub",
    caption: "Atlascub original details. Clean cuts, relaxed fittings.",
  }
];