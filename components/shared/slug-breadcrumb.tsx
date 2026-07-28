"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, Home } from "lucide-react";
import { genderMetadata, getCategoryTitle } from "@/lib/constants/categories";
import { categories } from "@/lib/constants/navigation";

interface BreadcrumbItem {
  label: string;
  href: string;
}

export function SlugBreadcrumb() {
  const pathname = usePathname();
  
  const buildBreadcrumbs = (): BreadcrumbItem[] => {
    const breadcrumbs: BreadcrumbItem[] = [{ label: "Home", href: "/" }];
    
    const segments = pathname.split("/").filter(Boolean);
    
    // Handle /shop/* routes
    if (segments[0] === "shop") {
      breadcrumbs.push({ label: "Shop", href: "/shop" });
      
      if (segments[1]) {
        const gender = segments[1];
        const genderTitle = genderMetadata[gender as keyof typeof genderMetadata]?.title || 
          gender.charAt(0).toUpperCase() + gender.slice(1);
        breadcrumbs.push({
          label: genderTitle,
          href: `/shop/${gender}`,
        });
      }
      
      if (segments[2]) {
        const category = segments[2];
        const categoryTitle = getCategoryTitle(category);
        breadcrumbs.push({
          label: categoryTitle,
          href: `/shop/${segments[1]}/${category}`,
        });
      }
    }
    
    // Handle /collections/* routes
    else if (segments[0] === "collections") {
      breadcrumbs.push({ label: "Collections", href: "/collections/all" });
      
      if (segments[1] && segments[1] !== "all") {
        // Find collection by slug to get display name
        const collections = categories.collections || [];
        const collection = collections.find((c) => c.slug === segments[1]);
        const collectionName = collection?.name || 
          segments[1].split("-").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");
        
        breadcrumbs.push({
          label: collectionName,
          href: `/collections/${segments[1]}`,
        });
      }
    }
    
    // Handle /product/* routes (for future product detail pages)
    else if (segments[0] === "product" && segments[1]) {
      breadcrumbs.push({ label: "Shop", href: "/shop" });
      breadcrumbs.push({
        label: "Product",
        href: pathname,
      });
    }
    
    // Handle /wishlist route
    else if (segments[0] === "wishlist") {
      breadcrumbs.push({ 
        label: "Wishlist", 
        href: "/wishlist" 
      });
    }
    
    // Handle /account routes
    else if (segments[0] === "account") {
      breadcrumbs.push({ label: "Account", href: "/account" });
      
      if (segments[1]) {
        const pageName = segments[1].charAt(0).toUpperCase() + segments[1].slice(1);
        breadcrumbs.push({
          label: pageName,
          href: `/account/${segments[1]}`,
        });
      }
    }
    
    return breadcrumbs;
  };

  const breadcrumbs = buildBreadcrumbs();

  if (breadcrumbs.length <= 1) return null;

  return (
    <nav className="flex items-center gap-2 text-sm" aria-label="Breadcrumb">
      {breadcrumbs.map((item, index) => {
        const isLast = index === breadcrumbs.length - 1;

        if (isLast) {
          return (
            <span key={item.href} className="text-muted-foreground font-medium">
              {item.label}
            </span>
          );
        }

        return (
          <div key={item.href} className="flex items-center gap-2">
            <Link
              href={item.href}
              className="text-muted-foreground transition-colors hover:text-primary"
            >
              {item.label === "Home" ? <Home className="h-3.5 w-3.5" /> : item.label}
            </Link>
            <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
          </div>
        );
      })}
    </nav>
  );
}