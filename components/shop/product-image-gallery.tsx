"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface ProductImage {
  id: string
  url: string
  product_id: string
  position?: number
  is_main?: boolean
}

interface ProductImageGalleryProps {
  images: ProductImage[]
  productTitle: string
}

export default function ProductImageGallery({ images, productTitle }: ProductImageGalleryProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)

  if (images.length === 0) {
    return (
      <div className="w-full h-64 md:h-96 rounded-lg overflow-hidden bg-gray-800 flex items-center justify-center">
        <span className="text-gray-400">Δεν υπάρχει διαθέσιμη εικόνα</span>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Κύρια εικόνα */}
      <div className="relative w-full h-64 md:h-96 rounded-lg overflow-hidden bg-gray-800">
        <div className="relative w-full h-full">
          <img
            src={images[selectedImageIndex]?.url || "/placeholder.svg?height=600&width=800"}
            alt={`${productTitle} - Εικόνα ${selectedImageIndex + 1}`}
            className="w-full h-full object-contain"
          />

          {/* Κουμπιά πλοήγησης εικόνων */}
          {images.length > 1 && (
            <div className="absolute inset-0 flex items-center justify-between px-4 z-20">
              <Button
                onClick={() => setSelectedImageIndex((prev) => (prev - 1 + images.length) % images.length)}
                size="icon"
                variant="secondary"
                className="h-10 w-10 rounded-full bg-black text-white border-2 border-white shadow-lg"
              >
                <ChevronLeft className="h-6 w-6" />
              </Button>
              <Button
                onClick={() => setSelectedImageIndex((prev) => (prev + 1) % images.length)}
                size="icon"
                variant="secondary"
                className="h-10 w-10 rounded-full bg-black text-white border-2 border-white shadow-lg"
              >
                <ChevronRight className="h-6 w-6" />
              </Button>
            </div>
          )}

          {/* Ένδειξη τρέχουσας εικόνας */}
          {images.length > 1 && (
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black text-white px-3 py-1 rounded-full text-sm z-20 border border-white shadow-lg">
              {selectedImageIndex + 1}/{images.length}
            </div>
          )}
        </div>
      </div>

      {/* Μικρογραφίες εικόνων */}
      {images.length > 1 && (
        <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
          {images.map((image, index) => (
            <div
              key={image.id || index}
              className={`relative h-20 rounded overflow-hidden cursor-pointer border-2 ${
                selectedImageIndex === index ? "border-purple-500" : "border-transparent"
              }`}
              onClick={() => setSelectedImageIndex(index)}
            >
              <img
                src={image.url || "/placeholder.svg?height=200&width=200"}
                alt={`${productTitle} - Μικρογραφία ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
