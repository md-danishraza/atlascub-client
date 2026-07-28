"use client";

import Link from "next/link";
import Image from "next/image";
import { Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Collection } from "@/lib/store/apis/collection-api";

interface CollectionCardProps {
  collection: Collection;
  onEdit: (collection: Collection) => void;
  onDelete: (collection: Collection) => void;
}

export function CollectionCard({ collection, onEdit, onDelete }: CollectionCardProps) {
  return (
    <div className="group rounded-lg border border-border bg-card overflow-hidden hover:border-primary transition-all">
      {/* Clickable Image Section - Navigates to collection products */}
      <Link href={`/admin/products/collections/${collection.id}`}>
        <div className="relative aspect-video overflow-hidden bg-muted">
          {collection.image ? (
            <Image
              src={collection.image}
              alt={collection.name}
              fill
              className="object-cover transition-transform group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-gradient-to-br from-primary/10 to-secondary/10">
              <span className="text-4xl">📁</span>
            </div>
          )}
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <span className="text-white text-sm font-medium">View Products →</span>
          </div>
        </div>
      </Link>

      {/* Content Section */}
      <div className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <Link href={`/admin/products/collections/${collection.id}`}>
              <h3 className="font-semibold text-foreground hover:text-primary transition-colors">
                {collection.name}
              </h3>
            </Link>
            {collection.badge && (
              <Badge variant="secondary" className="mt-1 text-xs">
                {collection.badge}
              </Badge>
            )}
            {collection.description && (
              <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                {collection.description}
              </p>
            )}
            <p className="text-xs text-muted-foreground mt-2 font-mono">
              /collections/{collection.slug}
            </p>
          </div>
          <div className="flex gap-1 ml-2">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={(e) => {
                e.preventDefault();
                onEdit(collection);
              }}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-destructive hover:text-destructive"
              onClick={(e) => {
                e.preventDefault();
                onDelete(collection);
              }}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}