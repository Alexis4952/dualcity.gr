"use client"

import type React from "react"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import { useState, useEffect, useRef } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import SimpleModal from "./simple-modal"

interface ProductImage {
  id: string
  url: string
  product_id: string
  is_main: boolean
}

// Αλλάζουμε το interface των props για να δέχεται ένα αντικείμενο product
interface ShopMLOItemProps {
  product: {
    id: string
    title: string
    description: string
    price: number
    discount_price?: number
    discount_percentage?: number
    on_sale?: boolean
    category: string
    images: ProductImage[]
  }
  openProductDetails: (product: ShopMLOItemProps["product"]) => void
}

// Αλλάζουμε την υπογραφή της συνάρτησης για να δέχεται το νέο interface
export default function ShopMLOItem({ product, openProductDetails }: ShopMLOItemProps) {
  const { id, title, description, price, discount_price, discount_percentage, on_sale, category, images } = product

  // Καταγραφή για αποσφαλμάτωση
  console.log("ShopMLOItem product data:", {
    id,
    title,
    price,
    on_sale,
    discount_percentage,
    discount_price,
  })

  // Το υπόλοιπο του component παραμένει το ίδιο
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isHovering, setIsHovering] = useState(false)
  const [isZoomed, setIsZoomed] = useState(false)
  const [isImageZoomed, setIsImageZoomed] = useState(false)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const modalIntervalRef = useRef<NodeJS.Timeout | null>(null)

  // Προσθέτουμε έλεγχο για null/undefined images
  const imageArray = images || []

  // Αλλάζουμε όλες τις αναφορές στο images.length για να χρησιμοποιούν το imageArray
  // Εκκαθάριση των intervals όταν το component unmounts
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
      if (modalIntervalRef.current) {
        clearInterval(modalIntervalRef.current)
      }
    }
  }, [])

  // Ρύθμιση του αυτόματου slideshow όταν το ποντίκι είναι πάνω από το προϊόν
  useEffect(() => {
    if (isHovering && imageArray.length > 1) {
      intervalRef.current = setInterval(() => {
        setCurrentImageIndex((prev) => (prev + 1) % imageArray.length)
      }, 2000) // Αλλαγή εικόνας κάθε 2 δευτερόλεπτα
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isHovering, imageArray.length])

  // Ρύθμιση του αυτόματου slideshow στο modal
  useEffect(() => {
    if (isZoomed && imageArray.length > 1) {
      // Καθαρίζουμε το προηγούμενο interval αν υπάρχει
      if (modalIntervalRef.current) {
        clearInterval(modalIntervalRef.current)
      }

      // Δημιουργούμε νέο interval με πιο αργό ρυθμό
      modalIntervalRef.current = setInterval(() => {
        setCurrentImageIndex((prev) => (prev + 1) % imageArray.length)
      }, 4000) // Αλλαγή εικόνας κάθε 4 δευτερόλεπτα στο modal
    } else if (modalIntervalRef.current) {
      clearInterval(modalIntervalRef.current)
      modalIntervalRef.current = null
    }

    return () => {
      if (modalIntervalRef.current) {
        clearInterval(modalIntervalRef.current)
      }
    }
  }, [isZoomed, imageArray.length])

  const nextImage = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (imageArray.length > 1) {
      setCurrentImageIndex((prev) => (prev + 1) % imageArray.length)
    }
  }

  const prevImage = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (imageArray.length > 1) {
      setCurrentImageIndex((prev) => (prev - 1 + imageArray.length) % imageArray.length)
    }
  }

  const handleImageClick = () => {
    setIsZoomed(true)
  }

  // Κατηγορίες προϊόντων
  const getCategoryLabel = (category: string) => {
    const categories: Record<string, string> = {
      mlo: "MLO Μαγαζί",
      vehicle: "Όχημα",
      property: "Ιδιοκτησία",
      membership: "Συνδρομή",
      other: "Άλλο",
    }
    return categories[category] || "Άλλο"
  }

  return (
    <>
      <Card
        className="bg-black/30 backdrop-blur-sm rounded-lg overflow-hidden relative group border border-gray-800 h-full flex flex-col"
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        <div className="relative h-72 bg-gray-900 cursor-pointer" onClick={handleImageClick}>
          {imageArray && imageArray.length > 0 ? (
            <div className="w-full h-full relative group">
              <Image
                src={imageArray[currentImageIndex]?.url || "/placeholder.svg?height=400&width=600&query=product"}
                alt={title}
                fill
                style={{ objectFit: "cover" }}
                className="transition-transform duration-300 group-hover:scale-110"
              />

              {/* Κουμπιά πλοήγησης εικόνων - διατηρούμε τα βελάκια */}
              {imageArray.length > 1 && (
                <div className="absolute inset-0 flex items-center justify-between px-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    onClick={prevImage}
                    size="icon"
                    variant="secondary"
                    className="h-10 w-10 rounded-full bg-black/50 text-white border border-gray-500"
                  >
                    <ChevronLeft className="h-6 w-6" />
                  </Button>
                  <Button
                    onClick={nextImage}
                    size="icon"
                    variant="secondary"
                    className="h-10 w-10 rounded-full bg-black/50 text-white border border-gray-500"
                  >
                    <ChevronRight className="h-6 w-6" />
                  </Button>
                </div>
              )}

              {/* Zoom indicator */}
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="bg-black/70 text-white px-2 py-1 rounded text-xs">
                  🔍 Κλικ για zoom
                </div>
              </div>

              {/* Ένδειξη τρέχουσας εικόνας */}
              {imageArray.length > 1 && (
                <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 bg-black/70 text-white px-2 py-1 rounded-full text-xs">
                  {currentImageIndex + 1}/{imageArray.length}
                </div>
              )}
            </div>
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-800">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-16 w-16 text-gray-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
          )}

          {/* Ετικέτα κατηγορίας */}
          <div className="absolute top-2 right-2">
            <Badge variant="outline" className="bg-black/50 text-white border-gray-600">
              {getCategoryLabel(category)}
            </Badge>
          </div>

          {/* Ετικέτα τιμής */}
          <div className="absolute top-2 left-2">
            {price === -1 ? (
              <Badge className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white border-0">Ρωτήστε τιμή</Badge>
            ) : on_sale ? (
              <div className="flex flex-col gap-1">
                <Badge className="bg-red-600 text-white border-0">-{discount_percentage}%</Badge>
                <Badge className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white border-0">
                  {discount_price}€
                </Badge>
                <span className="text-xs text-white line-through bg-black/50 px-2 py-0.5 rounded">{price}€</span>
              </div>
            ) : (
              <Badge className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white border-0">{price}€</Badge>
            )}
          </div>
        </div>

        <CardContent className="p-6 flex-grow flex flex-col">
          <h3 className="text-xl font-bold mb-2 text-white">{title}</h3>
          <p className="text-gray-400 mb-4 flex-grow">{description}</p>
          <div className="flex justify-between items-center">
            {price === -1 ? (
              <span className="text-cyan-400 font-bold text-lg">Ρωτήστε τιμή</span>
            ) : on_sale && discount_price ? (
              <div className="flex flex-col">
                <span className="text-red-400 font-bold text-lg">{discount_price}€</span>
                <span className="line-through text-gray-500 text-sm">{price}€</span>
              </div>
            ) : (
              <span className="text-cyan-400 font-bold text-lg">{price}€</span>
            )}
            <button
              onClick={(e) => {
                e.stopPropagation()
                openProductDetails(product)
              }}
              className="btn-v66 text-cyan-400 px-4 py-2 rounded text-sm"
            >
              Περισσότερα
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Modal για το zoom */}
      <SimpleModal isOpen={isZoomed} onClose={() => setIsZoomed(false)} title={title}>
        <div className="relative">
          {/* Πλοήγηση εικόνων στο modal */}
          {imageArray.length > 1 && (
            <div className="flex justify-between mb-4">
              <Button
                onClick={(e) => {
                  e.stopPropagation()
                  setCurrentImageIndex((prev) => (prev - 1 + imageArray.length) % imageArray.length)
                }}
                variant="outline"
                className="text-white border-gray-600"
              >
                <ChevronLeft className="h-5 w-5 mr-2" /> Προηγούμενη
              </Button>
              <span className="text-white">
                Εικόνα {currentImageIndex + 1} από {imageArray.length}
              </span>
              <Button
                onClick={(e) => {
                  e.stopPropagation()
                  setCurrentImageIndex((prev) => (prev + 1) % imageArray.length)
                }}
                variant="outline"
                className="text-white border-gray-600"
              >
                Επόμενη <ChevronRight className="h-5 w-5 ml-2" />
              </Button>
            </div>
          )}

          {/* Μεγεθυμένη εικόνα */}
          <div className="relative w-full flex justify-center">
            {imageArray && imageArray.length > 0 ? (
              <div className="relative max-w-full max-h-[80vh] overflow-hidden rounded-lg">
                <Image
                  src={imageArray[currentImageIndex]?.url || "/placeholder.svg?height=800&width=1200&query=product"}
                  alt={title}
                  width={1200}
                  height={800}
                  style={{ 
                    objectFit: "contain",
                    maxWidth: "100%",
                    maxHeight: "80vh",
                    width: "auto",
                    height: "auto",
                    cursor: "zoom-in"
                  }}
                  className={`rounded-lg transition-all duration-300 ${
                    isImageZoomed 
                      ? "scale-150 cursor-zoom-out" 
                      : "hover:scale-110 cursor-zoom-in"
                  }`}
                  priority
                  onClick={() => setIsImageZoomed(!isImageZoomed)}
                />
                {isImageZoomed && (
                  <div className="absolute top-2 right-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsImageZoomed(false)}
                      className="bg-black/70 text-white border-gray-600 hover:bg-gray-800"
                    >
                      Reset Zoom
                    </Button>
                  </div>
                )}
              </div>
            ) : (
              <div className="w-full h-64 flex items-center justify-center bg-gray-800 rounded-lg">
                <span className="text-gray-500">Δεν υπάρχει διαθέσιμη εικόνα</span>
              </div>
            )}
          </div>

          {/* Πληροφορίες προϊόντος */}
          <div className="mt-6 bg-gray-800/50 p-4 rounded-lg">
            <h3 className="text-xl font-bold mb-2 text-white">{title}</h3>
            <p className="text-gray-300">{description}</p>
            <div className="mt-4">
              {on_sale ? (
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold text-cyan-400">{discount_price}€</span>
                  <span className="text-lg line-through text-gray-400">{price}€</span>
                  <Badge className="bg-red-600 text-white border-0 ml-2">-{discount_percentage}%</Badge>
                </div>
              ) : (
                <span className="text-2xl font-bold text-cyan-400">{price}€</span>
              )}
            </div>
          </div>
        </div>
      </SimpleModal>
    </>
  )
}
