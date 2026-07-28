"use client";

import { useState } from "react";
import { Layers, Loader2, Check } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  useGetCollectionsQuery,
  useAddProductToCollectionMutation,
} from "@/lib/store/apis/collection-api";

interface AddToCollectionDialogProps {
  productId: string;
  productName: string;
  trigger?: React.ReactNode;
}

export function AddToCollectionDialog({ productId, productName, trigger }: AddToCollectionDialogProps) {
  const [open, setOpen] = useState(false);
  const { data: collections, isLoading } = useGetCollectionsQuery();
  const [addToCollection, { isLoading: isAdding }] = useAddProductToCollectionMutation();

  const handleAdd = async (collectionId: string) => {
    try {
      await addToCollection({ collectionId, productId }).unwrap();
      toast.success(`Added "${productName}" to collection`);
      setOpen(false);
    } catch (error) {
      toast.error("Failed to add to collection");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="ghost" size="sm" className="gap-2 w-full justify-start">
            <Layers className="h-4 w-4" />
            Add to Collection
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add to Collection</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <p className="text-sm text-muted-foreground mb-4">
            Select a collection for "{productName}"
          </p>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
          ) : collections?.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-sm text-muted-foreground">No collections yet</p>
              <Button variant="link" size="sm" asChild className="mt-2">
                <a href="/admin/collections">Create a collection</a>
              </Button>
            </div>
          ) : (
            <ScrollArea className="h-64">
              <div className="space-y-2">
                {collections?.map((collection) => (
                  <button
                    key={collection.id}
                    onClick={() => handleAdd(collection.id)}
                    disabled={isAdding}
                    className="w-full flex items-center justify-between p-3 rounded-lg border border-border hover:border-primary transition-colors text-left"
                  >
                    <div>
                      <p className="font-medium">{collection.name}</p>
                      {collection.description && (
                        <p className="text-xs text-muted-foreground line-clamp-1">
                          {collection.description}
                        </p>
                      )}
                    </div>
                    {collection.badge && (
                      <Badge variant="outline" className="text-xs">
                        {collection.badge}
                      </Badge>
                    )}
                  </button>
                ))}
              </div>
            </ScrollArea>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}