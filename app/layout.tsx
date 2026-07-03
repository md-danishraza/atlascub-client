import type { Metadata, Viewport } from "next";
import {  Libre_Baskerville, IBM_Plex_Mono,Poppins } from "next/font/google";
import "./globals.css";
import "../styles/theme-animation.css";
import { ClerkProvider } from "@clerk/nextjs";

import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { SmoothCursor } from "@/components/ui/smooth-cursor";
import { CartSidebar } from "@/components/cart/cart-sidebar";
import { WishlistSidebar } from "@/components/wishlist/wishlist-sidebar";
import { AnnouncementBar } from "@/components/shared/announcement-bar";
import { WhatsappWidget } from "@/components/home/whats-app-widget";
import { Toaster } from "sonner";
import { AuthStatus } from "@/components/debug/token-debug";

import { Providers } from "@/components/providers/global-provider";
import { Chatbot } from "@/components/rag/chatbot";

const fontSans = Poppins({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["400", "500", "700"],
  display:"swap"
});

const fontSerif = Libre_Baskerville({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
});

const fontMono = IBM_Plex_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "500", "700"],
  display: "swap",
});



// --- ADVANCED PWA VIEWPORT CONFIGURATION ---
export const viewport: Viewport = {
  themeColor: [
  { media: "(prefers-color-scheme: light)", color: "#faf7f5" },
  { media: "(prefers-color-scheme: dark)", color: "#1c1917" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5, // Allows accessibility zooming
  userScalable: true,
  };
  
  export const metadata: Metadata = {
    metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://www.atlascub.in"),
    alternates: {
      canonical: "/",
    },
    manifest: "/manifest.webmanifest", // Direct Next.js dynamic routing endpoint
    title: {
      default: "Atlascub | Premium Modern Clothing & Drapes",
      template: "%s | Atlascub",
    },
    description: "Discover curated luxury apparel at Atlascub. Elevate your wardrobe with premium clothes, silhouettes, and  modern Indian tailoring.",
    keywords: [
      "premium clothing", 
      "Indian fashion", 
      "linen shirts", 
      "oversized tees", 
      "Atlascub", 
      "festive wear", 
      "handloom silhouettes", 
      "resort apparel"
    ],
    authors: [{ name: "Atlascub Studio" }],
    creator: "Atlascub",
    publisher: "Atlascub Studio Private Limited",
    applicationName: "Atlascub",
  
    openGraph: {
      type: "website",
      locale: "en_IN",
      url: "https://www.atlascub.in",
      siteName: "Atlascub",
      title: "Atlascub | Premium Modern Clothing",
      description: "Discover curated apparel at Atlascub. Premium quality, timeless design, and modern tailoring.",
      images: [
        {
          url: "/og-image.png", 
          width: 1200,
          height: 630,
          alt: "Atlascub Premium Clothing Showcase",
        },
      ],
    },
  
    twitter: {
      card: "summary_large_image",
      title: "Atlascub | Premium Modern Clothing",
      description: "Discover curated apparel at Atlascub. Premium quality, timeless design.",
      creator: "@atlascub",
      images: ["https://www.atlascub.in/og-image.png"],
    },
  
    appleWebApp: {
      capable: true,
      title: "Atlascub",
      statusBarStyle: "default",
    },
    formatDetection: {
      telephone: false, // Prevents mobile browsers from force-styling raw phone lines
    },

    other: {
      "application-name": "Atlascub",
      "msapplication-TileColor": "#9b2c2c",
      "theme-color": "#9b2c2c",
    },
  };


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
     // ClerkProvider MUST wrap the HTML to provide Auth to Server & Client components
     <ClerkProvider>
     <html lang="en" className={`${fontSans.variable} ${fontSerif.variable} ${fontMono.variable} antialiased`} suppressHydrationWarning>
       <body className="min-h-screen bg-background font-body antialiased">
         
         {/* All strictly client-side providers (Redux, Theme, Sync) are injected here */}
         <Providers>
           <SmoothCursor />
           <div className="relative flex min-h-screen flex-col">
             <AnnouncementBar />
             <Navbar />
             
             <main className="flex-1 pt-16 md:pt-20">{children}</main>
             
             <Footer />

             {/* Global Overlays */}
             <CartSidebar />
             <WishlistSidebar />
             <WhatsappWidget />
             <Chatbot />

             {/* Development Utilities */}
             {/* {process.env.NODE_ENV === "development" && <AuthStatus />} */}
           </div>

           <Toaster position="bottom-right" richColors />
         </Providers>
       </body>
     </html>
   </ClerkProvider>
  );
}
