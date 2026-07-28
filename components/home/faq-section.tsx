"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { 
  LayoutGrid, 
  Truck, 
  RotateCcw, 
  Scissors, 
  Ruler
} from "lucide-react";
import { shippingInfo, businessPolicies } from "@/lib/constants/legal";

const categories = [
  {
    icon: <LayoutGrid className="size-4" />,
    id: "all",
    label: "All Queries",
  },
  {
    icon: <Truck className="size-4" />,
    id: "shipping",
    label: "Shipping & Logistics",
  },
  {
    icon: <RotateCcw className="size-4" />,
    id: "returns",
    label: "Returns & Exchanges",
  },
  {
    icon: <Scissors className="size-4" />,
    id: "fabrics",
    label: "Craftsmanship & Care",
  },
  {
    icon: <Ruler className="size-4" />,
    id: "sizing",
    label: "Sizing & Fit",
  },
];

const faqs = [
  {
    id: 1,
    category: "shipping",
    title: "Do you offer international shipping?",
    content: shippingInfo.internationalShipping
      ? `Yes, we support global shipping across select networks. Standard international transits average ${shippingInfo.internationalShippingTime}.`
      : "Currently, our logistics network is configured strictly for domestic deliveries within India. We do not accept or process international shipping coordinates in our current phase.",
  },
  {
    id: 2,
    category: "shipping",
    title: "How long will my order take to arrive?",
    content: `Garments are processed and dispatched within 24 business hours. Deliveries within Faridabad and Haryana take ${shippingInfo.regionalHaryanaTime}, major metro cities take ${shippingInfo.metroCitiesTime}, and other domestic regions take ${shippingInfo.domesticShippingTime}. All shipments are handled by ${shippingInfo.logisticsPartner}.`,
  },
  {
    id: 3,
    category: "shipping",
    title: "What are your delivery charges?",
    content: `Standard prepaid orders over ₹${shippingInfo.freeShippingThreshold.toLocaleString("en-IN")} qualify for complimentary shipping. Orders below this threshold carry a flat delivery fee of ₹${shippingInfo.shippingCost.toLocaleString("en-IN")} applied automatically at checkout.`,
  },
  {
    id: 4,
    category: "shipping",
    title: "Is there an extra charge for Cash on Delivery (COD)?",
    content: `Yes. To offset the high administrative and collection costs associated with Cash on Delivery courier handling, a flat non-refundable surcharge of ₹${shippingInfo.codFee.toLocaleString("en-IN")} is added to your total during checkout.`,
  },
  {
    id: 5,
    category: "returns",
    title: "What is your return policy?",
    content: `We offer a strict return/exchange audit window of ${businessPolicies.returnWindow} from the date of delivery. Items must be returned in pristine condition, meaning ${businessPolicies.returnConditions}.`,
  },
  {
    id: 6,
    category: "returns",
    title: "Are returns completely free of cost?",
    content: `If you received a damaged, stained, or incorrect item, return logistics are fully free. For size changes or change of mind, a flat reverse logistics fee of ${businessPolicies.reverseLogisticsCharge} is deducted from your final refund payout.`,
  },
  {
    id: 7,
    category: "returns",
    title: "Can I exchange an item for a different size?",
    content: `${businessPolicies.exchangePolicy} Exchanges can be initiated easily by logging into your account dashboard.`,
  },
  {
    id: 8,
    category: "returns",
    title: "How long does a refund take?",
    content: `Once your returned garment reaches our warehouse and passes the strict handloom audit, your refund will be processed and returned to your original payment method within ${businessPolicies.refundTime}.`,
  },
  {
    id: 9,
    category: "fabrics",
    title: "What fabrics do you use and how should I care for them?",
    content: "We use premium natural fibers, including French linen, organic combed cotton, hypoallergenic mulberry silk-blends, and handloomed Indian textiles. Most of our cottons and linens are machine washable on a delicate, cold cycle. However, raw silk edits, textured handlooms, and structured drapes require dry cleaning only to preserve their tactile properties.",
  },
  {
    id: 10,
    category: "sizing",
    title: "How do I choose my correct size?",
    content: "Every product page features a detailed structural Size Guide. Please reference specific shoulder and chest measurements rather than standard retail sizes, as our garments are cut with bespoke, relaxed outlines.",
  },
  {
    id: 11,
    category: "sizing",
    title: "Do your oversized tees fit true to size?",
    content: "Yes. Our oversized silhouettes are intentionally engineered with a drop-shoulder and relaxed body structure. Order your standard true size to achieve the intended oversized look; do not size up.",
  },
];

export function FaqsSection() {
  const [activeCategory, setActiveCategory] = React.useState("all");

  const filtered = faqs.filter((faq) => {
    return activeCategory === "all" || faq.category === activeCategory;
  });

  const currentCategory = React.useMemo(
    () => categories.find((cat) => cat.id === activeCategory),
    [activeCategory]
  );

  return (
    <section className="relative w-full py-20 md:py-32 bg-background/30 ">
      <div className="mx-auto w-full max-w-6xl px-4 md:px-6">
        
        {/* Section Header */}
        <div className="mb-16 flex flex-col items-center justify-center text-center">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-4 block text-xs md:text-sm tracking-[0.2em] uppercase font-secondary text-primary/80"
          >
            Customer Desk
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl md:text-4xl lg:text-5xl font-primary font-bold tracking-tight text-foreground"
          >
            Frequently Asked Questions
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-4 text-muted-foreground font-body text-sm md:text-base max-w-lg"
          >
            Find quick answers regarding our fits, premium handloom fabrics, and shipping procedures.
          </motion.p>
        </div>

        {/* FAQ Interactive Container */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="relative grid min-h-full grid-cols-1 gap-12 md:grid-cols-12"
        >
          {/* Left Sidebar: Categories */}
          <div className="md:col-span-4 lg:col-span-3">
            <div className="flex w-full flex-wrap items-start justify-start gap-2 md:flex-col md:w-full md:sticky md:top-24">
              {categories.map((cat) => (
                <Button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  variant={activeCategory === cat.id ? "default" : "ghost"}
                  className={`w-full justify-start gap-3 h-11 transition-all ${
                    activeCategory === cat.id 
                      ? "bg-primary text-primary-foreground shadow-sm" 
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {cat.icon}
                  {cat.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Right Content: Accordions */}
          <div className="md:col-span-8 lg:col-span-9 space-y-6">
            {currentCategory && (
              <div className="flex items-center gap-2 pb-2 border-b border-border">
                <span className="text-primary">{currentCategory.icon}</span>
                <span className="font-serif text-lg font-bold text-foreground">
                  {currentCategory.label}
                </span>
              </div>
            )}
            
            <Accordion className="space-y-4" collapsible type="single">
              {filtered.map((item) => (
                <AccordionItem
                  className="border border-border rounded-lg overflow-hidden bg-card"
                  key={item.id}
                  value={item.id.toString()}
                >
                  <AccordionTrigger className="px-5 py-4 hover:no-underline font-body font-semibold text-foreground text-left text-sm md:text-base transition-colors hover:text-primary">
                    {item.title}
                  </AccordionTrigger>

                  <AccordionContent className="px-5 pb-5 pt-1 text-muted-foreground font-body leading-relaxed text-sm md:text-base">
                    {item.content}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>

            {/* Read More Link */}
            <div className="pt-6">
              <Button asChild variant="outline" className="border-border hover:bg-muted text-muted-foreground">
                <Link href="/contact">
                  Reach Our Support
                </Link>
              </Button>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
}