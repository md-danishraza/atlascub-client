"use client";


import { Eye, Sparkles, ShieldCheck, Truck, HelpCircle, ArrowRight } from "lucide-react";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Product } from "@/lib/store/apis/product-api";
import { motion, Variants } from "framer-motion";

interface QuickViewModalProps {
  product: Product | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// Staggered Motion Animations for Premium Staged Entrance
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.15,
    },
  },
};

const itemVariants:Variants = {
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 260, damping: 25 },
  },
};

export function QuickViewModal({ product, open, onOpenChange }: QuickViewModalProps) {
  
  if (!product) return null;

  const discount = product.compareAtPrice
    ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
    : 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="p-0 overflow-hidden w-[94vw] sm:w-[90vw] md:w-full md:max-w-4xl rounded-xl md:rounded-2xl border border-border bg-background shadow-2xl gap-0 transition-all duration-500 ease-out data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0 data-[state=open]:zoom-in-95 data-[state=closed]:zoom-out-95 data-[state=open]:slide-in-from-top-[48%]">
        
        {/* 🛡️ ACCESSIBILITY REQUIREMENT: Screen Reader Description & Title */}
        <VisuallyHidden.Root>
          <DialogTitle>{product.name} Quick View</DialogTitle>
          <DialogDescription>
            Quickly explore the full details, story, and specifications for {product.name}.
          </DialogDescription>
        </VisuallyHidden.Root>

        {/* Global Inner Layout with Fluid Scrolling Isolation */}
        <div className="grid grid-cols-1 md:grid-cols-12 max-h-[85vh] md:max-h-[75vh] overflow-y-auto md:overflow-hidden select-none">
          
          {/* Image Block Side - Takes 5 cols on desktop, responsive heights on mobile */}
          <div className="relative md:col-span-5 bg-zinc-50 dark:bg-zinc-900 aspect-[4/5] md:aspect-auto w-full h-[40vh] md:h-full min-h-[280px] md:min-h-[500px]">
            <img
              src={product.images[0]}
              alt={product.name}
              className="absolute inset-0 w-full h-full object-cover object-center"
              loading="eager"
            />
            
            {/* Overlaid Badges */}
            <div className="absolute top-4 left-4 flex flex-col gap-1.5 items-start z-10">
              {product.isNew && (
                <Badge className="bg-primary text-primary-foreground font-mono uppercase tracking-widest text-[9px] rounded px-2.5 py-0.5 border-none shadow-sm">
                  New In
                </Badge>
              )}
              {discount > 0 && (
                <Badge variant="destructive" className="font-mono text-[9px] uppercase tracking-widest rounded px-2.5 py-0.5 shadow-sm">
                  {discount}% OFF
                </Badge>
              )}
            </div>
          </div>

          {/* Product Form & Specification Side - Takes 7 cols on desktop */}
          <div className="p-6 md:p-8 md:col-span-7 flex flex-col justify-between overflow-y-auto h-full bg-background max-h-[55vh] md:max-h-[75vh]">
            
            {/* Animated Informational Flow Panel */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-6"
            >
              {/* Category Breadcrumb */}
              <motion.div variants={itemVariants} className="flex items-center gap-1.5">
                <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">
                  {product.category as any || "Apparel Studio"}
                </span>
                <span className="text-[8px] text-muted-foreground/50">•</span>
                <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">
                  {product.gender || "unisex"}
                </span>
              </motion.div>

              {/* Title Header */}
              <motion.div variants={itemVariants}>
                <a 
                  href={`/product/${product.slug}`} 
                  onClick={() => onOpenChange(false)}
                  className="group inline-block"
                >
                  <h2 className="text-xl md:text-3xl font-primary font-bold text-foreground tracking-tight group-hover:text-primary transition-colors leading-tight">
                    {product.name}
                  </h2>
                </a>
              </motion.div>

              {/* Price Details */}
              <motion.div variants={itemVariants} className="flex items-baseline gap-3 border-b border-border/60 pb-4">
                <span className="text-2xl font-bold text-foreground">
                  ₹{product.price.toLocaleString()}
                </span>
                {product.compareAtPrice && (
                  <span className="text-sm text-muted-foreground line-through decoration-muted-foreground/60">
                    ₹{product.compareAtPrice.toLocaleString()}
                  </span>
                )}
              </motion.div>

              {/* Main Editorial Copy */}
              <motion.div variants={itemVariants} className="space-y-4">
                {product.description && (
                  <p className="text-xs md:text-sm text-muted-foreground font-body leading-relaxed">
                    {product.description}
                  </p>
                )}
              </motion.div>

              {/* Curated Sourcing & Craftsmanship Specifications Block */}
              <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-border/40 pt-5">
                
                <div className="space-y-1">
                  <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest font-semibold flex items-center gap-1">
                    <Sparkles className="h-3 w-3 text-amber-500" /> Material & Craft
                  </span>
                  <p className="text-xs text-foreground/80 font-body leading-relaxed line-clamp-2">
                    70% Handcombed Cotton, 30% Silk-blend structural drapes.
                  </p>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest font-semibold flex items-center gap-1">
                    <HelpCircle className="h-3 w-3 text-blue-500" /> Silhouette Fit
                  </span>
                  <p className="text-xs text-foreground/80 font-body leading-relaxed line-clamp-2">
                    True to size fit. Structured shoulders and soft falling drapes.
                  </p>
                </div>

                <div className="space-y-1 sm:col-span-2 border-t border-border/40 pt-3">
                  <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest font-semibold flex items-center gap-1">
                    <Truck className="h-3 w-3 text-emerald-500" /> Delivery & Shipping
                  </span>
                  <p className="text-xs text-foreground/80 font-body leading-relaxed">
                    Complimentary dispatch across India. Delivered in 5-7 business days.
                  </p>
                </div>

              </motion.div>

              {/* Built-in Lifetime Authenticity Assurance */}
              <motion.div variants={itemVariants} className="flex items-center gap-2 bg-muted/40 border border-border/40 p-3 rounded-lg">
                <ShieldCheck className="h-4 w-4 text-primary shrink-0" />
                <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground leading-none">
                  Original Atlascub handloom heritage authenticity guaranteed.
                </span>
              </motion.div>

            </motion.div>

            {/* Bottom Primary Editorial CTA Action */}
            <div className="mt-8 pt-4 border-t border-border/60">
              <Button
                asChild
                className="w-full h-12 gap-2 text-xs font-mono uppercase tracking-widest font-bold shadow-md transition-all active:scale-[0.98] bg-primary text-primary-foreground hover:bg-primary/95"
                size="lg"
              >
                <a href={`/product/${product.slug}`} onClick={() => onOpenChange(false)}>
                  <Eye className="h-4 w-4" />
                  <span>Explore Design Details</span>
                  <ArrowRight className="h-4 w-4 ml-1 transition-transform duration-300 group-hover:translate-x-1" />
                </a>
              </Button>
            </div>

          </div>
        </div>

      </DialogContent>
    </Dialog>
  );
}