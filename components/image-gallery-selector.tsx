'use client'

import { useCallback, useEffect, useState } from 'react'
import Image from 'next/image'
import { Upload, X } from 'lucide-react'
import { useDropzone } from 'react-dropzone'
import { Button } from './ui/button'
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import {
  arrayMove,
  rectSortingStrategy,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { toast } from 'sonner'
import { v4 as uuidv4 } from 'uuid'

// 👇 Now a full object
export type ImageItem = {
  id: string
  src: string
  file?: File // undefined for server-hosted images
}

function SortableImageCard({
  id,
  src,
  onRemove,
}: {
  id: string
  src: string
  onRemove: () => void
}) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id })
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      className="relative rounded-md overflow-hidden border h-40"
    >
      <Image src={src} alt="Gallery Image" fill className="object-cover pointer-events-none" />
      <Button
        type="button"
        variant="destructive"
        size="icon"
        className="absolute top-2 right-2 h-6 w-6 z-10"
        onClick={(e) => {
          e.preventDefault()
          e.stopPropagation()
          onRemove()
        }}
      >
        <X className="h-4 w-4" />
      </Button>
      <div
        {...listeners}
        className="absolute bottom-0 w-full bg-black/30 text-white text-xs text-center py-1 cursor-grab"
      >
        Drag to reorder
      </div>
    </div>
  )
}

interface ImageGallerySelectorProps {
  defaultImages?: ImageItem[]
  maxFiles?: number
  maxSizeMB?: number
  onChange?: (images: ImageItem[]) => void
}

export default function ImageGallerySelector({
  maxFiles = 5,
  maxSizeMB = 5,
  onChange,
  defaultImages = [],
}: ImageGallerySelectorProps) {
  const [images, setImages] = useState<ImageItem[]>([])

  useEffect(() => {
    if (defaultImages.length > 0) {
      // Only assign new UUIDs if not already present
      const initialized = defaultImages.map((img) => ({
        ...img,
        id: img.id || uuidv4(),
      }))
      setImages(initialized)
      onChange?.(initialized)
    }
  }, [defaultImages, onChange])

  const handleAddFiles = useCallback(
    (files: File[]) => {
      const newItems: ImageItem[] = []
      let rejectedCount = 0

      for (const file of files) {
        if (!file.type.startsWith('image/')) {
          toast.error(`File "${file.name}" is not an image.`)
          rejectedCount++
          continue
        }
        if (file.size > maxSizeMB * 1024 * 1024) {
          toast.error(`"${file.name}" exceeds ${maxSizeMB}MB limit.`)
          rejectedCount++
          continue
        }

        if (images.length + newItems.length >= maxFiles) {
          toast.error(`You can only upload up to ${maxFiles} images.`)
          break
        }

        const previewUrl = URL.createObjectURL(file)
        newItems.push({ id: uuidv4(), src: previewUrl, file })
      }

      if (newItems.length > 0) {
        const updated = [...images, ...newItems]
        setImages(updated)
        onChange?.(updated)
      }
    },
    [images, maxFiles, maxSizeMB, onChange]
  )

  const onDrop = useCallback((acceptedFiles: File[]) => {
    handleAddFiles(acceptedFiles)
  }, [handleAddFiles])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
    // maxFiles,
    noClick: true,
  })

  const handleClick = () => {
    document.getElementById('image-picker-input')?.click()
  }

  const handleRemove = (id: string) => {
    const updated = images.filter((img) => img.id !== id)
    setImages(updated)
    onChange?.(updated)
  }

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const handleDragEnd = (event: any) => {
    const { active, over } = event
    if (active.id !== over?.id) {
      const oldIndex = images.findIndex((img) => img.id === active.id)
      const newIndex = images.findIndex((img) => img.id === over.id)
      const reordered = arrayMove(images, oldIndex, newIndex)
      setImages(reordered)
      onChange?.(reordered)
    }
  }

  return (
    <div className="space-y-4">
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={images.map((img) => img.id)} strategy={rectSortingStrategy}>
          <div
            className="grid grid-cols-2 md:grid-cols-5 gap-4"
            {...getRootProps()}
          >
            {images.map((image) => (
              <SortableImageCard
                key={image.id}
                id={image.id}
                src={image.src}
                onRemove={() => handleRemove(image.id)}
              />
            ))}
            {images.length < maxFiles && (
              <div
                className={`border-2 border-dashed rounded-md flex flex-col items-center justify-center h-40 cursor-pointer transition-colors ${
                  isDragActive
                    ? 'border-primary bg-primary/10'
                    : 'border-muted-foreground/25 hover:border-primary/50'
                }`}
                onClick={handleClick}
              >
                <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">Upload Image</p>
              </div>
            )}
          </div>
        </SortableContext>
      </DndContext>

      <input
        id="image-picker-input"
        type="file"
        multiple
        accept="image/*"
        onChange={(e) => {
          if (e.target.files) handleAddFiles(Array.from(e.target.files))
        }}
        className="hidden"
        {...getInputProps()}
      />
    </div>
  )
}
