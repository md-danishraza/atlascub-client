"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, HelpCircle, Mail, Leaf, Building2 } from "lucide-react";
import { companyLinks } from "@/lib/constants/navigation";

const iconMap = {
  "✨": <Sparkles className="h-4 w-4" />,
  "🎧": <HelpCircle className="h-4 w-4" />,
  "📧": <Mail className="h-4 w-4" />,
};

import { Sparkles } from "lucide-react";

export function CompanyDropdown() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
     

      <Link
        href="/about"
        className="flex items-center gap-1 text-sm font-medium transition-colors hover:text-primary"
      >
        Company
        <ChevronDown
          className={`h-4 w-4 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </Link>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute left-0 top-full pt-4"
          >
            <div className="w-72 rounded-lg border bg-popover p-4 shadow-lg">
              <div className="mb-3 px-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                About Atlascub
              </div>
              <div className="space-y-1">
                {companyLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="flex items-start gap-3 rounded-md p-2 transition-colors hover:bg-accent"
                  >
                    <div className="mt-0.5 text-muted-foreground">
                      {iconMap[link.icon as keyof typeof iconMap] || <Building2 className="h-4 w-4" />}
                    </div>
                    <div>
                      <div className="font-medium">{link.name}</div>
                      <p className="text-xs text-muted-foreground">
                        {link.description}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}