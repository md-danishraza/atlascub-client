"use client";

import { useState, useEffect } from "react";
import { motion, Variants } from "framer-motion";
import { useScrollDirection } from "@/hooks/use-scroll-direction";
import { useScrollPosition } from "@/hooks/use-scroll-position";
import { useMediaQuery } from "@/hooks/use-media-query";
import { Logo } from "@/components/shared/logo";
import { GenderNav } from "./gender-nav";
import { SearchBar } from "./search-bar";
import { CartIcon } from "./cart-icon";
import { ThemeToggle } from "./theme-toggle";
import { MobileMenu } from "./mobile-menu";
import { WishlistIcon } from "./wishlist/wishlist-icon";
import { UserMenu } from "../auth/user-menu";
import { useAppSelector } from "@/lib/store/store";

export function Navbar() {
  const scrollDirection = useScrollDirection();
  const scrolled = useScrollPosition(20);
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  
  // 🛡️ FIX 1: Lift the mobile menu state to the parent Navbar
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Pull the visibility state instantly and cleanly from Redux
  const isBannerVisible = useAppSelector((state) => state.ui.isAnnouncementVisible);

  // Track search state from SearchBar via event listener
  useEffect(() => {
    const handleSearchState = (e: CustomEvent) => {
      setIsSearchOpen(e.detail.isOpen);
    };
    window.addEventListener("searchStateChange", handleSearchState as EventListener);
    return () => window.removeEventListener("searchStateChange", handleSearchState as EventListener);
  }, []);

  const navbarVariants: Variants = {
    visible: {
      y: 0,
      transition: { type: "spring", damping: 30, stiffness: 300 },
    },
    hidden: {
      y: "-100%",
      transition: { type: "spring", damping: 30, stiffness: 300 },
    },
  };

  // 🛡️ FIX 2: Do NOT hide the navbar if the mobile menu is currently open
  const shouldHide = scrollDirection === "down" && scrolled && !isMobileMenuOpen && !(isMobile && isSearchOpen);

  useEffect(() => {
    const navbar = document.querySelector("header");
    if (navbar) {
      const height = navbar.offsetHeight;
      document.documentElement.style.setProperty("--navbar-height", `${height}px`);
    }
  }, []);

  return (
    <motion.header
      initial="visible"
      animate={shouldHide ? "hidden" : "visible"}
      variants={navbarVariants}
      className={`fixed top-0 z-50 w-full transition-all duration-300 ${
        scrolled || isSearchOpen
          ? "bg-background/80 shadow-sm backdrop-blur-lg"
          : "bg-transparent"
      } ${
        /* Apply dynamic margin ONLY if we haven't scrolled AND the banner is active */
        !scrolled && isBannerVisible 
          ? " mt-[36px] md:mt-[30px]" 
          : "top-0 mt-0"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between gap-2 md:h-20 md:gap-4">
          <div className="flex items-center gap-4 md:gap-8">
            <Logo />
            {!isMobile && !isSearchOpen && <GenderNav />}
          </div>

          <div className="flex items-center gap-1 md:gap-2">
            <SearchBar />
            {!isSearchOpen && (
              <>
                <ThemeToggle />
                <WishlistIcon />
                <UserMenu/>
                <CartIcon />
              </>
            )}
            {/* 🛡️ FIX 3: Pass lifted state down to MobileMenu */}
            {isMobile && !isSearchOpen && (
              <MobileMenu open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen} />
            )}
          </div>
        </div>
      </div>
    </motion.header>
  );
}