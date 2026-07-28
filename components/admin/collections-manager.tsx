"use client";

import { useState } from "react";
import { Plus, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import { toast } from "sonner";

import {
  useGetCollectionsQuery,
  useCreateCollectionMutation,
  useUpdateCollectionMutation,
  useDeleteCollectionMutation,
} from "@/lib/store/apis/collection-api";
import { CollectionForm } from "../collections/collection-form";
import { CollectionCard } from "../collections/collection-card";

export function CollectionsManager() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingCollection, setEditingCollection] = useState<any>(null);
  const [deleteTarget, setDeleteTarget] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    type: "campaign",
    badge: "",
    image: "",
  });

  const { data: collections, isLoading, refetch } = useGetCollectionsQuery();
  const [createCollection, { isLoading: isCreating }] = useCreateCollectionMutation();
  const [updateCollection, { isLoading: isUpdating }] = useUpdateCollectionMutation();
  const [deleteCollection, { isLoading: isDeleting }] = useDeleteCollectionMutation();

  const resetForm = () => {
    setFormData({
      name: "",
      slug: "",
      description: "",
      type: "campaign",
      badge: "",
      image: "",
    });
  };

  const handleCreate = async () => {
    if (!formData.name) {
      toast.error("Collection name is required");
      return;
    }

    try {
      await createCollection(formData).unwrap();
      toast.success("Collection created successfully");
      setIsCreateOpen(false);
      resetForm();
      refetch();
    } catch (error) {
      toast.error("Failed to create collection");
    }
  };

  const handleUpdate = async () => {
    if (!editingCollection) return;

    try {
      await updateCollection({
        id: editingCollection.id,
        data: formData,
      }).unwrap();
      toast.success("Collection updated successfully");
      setEditingCollection(null);
      resetForm();
      refetch();
    } catch (error) {
      toast.error("Failed to update collection");
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;

    try {
      await deleteCollection(deleteTarget.id).unwrap();
      toast.success("Collection deleted successfully");
      setDeleteTarget(null);
      refetch();
    } catch (error) {
      toast.error("Failed to delete collection");
    }
  };

  const openEditDialog = (collection: any) => {
    setEditingCollection(collection);
    setFormData({
      name: collection.name,
      slug: collection.slug,
      description: collection.description || "",
      type: collection.type || "campaign",
      badge: collection.badge || "",
      image: collection.image || "",
    });
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Collections</CardTitle>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="gap-2">
              <Plus className="h-4 w-4" />
              New Collection
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Collection</DialogTitle>
            </DialogHeader>
            <CollectionForm
              isEditing={false}
              formData={formData}
              setFormData={setFormData}
              onSubmit={handleCreate}
              onCancel={() => {
                setIsCreateOpen(false);
                resetForm();
              }}
              isLoading={isCreating}
            />
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        ) : collections?.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No collections yet</p>
            <Button variant="link" onClick={() => setIsCreateOpen(true)} className="mt-2">
              Create your first collection
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {collections?.map((collection) => (
              <CollectionCard
                key={collection.id}
                collection={collection}
                onEdit={openEditDialog}
                onDelete={setDeleteTarget}
              />
            ))}
          </div>
        )}
      </CardContent>

      {/* Edit Dialog */}
      <Dialog open={!!editingCollection} onOpenChange={() => setEditingCollection(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Collection</DialogTitle>
          </DialogHeader>
          <CollectionForm
            initialData={editingCollection}
            isEditing={true}
            formData={formData}
            setFormData={setFormData}
            onSubmit={handleUpdate}
            onCancel={() => {
              setEditingCollection(null);
              resetForm();
            }}
            isLoading={isUpdating}
          />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Collection</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{deleteTarget?.name}"?
              <br />
              <br />
              This will only remove the collection, not the products themselves.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive">
              {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
}