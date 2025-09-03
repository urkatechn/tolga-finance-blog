"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { Upload, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ImageUploadDialogProps {
  onImageInsert: (imageUrl: string, altText: string) => void;
  children?: React.ReactNode;
}

export function ImageUploadDialog({ onImageInsert, children }: ImageUploadDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [altText, setAltText] = useState("");
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // In a real app, you would upload the file to your storage service
    // For now, we'll just create a local object URL
    setIsUploading(true);
    
    // Simulate upload delay
    setTimeout(() => {
      const objectUrl = URL.createObjectURL(file);
      setUploadedImage(objectUrl);
      setImageUrl(objectUrl); // In real app, this would be the CDN URL
      setAltText(file.name.split(".")[0].replace(/_/g, " "));
      setIsUploading(false);
    }, 1000);
  };

  const handleInsert = () => {
    if (imageUrl) {
      onImageInsert(imageUrl, altText || "Image");
      resetForm();
      setIsOpen(false);
    }
  };

  const resetForm = () => {
    setImageUrl("");
    setAltText("");
    setUploadedImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button variant="outline" size="sm">
            <Upload className="mr-2 h-4 w-4" />
            Upload Image
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Insert Image</DialogTitle>
          <DialogDescription>
            Upload an image or provide an image URL to insert into your post.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="image-upload">Upload Image</Label>
            <Input
              id="image-upload"
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleFileChange}
              disabled={isUploading}
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="image-url">Image URL</Label>
            <Input
              id="image-url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://example.com/image.jpg"
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="alt-text">Alt Text</Label>
            <Input
              id="alt-text"
              value={altText}
              onChange={(e) => setAltText(e.target.value)}
              placeholder="Descriptive text for the image"
            />
          </div>
          
          {uploadedImage && (
            <div className="relative mt-2">
              <div className="relative aspect-video overflow-hidden rounded-md border">
                <Image 
                  src={uploadedImage} 
                  alt={altText || "Uploaded image preview"} 
                  fill
                  className="object-cover"
                />
                <Button
                  size="icon"
                  variant="destructive"
                  className="absolute right-2 top-2 h-6 w-6"
                  onClick={() => {
                    setUploadedImage(null);
                    setImageUrl("");
                    if (fileInputRef.current) {
                      fileInputRef.current.value = "";
                    }
                  }}
                >
                  <X className="h-4 w-4" />
                  <span className="sr-only">Remove image</span>
                </Button>
              </div>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleInsert} disabled={!imageUrl}>
            Insert Image
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
