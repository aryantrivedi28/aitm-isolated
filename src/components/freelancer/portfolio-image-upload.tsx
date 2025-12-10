"use client"

import type React from "react"
import { useRef } from "react"
import { Upload, Loader2, Trash2, ImageIcon } from "lucide-react"
import { Button } from "@/components/ui/button"

interface PortfolioImageUploadProps {
  itemId: string
  imageUrl: string
  imagePath?: string
  isUploading: boolean
  onUpload: (itemId: string, file: File) => void
  onDelete: (itemId: string, imagePath: string) => void
  accentColor: string
  bgColor: string
}

export function ImageUpload({
  itemId,
  imageUrl,
  imagePath,
  isUploading,
  onUpload,
  onDelete,
  accentColor,
  bgColor,
}: PortfolioImageUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      onUpload(itemId, file)
    }
    // Reset input so same file can be selected again
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  return (
    <div className="md:col-span-2">
      <label className="block text-xs font-medium mb-1" style={{ color: "#241C15" }}>
        Project Screenshot
      </label>
      <div
        className="border-2 border-dashed rounded-lg p-4 transition-colors"
        style={{ borderColor: accentColor, backgroundColor: bgColor }}
      >
        {imageUrl ? (
          <div className="flex items-center space-x-4">
            <div className="relative">
              <img
                src={imageUrl || "/placeholder.svg"}
                alt="Portfolio screenshot"
                className="w-24 h-24 object-cover rounded-lg border-2"
                style={{ borderColor: accentColor }}
              />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium mb-2" style={{ color: "#241C15" }}>
                Image uploaded successfully
              </p>
              <div className="flex space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  className="text-xs"
                  style={{ borderColor: accentColor, color: accentColor }}
                  disabled={isUploading}
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="h-3 w-3 mr-1" />
                      Replace
                    </>
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => imagePath && onDelete(itemId, imagePath)}
                  className="text-xs text-red-600 border-red-300 hover:bg-red-50"
                >
                  <Trash2 className="h-3 w-3 mr-1" />
                  Remove
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div
            className="flex flex-col items-center justify-center py-4 cursor-pointer"
            onClick={() => fileInputRef.current?.click()}
          >
            {isUploading ? (
              <>
                <Loader2 className="h-8 w-8 mb-2 animate-spin" style={{ color: accentColor }} />
                <p className="text-sm font-medium" style={{ color: "#241C15" }}>
                  Uploading...
                </p>
              </>
            ) : (
              <>
                <ImageIcon className="h-8 w-8 mb-2" style={{ color: accentColor }} />
                <p className="text-sm font-medium mb-1" style={{ color: "#241C15" }}>
                  Click to upload screenshot
                </p>
                <p className="text-xs" style={{ color: "#241C15", opacity: 0.6 }}>
                  JPEG, PNG, GIF, or WebP (max 5MB)
                </p>
              </>
            )}
          </div>
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/gif,image/webp"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>
    </div>
  )
}
