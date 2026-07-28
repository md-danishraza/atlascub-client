"use client";

import { useState, useCallback } from "react";
import { Image as ImageIcon, X, Upload, Loader2, Plus } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { cloudinaryConfig } from "@/lib/cloudinary";
import { Progress } from "@/components/ui/progress";

interface ImageUploaderProps {
  images: string[];
  onChange: (images: string[]) => void;
  error?: string;
  maxImages?: number;
}

export function ImageUploader({ 
  images, 
  onChange, 
  error, 
  maxImages = 10 
}: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const uploadToCloudinary = useCallback(async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", cloudinaryConfig.uploadPreset);
    formData.append("folder", cloudinaryConfig.folder);
  
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      
      xhr.onload = async () => {
        if (xhr.status === 200) {
          const response = JSON.parse(xhr.responseText);
          const url = response.secure_url;
          
          // Report to backend for tracking
          await fetch(`${process.env.NEXT_PUBLIC_API_URL}/uploads/track`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ url }),
          });
          
          resolve(url);
        } else {
          reject(new Error("Upload failed"));
        }
      };
      
      xhr.onerror = () => reject(new Error("Upload failed"));
      xhr.open("POST", `https://api.cloudinary.com/v1_1/${cloudinaryConfig.cloudName}/image/upload`);
      xhr.send(formData);
    });
  }, []);

  const handleUpload = useCallback(async (files: FileList | File[]) => {
    const fileArray = Array.from(files);
    const remainingSlots = maxImages - images.length;
    
    if (remainingSlots <= 0) {
      alert(`Maximum ${maxImages} images allowed`);
      return;
    }
    
    const filesToUpload = fileArray.slice(0, remainingSlots);
    setUploading(true);
    
    const newUrls: string[] = [];
    
    for (const file of filesToUpload) {
      if (!file.type.startsWith("image/")) continue;
      try {
        const url = await uploadToCloudinary(file);
        newUrls.push(url);
      } catch (error) {
        console.error("Upload failed:", file.name, error);
      }
    }
    
    onChange([...images, ...newUrls]);
    setUploading(false);
  }, [images, onChange, maxImages, uploadToCloudinary]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files.length) handleUpload(files);
  }, [handleUpload]);

  const removeImage = (indexToRemove: number) => {
    const newImages = images.filter((_, index) => index !== indexToRemove);
    onChange(newImages);
  };

  const reorderImages = (fromIndex: number, toIndex: number) => {
    const newImages = [...images];
    const [moved] = newImages.splice(fromIndex, 1);
    newImages.splice(toIndex, 0, moved);
    onChange(newImages);
  };

  return (
    <div className="space-y-3">
      <label className="text-sm font-medium">
        Product Images ({images.length}/{maxImages}) *
      </label>
      
      {/* Upload Area */}
      {images.length < maxImages && (
        <div
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          className="flex min-h-[120px] cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-border bg-muted/30 transition-colors hover:border-primary"
          onClick={() => document.getElementById("image-upload")?.click()}
        >
          <input
            id="image-upload"
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => {
              if (e.target.files?.length) handleUpload(e.target.files);
            }}
          />
          
          {uploading ? (
            <div className="flex flex-col items-center gap-2 py-6 w-full px-4">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">Uploading...</p>
              <Progress value={uploadProgress} className="w-full max-w-xs" />
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2 py-6">
              <Upload className="h-8 w-8 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                Drag & drop or click to upload
              </p>
              <p className="text-xs text-muted-foreground">
                PNG, JPG, WEBP up to 5MB. Max {maxImages} images.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Image Preview Grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {images.map((url, index) => (
            <div
              key={index}
              className="group relative aspect-square rounded-md border overflow-hidden bg-muted cursor-move"
              draggable
              onDragStart={(e) => {
                e.dataTransfer.setData("text/plain", String(index));
                e.dataTransfer.effectAllowed = "move";
              }}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                const fromIndex = parseInt(e.dataTransfer.getData("text/plain"));
                if (!isNaN(fromIndex) && fromIndex !== index) {
                  reorderImages(fromIndex, index);
                }
              }}
            >
              <Image
                src={url}
                alt={`Product image ${index + 1}`}
                fill
                className="object-cover"
              />
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute -right-1 -top-1 rounded-full bg-destructive p-1 text-white opacity-0 transition-opacity group-hover:opacity-100"
              >
                <X className="h-3 w-3" />
              </button>
              <div className="absolute bottom-1 left-1 rounded bg-black/50 px-1 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100">
                {index + 1}
              </div>
            </div>
          ))}
        </div>
      )}
      
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}