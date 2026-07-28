"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { productSchema, ProductFormData } from "@/lib/validations/product-schema";
import { ImageUploader } from "./image-uploader";
import { SizePicker } from "./size-picker";
import { ColorPicker } from "./color-picker";
import { CategorySelector } from "./category-selector";
import {
  useCreateProductMutation,
  useUpdateProductMutation,
} from "@/lib/store/apis/product-api";
import { TagsInput } from "./tags-input";

const genderOptions = ["men", "women", "kids"];

interface ProductFormProps {
  initialData?: any;
  isEditing?: boolean;
}

export function ProductForm({ initialData, isEditing = false }: ProductFormProps) {
  const router = useRouter();
  const [selectedGender, setSelectedGender] = useState(initialData?.gender || "men");
  const [images, setImages] = useState<string[]>(initialData?.images || []);
  const [sizes, setSizes] = useState<string[]>(initialData?.sizes || []);
  const [colors, setColors] = useState(initialData?.colors || []);
  const [tags, setTags] = useState<string[]>(initialData?.tags || []);

  const [createProduct, { isLoading: isCreating }] = useCreateProductMutation();
  const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();

  const isSubmitting = isCreating || isUpdating;

  // Get initial category slug from the category object
  const initialCategorySlug = initialData?.category?.slug || initialData?.category || "";

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      inStock: true,
      isNew: false,
      isBestSeller: false,
      inventory: 0,
      tags: initialData?.tags || [],
      gender: initialData?.gender || "men",
      // Override category with the slug from the category object
      category: initialCategorySlug,
      ...initialData,
    },
  });

  const watchInStock = watch("inStock");
  const watchIsNew = watch("isNew");
  const watchIsBestSeller = watch("isBestSeller");
  const watchCategory = watch("category");

  // Log for debugging
  console.log("Initial category slug:", initialCategorySlug);
  console.log("Watched category:", watchCategory);

  useEffect(() => {
    setValue("images", images);
  }, [images, setValue]);

  useEffect(() => {
    setValue("sizes", sizes);
  }, [sizes, setValue]);

  useEffect(() => {
    setValue("colors", colors);
  }, [colors, setValue]);

  useEffect(() => {
    setValue("tags", tags);
  }, [tags, setValue]);

  useEffect(() => {
    setValue("gender", selectedGender);
  }, [selectedGender, setValue]);

  const onSubmit = async (data: ProductFormData) => {
    try {
      if (isEditing && initialData) {
        await updateProduct({ id: initialData.id, data }).unwrap();
        toast.success("Product updated successfully!");
        router.push("/admin/products");
      } else {
        await createProduct(data).unwrap();
        toast.success("Product created successfully!");
        router.push("/admin/products");
      }
      router.refresh();
    } catch (error: any) {
      console.error("Failed to save product:", error);
      toast.error(error?.data?.message || "Failed to save product");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="grid gap-8 lg:grid-cols-2">
        {/* Left Column - Same as before */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="name">Product Name *</Label>
                <Input
                  id="name"
                  {...register("name")}
                  placeholder="Premium Linen Shirt"
                  disabled={isSubmitting}
                />
                {errors.name && (
                  <p className="text-xs text-destructive mt-1">{errors.name.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  {...register("description")}
                  rows={4}
                  placeholder="Detailed product description..."
                  disabled={isSubmitting}
                />
                {errors.description && (
                  <p className="text-xs text-destructive mt-1">{errors.description.message}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="price">Price (₹) *</Label>
                  <Input
                    id="price"
                    type="number"
                    step="1"
                    {...register("price", { valueAsNumber: true })}
                    placeholder="2999"
                    disabled={isSubmitting}
                  />
                  {errors.price && (
                    <p className="text-xs text-destructive mt-1">{errors.price.message}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="compareAtPrice">Compare at Price (₹)</Label>
                  <Input
                    id="compareAtPrice"
                    type="number"
                    step="1"
                    {...register("compareAtPrice", { valueAsNumber: true })}
                    placeholder="4999"
                    disabled={isSubmitting}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Images</CardTitle>
            </CardHeader>
            <CardContent>
              <ImageUploader
                images={images}
                onChange={setImages}
                error={errors.images?.message}
              />
            </CardContent>
          </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Sizes & Colors</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <SizePicker
                selectedSizes={sizes}
                onChange={setSizes}
                error={errors.sizes?.message}
              />
              <ColorPicker
                colors={colors}
                onChange={setColors}
                error={errors.colors?.message}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Category & Inventory</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Gender Selection */}
              <div>
                <Label htmlFor="gender">Gender *</Label>
                <Select
                  value={selectedGender}
                  onValueChange={(value) => {
                    setSelectedGender(value);
                    setValue("gender", value);
                    // Reset category when gender changes
                    setValue("category", "");
                  }}
                  disabled={isSubmitting}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    {genderOptions.map((g) => (
                      <SelectItem key={g} value={g}>
                        {g.charAt(0).toUpperCase() + g.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.gender && (
                  <p className="text-xs text-destructive mt-1">{errors.gender.message}</p>
                )}
              </div>

              {/* Category Selection */}
              <div>
                <Label htmlFor="category">Category *</Label>
                <CategorySelector
                  gender={selectedGender}
                  value={watchCategory || ""}
                  onChange={(value) => setValue("category", value)}
                  disabled={isSubmitting || !selectedGender}
                  error={errors.category?.message}
                />
                {!selectedGender && (
                  <p className="text-xs text-muted-foreground mt-1">Please select a gender first</p>
                )}
              </div>

              {/* Inventory */}
              <div>
                <Label htmlFor="inventory">Inventory Count *</Label>
                <Input
                  id="inventory"
                  type="number"
                  {...register("inventory", { valueAsNumber: true })}
                  disabled={isSubmitting}
                />
                {errors.inventory && (
                  <p className="text-xs text-destructive mt-1">{errors.inventory.message}</p>
                )}
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="inStock">In Stock</Label>
                <Switch
                  id="inStock"
                  checked={watchInStock}
                  onCheckedChange={(checked) => setValue("inStock", checked)}
                  disabled={isSubmitting}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="isNew">New Arrival</Label>
                <Switch
                  id="isNew"
                  checked={watchIsNew}
                  onCheckedChange={(checked) => setValue("isNew", checked)}
                  disabled={isSubmitting}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="isBestSeller">Best Seller</Label>
                <Switch
                  id="isBestSeller"
                  checked={watchIsBestSeller}
                  onCheckedChange={(checked) => setValue("isBestSeller", checked)}
                  disabled={isSubmitting}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Additional Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
               {/* Tags Input */}
              <div>
                <Label htmlFor="tags">Tags (for search)</Label>
                <TagsInput
                  value={tags}
                  onChange={setTags}
                  placeholder="e.g., linen, summer, premium, cotton"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Tags help customers find products through search
                </p>
              </div>
              <div>
                <Label htmlFor="details">Product Details</Label>
                <Textarea
                  id="details"
                  {...register("details")}
                  rows={3}
                  placeholder="Fabric composition, care instructions, features..."
                  disabled={isSubmitting}
                />
              </div>
              <div>
                <Label htmlFor="sizing">Sizing Information</Label>
                <Textarea
                  id="sizing"
                  {...register("sizing")}
                  rows={3}
                  placeholder="Fit guide, model measurements..."
                  disabled={isSubmitting}
                />
              </div>
              <div>
                <Label htmlFor="shipping">Shipping Information</Label>
                <Textarea
                  id="shipping"
                  {...register("shipping")}
                  rows={3}
                  placeholder="Delivery time, return policy..."
                  disabled={isSubmitting}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="mt-8 flex justify-end gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/admin/products")}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {isEditing ? "Updating..." : "Creating..."}
            </>
          ) : (
            <>{isEditing ? "Update Product" : "Create Product"}</>
          )}
        </Button>
      </div>
    </form>
  );
}