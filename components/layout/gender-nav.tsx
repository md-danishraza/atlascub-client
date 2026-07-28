"use client";

import { usePathname } from "next/navigation";
// import Link from "next/link";
import { motion } from "framer-motion";
import { CategoryDropdown } from "./category-dropdown";
import { CollectionsDropdown } from "./collections-dropdown";
import { CompanyDropdown } from "./company-dropdown";
import { genderLinks } from "@/lib/constants/navigation";

export function GenderNav() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    return pathname === href || pathname?.startsWith(`${href}/`);
  };

  return (
    <nav className="hidden md:flex items-center gap-6">
      {genderLinks.map((gender) => {
        const active = isActive(gender.href);
        const genderKey = gender.slug as "men" | "women" | "kids";
        
        return (
          <div key={gender.name} className="relative">
            <CategoryDropdown gender={genderKey} label={gender.name} />
            {active && (
              <motion.div
                layoutId="activeGender"
                className="absolute -bottom-4 left-0 right-0 h-0.5 bg-primary"
                transition={{ duration: 0.2 }}
              />
            )}
          </div>
        );
      })}
      
      {/* Collections Dropdown */}
      <CollectionsDropdown />
      
      {/* Company Dropdown */}
      <CompanyDropdown />
    </nav>
  );
}