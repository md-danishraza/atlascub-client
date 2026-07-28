"use client";

import { useState } from "react";
import { SupportHero } from "@/components/support/support-hero";
import { PolicyCards } from "@/components/support/policy-cards";
import { FAQCategory } from "@/components/support/faq-category";
import { ContactOptions } from "@/components/support/contact-options";
import { SlugBreadcrumb } from "@/components/shared/slug-breadcrumb";
import { faqCategories } from "@/lib/constants/support";
import { motion } from "framer-motion";

export function SupportPageClient() {
  const [openCategories, setOpenCategories] = useState<string[]>(["orders"]);

  const toggleCategory = (id: string) => {
    setOpenCategories((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 pt-6">
        <SlugBreadcrumb />
      </div>

      <SupportHero />
      <PolicyCards />

      <div className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-8 text-center"
        >
          <h2 className="heading-md font-primary">Frequently Asked Questions</h2>
          <p className="mt-2 text-muted-foreground">
            Find quick answers to common questions
          </p>
        </motion.div>

        <div className="mx-auto max-w-3xl space-y-3">
          {faqCategories.map((category) => (
            <FAQCategory
              key={category.id}
              id={category.id}
              name={category.name}
              icon={category.icon}
              faqs={category.faqs}
              isOpen={openCategories.includes(category.id)}
              onToggle={() => toggleCategory(category.id)}
            />
          ))}
        </div>
      </div>

      <ContactOptions />
    </div>
  );
}