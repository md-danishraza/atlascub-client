"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/shared/empty-state";
import { toast } from "sonner";
import {
  useGetCollectionByIdQuery,
  useRemoveProductFromCollectionMutation,
} from "@/lib/store/apis/collection-api";

export default function CollectionProductsPage() {
  const params = useParams();
  const id = params.id as string;

  const { data: collection, isLoading, refetch } = useGetCollectionByIdQuery(id);
  const [removeProduct, { isLoading: isRemoving }] = useRemoveProductFromCollectionMutation();

  const handleRemoveProduct = async (productId: string, productName: string) => {
    if (confirm(`Remove "${productName}" from this collection?`)) {
      try {
        await removeProduct({ collectionId: id, productId }).unwrap();
        toast.success("Product removed from collection");
        refetch();
      } catch (error) {
        toast.error("Failed to remove product");
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!collection) {
    return (
      <EmptyState
        title="Collection not found"
        description="The collection you're looking for doesn't exist."
      />
    );
  }

  const products = collection.products || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/admin/products">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="heading-md font-primary">{collection.name}</h1>
          <p className="text-muted-foreground">
            {products.length} products in this collection
          </p>
        </div>
      </div>

      {/* Products Table */}
      <Card>
        <CardHeader>
          <CardTitle>Products</CardTitle>
        </CardHeader>
        <CardContent>
          {products.length === 0 ? (
            <EmptyState
              title="No products in this collection"
              description="Add products from the main product list"
            />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Gender</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-20">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((product: any) => (
                  <TableRow key={product.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 overflow-hidden rounded-md bg-muted">
                          {product.images[0] ? (
                            <img
                              src={product.images[0]}
                              alt={product.name}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center text-xs">
                              No img
                            </div>
                          )}
                        </div>
                        <span className="line-clamp-1">{product.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>{product.category?.name || "Other"}</TableCell>
                    <TableCell className="capitalize">{product.gender}</TableCell>
                    <TableCell>₹{product.price.toLocaleString()}</TableCell>
                    <TableCell>
                      {product.inStock ? (
                        <Badge variant="outline" className="border-green-500 text-green-600">
                          In Stock
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="border-red-500 text-red-600">
                          Out of Stock
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveProduct(product.id, product.name)}
                        disabled={isRemoving}
                        className="text-destructive hover:text-destructive"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}