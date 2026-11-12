"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import { Upload, X, ImageIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface ImageUploadProps {
  value?: File
  onChange: (file:File) => void
  onRemove: () => void
  className?: string
  aspectRatio?: "square" | "wide" | "logo"
  maxSizeMB?: number
  label?: string
  description?: string
  defaultImgPreview?: string
}

export function ImageUpload({
  value,
  onChange,
  onRemove,
  className,
  aspectRatio = "square",
  maxSizeMB = 5,
  label = "Upload Image",
  description = "Drag and drop or click to upload",
  defaultImgPreview
}: ImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [imgPreview, setImgPreview] = useState<string|undefined>(defaultImgPreview)

  useEffect(()=>{
    if(value){
      const reader = new FileReader()
      reader.onload = (e) => {
        if (e.target?.result) {
          setImgPreview(e.target?.result as string)
        }
      }
      reader.readAsDataURL(value)
    }
  },[value])


  const aspectRatioClass = {
    square: "aspect-square",
    wide: "aspect-video",
    logo: "aspect-square md:aspect-[3/2]",
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0])
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0])
    }
  }

  const handleFile = (file: File) => {
    setError(null)

    // Check file size
    if (file.size > maxSizeMB * 1024 * 1024) {
      setError(`File size exceeds ${maxSizeMB}MB limit`)
      return
    }

    // Check file type
    if (!file.type.startsWith("image/")) {
      setError("Only image files are allowed")
      return
    }

    onChange(file)
  }

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation()
    onRemove()
    setError(null)
    setImgPreview(undefined)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className={cn("w-full", className)}>
      {imgPreview ? (
        <div className={cn("relative rounded-md overflow-hidden", aspectRatioClass[aspectRatio])}>
          <Image src={imgPreview || "/placeholder.png"} alt="Uploaded image" fill className="object-cover" />
          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2 h-8 w-8 rounded-full"
            onClick={handleRemove}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div
          className={cn(
            "border-2 border-dashed rounded-md flex flex-col items-center justify-center cursor-pointer transition-colors",
            aspectRatioClass[aspectRatio],
            isDragging ? "border-primary bg-primary/5" : "border-muted-foreground/25 hover:border-primary/50",
          )}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={handleClick}
        >
          <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
          <div className="flex flex-col items-center justify-center p-4 text-center">
            <div className="rounded-full bg-muted p-3 mb-3">
              {isDragging ? (
                <Upload className="h-6 w-6 text-primary animate-pulse" />
              ) : (
                <ImageIcon className="h-6 w-6 text-muted-foreground" />
              )}
            </div>
            <p className="font-medium text-sm mb-1">{label}</p>
            <p className="text-xs text-muted-foreground">{description}</p>
            <p className="text-xs text-muted-foreground mt-1">Max size: {maxSizeMB}MB</p>
          </div>
        </div>
      )}
      {error && <p className="text-destructive text-sm mt-2">{error}</p>}
    </div>
  )
}

