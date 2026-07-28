// ============================================================================
// 📦 INLINE PRODUCT CARD SUB-COMPONENT

import { useGetProductByIdQuery } from "@/lib/store/apis/product-api";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

// ============================================================================
interface InlineProductCardProps {
    productId: string;
  }
  
  
export function InlineProductCard({ productId }: InlineProductCardProps) {
    const { data: product, isLoading: loading } = useGetProductByIdQuery(productId);
  
    if (loading) {
      return (
        <div className="flex items-center gap-3 p-2 rounded-lg border border-border/50 bg-muted/20 animate-pulse">
          <div className="h-10 w-10 bg-muted rounded" />
          <div className="flex-1 space-y-2">
            <div className="h-3 bg-muted rounded w-2/3" />
            <div className="h-2 bg-muted rounded w-1/3" />
          </div>
        </div>
      );
    }
  
    if (!product) return null;
  
    return (
      <motion.div 
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        className="group flex items-center justify-between gap-3 p-2.5 rounded-xl border border-border/60 bg-card hover:bg-muted/10 transition-colors shadow-2xs hover:shadow-sm"
      >
        <div className="flex items-center gap-3 min-w-0">
          <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-md border bg-muted">
            <img 
              src={product.images?.[0] || "/images/placeholder.jpg"} 
              alt={product.name} 
              className="h-full w-full object-cover transition-transform group-hover:scale-105"
            />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold text-foreground truncate">{product.name}</p>
            <p className="text-[11px] text-muted-foreground mt-0.5">₹{product.price?.toLocaleString('en-IN')}</p>
          </div>
        </div>
        
        <a 
          href={`/product/${product.slug}`}
          className="h-8 w-8 rounded-full bg-primary/10 hover:bg-primary hover:text-white transition-all flex items-center justify-center shrink-0"
          title="View Garment Details"
        >
          <ArrowRight className="h-4 w-4" />
        </a>
      </motion.div>
    );
  }