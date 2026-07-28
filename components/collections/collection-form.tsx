"use client";

import { useEffect } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CollectionImageUploader } from "./collection-image-uploader";

const collectionTypes = [
  { value: "festival", label: "Festival" },
  { value: "campaign", label: "Campaign" },
  { value: "season", label: "Season" },
  { value: "sale", label: "Sale" },
];

interface CollectionFormProps {
  initialData?: any;
  isEditing: boolean;
  formData: {
    name: string;
    slug: string;
    description: string;
    type: string;
    badge: string;
    image: string;
  };
  setFormData: (data: any) => void;
  onSubmit: () => void;
  onCancel: () => void;
  isLoading: boolean;
}

export function CollectionForm({
  initialData,
  isEditing,
  formData,
  setFormData,
  onSubmit,
  onCancel,
  isLoading,
}: CollectionFormProps) {
  const generateSlug = (name: string) => {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  };

  useEffect(() => {
    if (initialData && isEditing) {
      setFormData({
        name: initialData.name,
        slug: initialData.slug,
        description: initialData.description || "",
        type: initialData.type || "campaign",
        badge: initialData.badge || "",
        image: initialData.image || "",
      });
    }
  }, [initialData, isEditing, setFormData]);

  return (
    <div className="space-y-6 py-4">
      <CollectionImageUploader
        image={formData.image}
        onChange={(url) => setFormData({ ...formData, image: url })}
      />

      <div>
        <Label htmlFor="name">Collection Name *</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ 
            ...formData, 
            name: e.target.value,
            slug: generateSlug(e.target.value) 
          })}
          placeholder="Summer Collection 2026"
        />
      </div>

      <div>
        <Label htmlFor="slug">Slug (URL)</Label>
        <Input
          id="slug"
          value={formData.slug}
          onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
          placeholder="summer-2026"
        />
        <p className="text-xs text-muted-foreground mt-1">/collections/{formData.slug || "..."}</p>
      </div>

      <div>
        <Label htmlFor="type">Collection Type</Label>
        <Select 
          value={formData.type} 
          onValueChange={(value) => setFormData({ ...formData, type: value })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {collectionTypes.map((type) => (
              <SelectItem key={type.value} value={type.value}>
                {type.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="badge">Badge (Optional)</Label>
        <Input
          id="badge"
          value={formData.badge}
          onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
          placeholder="New, Limited, Sale"
        />
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Collection description..."
          rows={3}
        />
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={onSubmit} disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {isEditing ? "Saving..." : "Creating..."}
            </>
          ) : (
            <>{isEditing ? "Save Changes" : "Create Collection"}</>
          )}
        </Button>
      </div>
    </div>
  );
}