"use client";

import { useState } from "react";
import { Plus, Loader2, Edit, Trash2, MoreHorizontal } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import {
  useGetCategoriesQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
} from "@/lib/store/apis/category-api";

interface CategorySelectorProps {
  gender: string;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  error?: string;
}

export function CategorySelector({ gender, value, onChange, disabled, error }: CategorySelectorProps) {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<any>(null);
  const [deleteTarget, setDeleteTarget] = useState<any>(null);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategorySlug, setNewCategorySlug] = useState("");
  const [newCategoryDesc, setNewCategoryDesc] = useState("");
  
  const { data: categories, isLoading, refetch } = useGetCategoriesQuery(gender);
  const [createCategory, { isLoading: isCreating }] = useCreateCategoryMutation();
  const [updateCategory, { isLoading: isUpdating }] = useUpdateCategoryMutation();
  const [deleteCategory, { isLoading: isDeleting }] = useDeleteCategoryMutation();

  const handleCreateCategory = async () => {
    if (!newCategoryName) {
      toast.error("Category name is required");
      return;
    }
    
    const slug = newCategorySlug || newCategoryName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    
    try {
      await createCategory({
        name: newCategoryName,
        slug,
        gender,
        description: newCategoryDesc,
      }).unwrap();
      
      toast.success(`Category "${newCategoryName}" created successfully`);
      setIsCreateDialogOpen(false);
      refetch();
      onChange(slug);
      
      setNewCategoryName("");
      setNewCategorySlug("");
      setNewCategoryDesc("");
    } catch (error) {
      toast.error("Failed to create category");
    }
  };

  const handleEditCategory = async () => {
    if (!selectedCategory) return;
    if (!newCategoryName) {
      toast.error("Category name is required");
      return;
    }
    
    const updateData: any = {
      name: newCategoryName,
      description: newCategoryDesc,
    };
    
    // Only update slug if explicitly changed (with warning)
    if (newCategorySlug !== selectedCategory.slug) {
      if (!confirm(`Changing slug from "${selectedCategory.slug}" to "${newCategorySlug}" will break existing product URLs. Continue?`)) {
        return;
      }
      updateData.slug = newCategorySlug;
    }
    
    try {
      await updateCategory({ id: selectedCategory.id, data: updateData }).unwrap();
      toast.success(`Category updated successfully`);
      setIsEditDialogOpen(false);
      refetch();
      
      // If current selected category was edited, update the selected value
      if (value === selectedCategory.slug) {
        onChange(newCategorySlug);
      }
    } catch (error) {
      toast.error("Failed to update category");
    }
  };

  const handleDeleteCategory = async () => {
    if (!deleteTarget) return;
    
    try {
      await deleteCategory(deleteTarget.id).unwrap();
      toast.success(`Category "${deleteTarget.name}" deleted. Products moved to "Other".`);
      setIsEditDialogOpen(false);
      setDeleteTarget(null);
      refetch();
      
      // If current selected category was deleted, reset selection
      if (value === deleteTarget.slug) {
        onChange("");
      }
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to delete category");
    }
  };

  const openEditDialog = (category: any) => {
    setSelectedCategory(category);
    setNewCategoryName(category.name);
    setNewCategorySlug(category.slug);
    setNewCategoryDesc(category.description || "");
    setIsEditDialogOpen(true);
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <div className="flex-1">
          <Select value={value} onValueChange={onChange} disabled={disabled || isLoading}>
            <SelectTrigger className={error ? "border-destructive" : ""}>
              <SelectValue placeholder={isLoading ? "Loading categories..." : "Select category"} />
            </SelectTrigger>
            <SelectContent>
              {categories?.map((cat) => (
                <div key={cat.id} className="flex items-center justify-between">
                  <SelectItem value={cat.slug} className="flex-1">
                    {cat.name}
                  </SelectItem>
                  <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                    <button
                      className="p-1 hover:bg-muted rounded"
                      onClick={() => openEditDialog(cat)}
                    >
                      <Edit className="h-3 w-3" />
                    </button>
                    <button
                      className="p-1 hover:bg-destructive/10 rounded text-destructive"
                      onClick={() => setDeleteTarget(cat)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              ))}
            </SelectContent>
          </Select>
          {error && <p className="text-xs text-destructive mt-1">{error}</p>}
        </div>
        
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button type="button" variant="outline" size="icon" disabled={disabled}>
              <Plus className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Category</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div>
                <Label htmlFor="cat-name">Category Name *</Label>
                <Input
                  id="cat-name"
                  placeholder="e.g., Denim Jackets"
                  value={newCategoryName}
                  onChange={(e) => {
                    setNewCategoryName(e.target.value);
                    setNewCategorySlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-'));
                  }}
                />
              </div>
              <div>
                <Label htmlFor="cat-slug">Slug (URL friendly)</Label>
                <Input
                  id="cat-slug"
                  placeholder="denim-jackets"
                  value={newCategorySlug}
                  onChange={(e) => setNewCategorySlug(e.target.value)}
                />
                <p className="text-xs text-muted-foreground mt-1">Used in URL: /shop/{gender}/[slug]</p>
              </div>
              <div>
                <Label htmlFor="cat-desc">Description (Optional)</Label>
                <Input
                  id="cat-desc"
                  placeholder="Brief description of this category"
                  value={newCategoryDesc}
                  onChange={(e) => setNewCategoryDesc(e.target.value)}
                />
              </div>
              <Button onClick={handleCreateCategory} disabled={isCreating} className="w-full">
                {isCreating ? <Loader2 className="h-4 w-4 animate-spin" /> : "Create Category"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Edit Category Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Category</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="edit-name">Category Name *</Label>
              <Input
                id="edit-name"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="edit-slug">Slug (URL friendly)</Label>
              <Input
                id="edit-slug"
                value={newCategorySlug}
                onChange={(e) => setNewCategorySlug(e.target.value)}
              />
              <p className="text-xs text-amber-600 mt-1">
                ⚠️ Changing slug will break existing product URLs
              </p>
            </div>
            <div>
              <Label htmlFor="edit-desc">Description</Label>
              <Input
                id="edit-desc"
                value={newCategoryDesc}
                onChange={(e) => setNewCategoryDesc(e.target.value)}
              />
            </div>
            <Button onClick={handleEditCategory} disabled={isUpdating} className="w-full">
              {isUpdating ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save Changes"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Category</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{deleteTarget?.name}"?
              <br />
              <br />
              <strong>This will:</strong>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Move all products in this category to "Other"</li>
                <li>Remove this category from the selection list</li>
              </ul>
              <br />
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteCategory} className="bg-destructive text-destructive-foreground">
              {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Delete Category"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}