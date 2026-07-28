"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ProductRowActions } from "./products-row-actions";
import { Product } from "@/lib/store/apis/product-api";

interface ProductsTableProps {
  products: Product[];
  onHide: (id: string, name: string) => void;
  onRestore: (id: string, name: string) => void;  // Add this
  onDelete: (id: string, name: string) => void;
  isDeleting: boolean;
}

export function ProductsTable({ 
  products, 
  onHide, 
  onRestore,  // Add here
  onDelete, 
  isDeleting 
}: ProductsTableProps) {
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[300px]">Product</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Gender</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Inventory</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="w-20">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product) => (
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
                      <div className="flex h-full w-full items-center justify-center text-xs text-muted-foreground">
                        No img
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="line-clamp-1 font-medium">{product.name}</p>
                    <p className="text-xs text-muted-foreground">{product.slug}</p>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <Badge variant="outline">
                  {product.category?.name || 'Other'}
                </Badge>
              </TableCell>
              <TableCell className="capitalize">{product.gender}</TableCell>
              <TableCell>₹{product.price.toLocaleString()}</TableCell>
              <TableCell>
                <span className={product.inventory <= 5 ? "text-orange-600" : "text-green-600"}>
                  {product.inventory} units
                </span>
              </TableCell>
              <TableCell>
                <div className="flex flex-wrap gap-1">
                  <Badge variant="outline" className={product.inStock ? "border-green-500 text-green-600" : "border-red-500 text-red-600"}>
                    {product.inStock ? "In Stock" : "Out of Stock"}
                  </Badge>
                  {product.isNew && (
                    <Badge variant="secondary" className="bg-blue-100 text-blue-700">New</Badge>
                  )}
                  {product.isBestSeller && (
                    <Badge variant="secondary" className="bg-amber-100 text-amber-700">Bestseller</Badge>
                  )}
                  {product.deletedAt && (
                    <Badge variant="outline" className="border-gray-500 text-gray-500">Hidden</Badge>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <ProductRowActions
                  product={product}
                  onHide={onHide}
                  onRestore={onRestore}
                  onDelete={onDelete}
                  isDeleting={isDeleting}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}