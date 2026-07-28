"use client";

import { useState, useCallback } from "react";
import { Image as ImageIcon, X, Upload, Loader2 } from "lucide-react";
import Image from "next/image";
import { cloudinaryConfig } from "@/lib/cloudinary";
import { Progress } from "@/components/ui/progress";

interface CollectionImageUploaderProps {
  image: string;
  onChange: (url: string) => void;
  error?: string;
}

export function CollectionImageUploader({ image, onChange, error }: CollectionImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const uploadToCloudinary = useCallback(async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", cloudinaryConfig.uploadPreset);
    formData.append("folder", `${cloudinaryConfig.folder}/collections`);

    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      
      xhr.upload.addEventListener("progress", (e) => {
        if (e.lengthComputable) {
          setUploadProgress(Math.round((e.loaded / e.total) * 100));
        }
      });
      
      xhr.onload = async () => {
        if (xhr.status === 200) {
          const response = JSON.parse(xhr.responseText);
          const url = response.secure_url;
          
          // Track upload for orphan cleanup
          await fetch(`${process.env.NEXT_PUBLIC_API_URL}/uploads/track`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ url }),
          });
          
          resolve(url);
        } else {
          reject(new Error("Upload failed"));
        }
        setUploadProgress(0);
      };
      
      xhr.onerror = () => reject(new Error("Upload failed"));
      xhr.open("POST", `https://api.cloudinary.com/v1_1/${cloudinaryConfig.cloudName}/image/upload`);
      xhr.send(formData);
    });
  }, []);

  const handleUpload = useCallback(async (file: File) => {
    if (!file.type.startsWith("image/")) return;
    
    setUploading(true);
    try {
      const url = await uploadToCloudinary(file);
      onChange(url);
    } catch (error) {
      console.error("Upload failed:", error);
    } finally {
      setUploading(false);
    }
  }, [uploadToCloudinary, onChange]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleUpload(file);
  }, [handleUpload]);

  const removeImage = () => {
    onChange("");
  };

  return (
    <div className="space-y-3">
      <label className="text-sm font-medium">Collection Image</label>
      
      {image ? (
        <div className="group relative aspect-video overflow-hidden rounded-lg border border-border bg-muted">
          <Image
            src={image}
            alt="Collection"
            fill
            className="object-cover"
          />
          <button
            type="button"
            onClick={removeImage}
            className="absolute right-2 top-2 rounded-full bg-destructive p-1 text-white opacity-0 transition-opacity group-hover:opacity-100"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <div
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          className="flex min-h-[160px] cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-border bg-muted/30 transition-colors hover:border-primary"
          onClick={() => document.getElementById("collection-image-upload")?.click()}
        >
          <input
            id="collection-image-upload"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              if (e.target.files?.[0]) handleUpload(e.target.files[0]);
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
              <p className="text-sm text-muted-foreground">Click or drag to upload collection image</p>
              <p className="text-xs text-muted-foreground">PNG, JPG, WEBP up to 5MB</p>
            </div>
          )}
        </div>
      )}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}