"use client";

import Link from "next/link";
import { Edit, Eye, EyeOff, Trash2, MoreHorizontal, Loader2, Layers, RotateCcw } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { AddToCollectionDialog } from "./add-to-collection-dialog";

interface ProductRowActionsProps {
  product: {
    id: string;
    name: string;
    slug: string;
    deletedAt?: string | null;
  };
  onHide: (id: string, name: string) => void;
  onRestore: (id: string, name: string) => void;  // Add restore prop
  onDelete: (id: string, name: string) => void;
  isDeleting: boolean;
}

export function ProductRowActions({ 
  product, 
  onHide, 
  onRestore,  // Add here
  onDelete, 
  isDeleting 
}: ProductRowActionsProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem asChild className="gap-2">
          <Link href={`/admin/products/${product.id}/edit`}>
            <Edit className="h-4 w-4" />
            Edit
          </Link>
        </DropdownMenuItem>
        
        <AddToCollectionDialog
          productId={product.id}
          productName={product.name}
          trigger={
            <DropdownMenuItem className="gap-2" onSelect={(e) => e.preventDefault()}>
              <Layers className="h-4 w-4" />
              Add to Collection
            </DropdownMenuItem>
          }
        />
        
        <DropdownMenuItem asChild className="gap-2">
          <Link href={`/product/${product.slug}`} target="_blank">
            <Eye className="h-4 w-4" />
            View on Store
          </Link>
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        
        {product.deletedAt ? (
          <DropdownMenuItem 
            className="gap-2 text-green-600"
            onClick={() => onRestore(product.id, product.name)}  // Use onRestore
            disabled={isDeleting}
          >
            {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <RotateCcw className="h-4 w-4" />}
            Restore to Store
          </DropdownMenuItem>
        ) : (
          <DropdownMenuItem 
            className="gap-2 text-amber-600"
            onClick={() => onHide(product.id, product.name)}
            disabled={isDeleting}
          >
            <EyeOff className="h-4 w-4" />
            Hide from Store
          </DropdownMenuItem>
        )}
        
        <DropdownMenuItem 
          className="gap-2 text-destructive"
          onClick={() => onDelete(product.id, product.name)}
          disabled={isDeleting}
        >
          <Trash2 className="h-4 w-4" />
          Delete Permanently
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}