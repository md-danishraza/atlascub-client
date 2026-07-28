"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, Variants } from "framer-motion";
import { 
  ArrowUpRight, 
  Mail, 
  MapPin, 
  Phone, 
  Clock,
  Shield,
  Truck,
  RotateCcw,
  CreditCard,
  Sparkles
} from "lucide-react";
import { FaInstagram, FaTwitter, FaYoutube, FaPinterest, FaFacebook } from "react-icons/fa";
import { Logo } from "@/components/shared/logo";

export function Footer() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
    },
  };

  if (!mounted) return null;

  return (
    <footer className="relative bg-background text-foreground border-t border-border/60 mt-auto overflow-hidden">
      {/* Subtle gradient accent */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-primary/[0.02] via-transparent to-transparent" />
      
      {/* Decorative line at top */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />

      <div className="container mx-auto px-6 pt-16 md:pt-24 pb-6 max-w-7xl">
        
        {/* Trust Badges Row */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12 md:mb-16"
        >
          {[
            { icon: Truck, label: "Free Shipping", sub: "On orders above ₹1299" },
            { icon: Shield, label: "Secure Payment", sub: "100% protected checkout" },
            { icon: RotateCcw, label: "Easy Returns", sub: "7-day return policy" },
            { icon: Sparkles, label: "Premium Quality", sub: "Handcrafted with care" },
          ].map((item, idx) => (
            <div key={idx} className="flex items-center gap-3 p-3 rounded-xl bg-card/50 border border-border/40 hover:border-primary/20 transition-all duration-300 group">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                <item.icon className="h-4 w-4" />
              </div>
              <div>
                <p className="text-xs font-semibold tracking-wide">{item.label}</p>
                <p className="text-[10px] text-muted-foreground">{item.sub}</p>
              </div>
            </div>
          ))}
        </motion.div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-2 md:grid-cols-5 gap-10 md:gap-6 lg:gap-8 mb-16 md:mb-20"
        >
          {/* Column 1: Brand & Socials */}
          <motion.div variants={itemVariants} className="col-span-2 md:col-span-1 space-y-6">
            <div className="space-y-3">
              <p className="font-primary text-lg font-semibold tracking-tight">
                Atlascub Studio
              </p>
              <p className="text-sm leading-relaxed text-muted-foreground font-body max-w-xs">
                Translating classic Indian handloom textures and premium combed cottons into timeless, modern silhouettes. Made for generation-spanning daily wear.
              </p>
            </div>

            <div className="space-y-2">
              <p className="text-[10px] font-secondary uppercase tracking-[0.15em] text-muted-foreground font-semibold">
                Follow Us
              </p>
              <div className="flex gap-2.5">
                {[
                  { Icon: FaInstagram, href: "https://instagram.com/atlas_cub/", label: "Instagram" },
                  { Icon: FaFacebook, href: "https://www.facebook.com/share/17bg2eDQDG/", label: "FaceBook" },
                  // { Icon: FaTwitter, href: "https://twitter.com/atlascub", label: "Twitter" },
                  // { Icon: FaYoutube, href: "https://youtube.com/atlascub", label: "YouTube" },
                  // { Icon: FaPinterest, href: "https://pinterest.com/atlascub", label: "Pinterest" },
                ].map((social, idx) => (
                  <Link 
                    key={idx}
                    href={social.href} 
                    target="_blank" 
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-border/60 bg-card text-muted-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-300 hover:scale-105"
                    aria-label={social.label}
                  >
                    <social.Icon className="h-3.5 w-3.5" />
                  </Link>
                ))}
              </div>
            </div>

            {/* Contact Info */}
            <div className="space-y-1.5 text-sm text-muted-foreground">
              <p className="flex items-center gap-2">
                <Mail className="h-3.5 w-3.5 text-primary/70" />
                <span>support@atlascub.in</span>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="h-3.5 w-3.5 text-primary/70" />
                <span>+91 8287627289</span>
              </p>
              <p className="flex items-center gap-2">
                <Clock className="h-3.5 w-3.5 text-primary/70" />
                <span>Mon–Fri, 10 AM – 7 PM</span>
              </p>
            </div>
          </motion.div>

          {/* Column 2: Shop */}
          <motion.div variants={itemVariants} className="space-y-5">
            <h4 className="font-secondary text-[11px] uppercase tracking-[0.2em] text-foreground font-bold">
              Shop
            </h4>
            <ul className="space-y-3 text-sm font-body">
              {[
                { name: "Men", href: "/shop/men" },
                { name: "Women", href: "/shop/women" },
                { name: "Kids", href: "/shop/kids" },
                { name: "Collections", href: "/collections/all" },
                { name: "New Arrivals", href: "/search" },
                { name: "Best Sellers (men)", href: "/shop/men/all?sortBy=popularity" },
              ].map((item, idx) => (
                <li key={idx}>
                  <Link 
                    href={item.href} 
                    className="text-muted-foreground hover:text-primary hover:pl-2 transition-all duration-300 block"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Column 3: Company */}
          <motion.div variants={itemVariants} className="space-y-5">
            <h4 className="font-secondary text-[11px] uppercase tracking-[0.2em] text-foreground font-bold">
              Company
            </h4>
            <ul className="space-y-3 text-sm font-body">
              {[
                { name: "About Us", href: "/about" },
                // { name: "Our Story", href: "/about" },
                // { name: "Sustainability", href: "/about" },
                // { name: "Press", href: "/contact" },
                // { name: "Careers", href: "/contact" },
              ].map((item, idx) => (
                <li key={idx}>
                  <Link 
                    href={item.href} 
                    className="text-muted-foreground hover:text-primary hover:pl-2 transition-all duration-300 block"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Column 4: Customer Services */}
          <motion.div variants={itemVariants} className="space-y-5">
            <h4 className="font-secondary text-[11px] uppercase tracking-[0.2em] text-foreground font-bold">
              Customer Services
            </h4>
            <ul className="space-y-3 text-sm font-body">
              {[
                { name: "Help Center", href: "/support" },
                { name: "Shipping Info", href: "/shipping-policy" },
                { name: "Returns & Exchanges", href: "/returns" },
                { name: "Size Guide", href: "/support" },
                { name: "Contact Us", href: "/contact" },
                { name: "FAQ", href: "/support" },
              ].map((item, idx) => (
                <li key={idx}>
                  <Link 
                    href={item.href} 
                    className="text-muted-foreground hover:text-primary hover:pl-2 transition-all duration-300 block"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Column 5: Newsletter / Trust */}
          <motion.div variants={itemVariants} className="space-y-5">
            <h4 className="font-secondary text-[11px] uppercase tracking-[0.2em] text-foreground font-bold">
              Stay in Touch
            </h4>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Subscribe for exclusive drops, early access, and seasonal updates.
            </p>
            
            {/* Simple email signup */}
            <form className="flex flex-col gap-2" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="Your email"
                className="flex-1 rounded-full border border-border/60 bg-card px-4 py-2 text-sm text-foreground placeholder:text-muted-foreground/60 outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all"
              />
              <button
                type="submit"
                className="rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-all shrink-0"
              >
                Subscribe
              </button>
            </form>

            {/* Payment Methods */}
            <div className="space-y-2 pt-2">
              <p className="text-[10px] font-secondary uppercase tracking-[0.15em] text-muted-foreground font-semibold">
                We Accept
              </p>
              <div className="flex flex-wrap gap-2">
                {[
                  { icon: "💳", label: "Visa" },
                  { icon: "💳", label: "Mastercard" },
                  { icon: "📱", label: "UPI" },
                  { icon: "🏦", label: "Net Banking" },
                  { icon: "💵", label: "COD" },
                ].map((method, idx) => (
                  <span 
                    key={idx}
                    className="rounded-md border border-border/40 bg-card/50 px-2.5 py-1 text-[10px] font-medium text-muted-foreground"
                  >
                    {method.label}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Central Logo Brand Anchor */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full border-t border-border/60 pt-12 pb-6 flex justify-center items-center"
        >
          {/* Subtle glow behind logo */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="h-40 w-40 rounded-full bg-primary/5 blur-3xl" />
          </div>
          <div className="opacity-100 hover:opacity-100 transition-opacity relative z-10">
            <Logo 
              width={800} 
              height={400} 
              animated={true} 
              withGlow={true} 
              variant="default"
            />
          </div>
        </motion.div>

        {/* Bottom Legal Panel */}
        <div className="pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-[10px] font-secondary uppercase tracking-widest text-muted-foreground border-t border-border/40">

                {/* Made in India with Love Row */}
              <div className="flex items-center gap-2 text-[11px] tracking-normal font-body">
                <span className="text-foreground/80 font-medium">Made in India</span>
                <span className="text-primary/60">🇮🇳</span>
                <span className="text-muted-foreground/40">with</span>
                <span className="text-red-500 animate-pulse text-sm">❤️</span>
              </div>


          <div className="flex flex-col md:flex-row items-center gap-2 text-center md:text-left">
            <span>© 2026 Atlascub Premium Apparel.</span>
            <span className="hidden md:inline">•</span>
            <span className="text-[9px] tracking-normal">Developer: <span className="text-foreground/60">Md Danish Raza</span></span>
          </div>
          
          <div className="flex flex-wrap justify-center gap-4 md:gap-6">
            <Link href="/privacy" className="hover:text-primary transition-colors flex items-center gap-1 group">
              <span>Privacy Policy</span>
              <ArrowUpRight className="h-3 w-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
            </Link>
            <Link href="/terms" className="hover:text-primary transition-colors flex items-center gap-1 group">
              <span>Terms of Service</span>
              <ArrowUpRight className="h-3 w-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
            </Link>
            <Link href="/returns" className="hover:text-primary transition-colors flex items-center gap-1 group">
              <span>Returns</span>
              <ArrowUpRight className="h-3 w-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}