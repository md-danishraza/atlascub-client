"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { 
  ShieldAlert, 
  RotateCcw, 
  Banknote, 
  Truck, 
  Tag,
  AlertCircle,
  HelpCircle
} from "lucide-react";
import { SlugBreadcrumb } from "@/components/shared/slug-breadcrumb";
import { Button } from "@/components/ui/button";

export default function ReturnsPolicyPage() {
  const policies = [
    {
      icon: ShieldAlert,
      title: "Pristine Condition & Intact Seals",
      description: "To maintain our strict quality and hygiene standards, all garments must be returned in their original, unworn, and unwashed condition. All original brand tags, authenticity cards, and packaging seals must remain completely unbroken. Items showing any signs of wear, alteration, or damage will be rejected and sent back."
    },
    {
      icon: Banknote,
      title: "Partial Refunds & Deductions",
      description: "Please note that we do not offer 100% full refunds. To cover payment gateway processing fees and warehouse restocking efforts, a nominal deduction (typically 5-10% of the garment value) will be subtracted from your final refund amount. Forward shipping charges paid during the original order are strictly non-refundable."
    },
    {
      icon: Truck,
      title: "Reverse Logistics & Shipping Charges",
      description: "The cost of return shipping is borne by the customer. When you request a return, a flat reverse-shipping fee will be calculated based on your location and automatically deducted from your final refund payout once the item reaches our facility."
    },
    {
      icon: RotateCcw,
      title: "The 7-Day Window",
      description: "Return or replacement requests must be initiated within exactly 7 days from the date of delivery. Our portal will automatically lock requests for orders that have exceeded this timeframe."
    },
    {
      icon: Tag,
      title: "Non-Returnable Items",
      description: "Certain items cannot be returned or exchanged under any circumstances. This includes items purchased during clearance sales, intimate wear, accessories, and any bespoke or custom-tailored garments."
    }
  ];

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header Section */}
      <div className="bg-muted/30 border-b border-border/40 py-12 md:py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />
        <div className="container mx-auto px-4 max-w-4xl relative z-10">
          <SlugBreadcrumb />
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="mt-8"
          >
            <h1 className="heading-xl font-primary tracking-tight text-foreground">
              Exchange & Return Policy
            </h1>
            <p className="mt-4 text-lg text-muted-foreground font-body leading-relaxed max-w-2xl">
              At Atlascub, every garment is crafted with precision. Our return and exchange protocols are designed to be transparent while maintaining the exclusivity and quality of our apparel.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 max-w-4xl py-12 md:py-16">
        
        {/* Dynamic Disclaimer Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-12 rounded-xl border border-amber-200 bg-amber-50 dark:bg-amber-950/20 p-5 md:p-6 flex items-start gap-4 shadow-sm"
        >
          <AlertCircle className="h-6 w-6 text-amber-600 dark:text-amber-500 shrink-0 mt-0.5" />
          <div>
            <h3 className="text-base font-semibold text-amber-900 dark:text-amber-400">
              Policy Subject to Change
            </h3>
            <p className="mt-1.5 text-sm text-amber-800/90 dark:text-amber-500/90 leading-relaxed">
              Atlascub Studio reserves the right to alter, modify, or terminate these return policies and deduction rates at any time without prior notice. The policy active at the time of your order placement will apply.
            </p>
          </div>
        </motion.div>

        {/* Policy Points Grid */}
        <div className="space-y-8">
          {policies.map((policy, index) => {
            const Icon = policy.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="flex flex-col md:flex-row gap-4 md:gap-6 p-6 rounded-2xl border border-border/60 bg-card hover:shadow-md transition-shadow"
              >
                <div className="shrink-0">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-primary font-bold text-foreground mb-2">
                    {policy.title}
                  </h3>
                  <p className="text-sm md:text-base text-muted-foreground leading-relaxed font-light">
                    {policy.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Action / Help Footer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 pt-12 border-t border-border/60 text-center"
        >
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-muted mb-4">
            <HelpCircle className="h-6 w-6 text-muted-foreground" />
          </div>
          <h3 className="text-2xl font-primary font-bold mb-3">Need to initiate a return?</h3>
          <p className="text-muted-foreground mb-8 max-w-md mx-auto">
            If your order meets the conditions above, you can securely request a return or replacement directly from your account dashboard.
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <Button asChild size="lg" className="w-full sm:w-auto px-8 rounded-full">
              <Link href="/account/orders">
                Go to My Orders
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="w-full sm:w-auto px-8 rounded-full">
              <Link href="/contact">
                Contact Client Desk
              </Link>
            </Button>
          </div>
        </motion.div>

      </div>
    </div>
  );
}