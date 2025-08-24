"use client"

import type React from "react"

import { CardFooter } from "@/components/ui/card"
import { useState, useEffect } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, ChevronRight } from "lucide-react"
import ProductDetailModal from "./product-detail-modal"

// Ορισμός του τύπου Product
interface Product {
  id: string
  name: string
  description: string
  price: number
  category: string
  images?: string[]
  featured?: boolean
  slug?: string
  longDescription?: string
  features?: string[]
}

// Κατηγορίες προϊόντων
const productCategories = [
  { value: "mlo", label: "MLO Μαγαζί" },
  { value: "vehicle", label: "Όχημα" },
  { value: "property", label: "Ιδιοκτησία" },
  { value: "membership", label: "Συνδρομή" },
  { value: "other", label: "Άλλο" },
]

// Mock δεδομένα για τα προϊόντα
const mockProducts: Product[] = [
  {
    id: "1",
    name: "Bahama Mamas",
    description: "Ένα πολυτελές nightclub με μοντέρνο σχεδιασμό, μπαρ, dance floor και VIP περιοχές.",
    price: 25,
    category: "mlo",
    images: ["/vibrant-nightclub.png", "/nightclub-vip-lounge.png", "/neon-nightclub.png"],
    featured: true,
    features: ["Πλήρως λειτουργικό μπαρ", "Dance floor με φωτισμό", "VIP περιοχές", "DJ booth", "Χώρος προσωπικού"],
  },
  {
    id: "2",
    name: "Burger Shot",
    description: "Ένα πλήρως λειτουργικό εστιατόριο fast food με κουζίνα, ταμεία και χώρο για τραπέζια.",
    price: 20,
    category: "mlo",
    images: ["/bustling-burger-joint.png"],
    features: ["Πλήρως λειτουργική κουζίνα", "Ταμεία και μενού", "Χώρος για τραπέζια", "Drive-thru", "Αποθήκη"],
  },
  {
    id: "3",
    name: "Bean Machine",
    description: "Μια cozy καφετέρια με μοντέρνα διακόσμηση, μπαρ και χώρο για τραπέζια.",
    price: 18,
    category: "mlo",
    images: ["/contemporary-cafe-counter.png"],
    features: ["Μπαρ καφέ", "Χώρος για τραπέζια", "Εξωτερικός χώρος", "Μοντέρνα διακόσμηση", "Κουζίνα"],
  },
  {
    id: "4",
    name: "Pizzeria",
    description: "Ένα αυθεντικό ιταλικό εστιατόριο με ξυλόφουρνο, μπαρ και χώρο για τραπέζια.",
    price: 22,
    category: "mlo",
    images: ["/cozy-italian-corner.png"],
    features: ["Ξυλόφουρνος", "Μπαρ", "Χώρος για τραπέζια", "Κουζίνα", "Αποθήκη"],
  },
  {
    id: "5",
    name: "Koi",
    description: "Ένα πολυτελές εστιατόριο ασιατικής κουζίνας με μοντέρνα διακόσμηση και VIP περιοχές.",
    price: 28,
    category: "mlo",
    images: ["/opulent-asian-dining.png"],
    features: ["Μπαρ σούσι", "VIP περιοχές", "Χώρος για τραπέζια", "Κουζίνα", "Αποθήκη"],
  },
  {
    id: "6",
    name: "Otto's Autos",
    description: "Ένα πλήρως λειτουργικό συνεργείο αυτοκινήτων με χώρο για επισκευές και έκθεση αυτοκινήτων.",
    price: 24,
    category: "mlo",
    images: ["/bustling-auto-repair.png"],
    features: ["Χώρος επισκευών", "Έκθεση αυτοκινήτων", "Γραφείο", "Αποθήκη", "Χώρος αναμονής"],
  },
]

export default function ShopItemsList() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [currentImageIndices, setCurrentImageIndices] = useState<Record<string, number>>({})
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Φόρτωση προϊόντων από το localStorage ή χρήση των mock δεδομένων
  useEffect(() => {
    try {
      const storedProducts = localStorage.getItem("admin_products")
      if (storedProducts) {
        const parsedProducts = JSON.parse(storedProducts)
        if (parsedProducts && parsedProducts.length > 0) {
          setProducts(parsedProducts)
        } else {
          // Αν δεν υπάρχουν προϊόντα στο localStorage, χρησιμοποιούμε τα mock δεδομένα
          setProducts(mockProducts)
        }
      } else {
        // Αν δεν υπάρχει το localStorage key, χρησιμοποιούμε τα mock δεδομένα
        setProducts(mockProducts)
      }

      // Αρχικοποίηση των δεικτών εικόνων
      const initialIndices: Record<string, number> = {}
      mockProducts.forEach((product: Product) => {
        initialIndices[product.id] = 0
      })
      setCurrentImageIndices(initialIndices)
    } catch (error) {
      console.error("Error loading products from localStorage:", error)
      // Σε περίπτωση σφάλματος, χρησιμοποιούμε τα mock δεδομένα
      setProducts(mockProducts)
    } finally {
      setLoading(false)
    }
  }, [])

  // Συνάρτηση για τη φόρτωση εικόνων από το localStorage ή χρήση του URL
  const getImageFromStorage = (imageId: string): string => {
    // Αν το imageId είναι URL, το επιστρέφουμε ως έχει
    if (imageId.startsWith("/") || imageId.startsWith("http")) {
      return imageId
    }

    try {
      const image = localStorage.getItem(`product_image_${imageId}`)
      return image || "/placeholder.svg?height=400&width=600"
    } catch (error) {
      console.error("Error loading image from localStorage:", error)
      return "/placeholder.svg?height=400&width=600"
    }
  }

  // Χειρισμός αλλαγής εικόνας
  const nextImage = (e: React.MouseEvent, productId: string, imagesArray: string[]) => {
    e.preventDefault()
    e.stopPropagation()
    if (imagesArray.length > 1) {
      setCurrentImageIndices((prev) => ({
        ...prev,
        [productId]: (prev[productId] + 1) % imagesArray.length,
      }))
    }
  }

  const prevImage = (e: React.MouseEvent, productId: string, imagesArray: string[]) => {
    e.preventDefault()
    e.stopPropagation()
    if (imagesArray.length > 1) {
      setCurrentImageIndices((prev) => ({
        ...prev,
        [productId]: (prev[productId] - 1 + imagesArray.length) % imagesArray.length,
      }))
    }
  }

  // Άνοιγμα του modal με τις λεπτομέρειες προϊόντος
  const openProductDetails = (productId: string) => {
    console.log("Opening modal for product:", productId)
    setSelectedProductId(productId)
    setIsModalOpen(true)
  }

  // Κλείσιμο του modal
  const closeProductDetails = () => {
    console.log("Closing modal")
    setIsModalOpen(false)
  }

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} className="overflow-hidden">
              <div className="h-48 bg-gray-200 animate-pulse"></div>
              <CardHeader>
                <div className="h-6 bg-gray-200 animate-pulse rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 animate-pulse rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="h-4 bg-gray-200 animate-pulse rounded w-full mb-2"></div>
                <div className="h-4 bg-gray-200 animate-pulse rounded w-3/4"></div>
              </CardContent>
              <CardFooter>
                <div className="h-10 bg-gray-200 animate-pulse rounded w-full"></div>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.length > 0 ? (
          products.map((product) => (
            <Card key={product.id} className="overflow-hidden">
              <div className="relative h-48 bg-gray-100">
                {product.images && product.images.length > 0 ? (
                  <div className="w-full h-full relative">
                    <Image
                      src={
                        getImageFromStorage(product.images[currentImageIndices[product.id] || 0]) || "/placeholder.svg"
                      }
                      alt={product.name}
                      fill
                      style={{ objectFit: "cover" }}
                    />

                    {/* Κουμπιά πλοήγησης εικόνων */}
                    {product.images.length > 1 && (
                      <div className="absolute inset-0 flex items-center justify-between px-2 z-20">
                        <Button
                          onClick={(e) => prevImage(e, product.id, product.images || [])}
                          size="icon"
                          variant="secondary"
                          className="h-8 w-8 rounded-full bg-black text-white border-2 border-white shadow-lg"
                        >
                          <ChevronLeft className="h-5 w-5" />
                        </Button>
                        <Button
                          onClick={(e) => nextImage(e, product.id, product.images || [])}
                          size="icon"
                          variant="secondary"
                          className="h-8 w-8 rounded-full bg-black text-white border-2 border-white shadow-lg"
                        >
                          <ChevronRight className="h-5 w-5" />
                        </Button>
                      </div>
                    )}

                    {/* Ένδειξη τρέχουσας εικόνας */}
                    {product.images.length > 1 && (
                      <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 bg-black text-white px-2 py-1 rounded-full text-xs z-20 border border-white shadow-lg">
                        {(currentImageIndices[product.id] || 0) + 1}/{product.images.length}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-200">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-12 w-12 text-gray-400"
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
                {product.featured && (
                  <div className="absolute top-2 right-2 bg-yellow-500 text-white px-2 py-1 rounded text-xs font-medium z-20">
                    Προτεινόμενο
                  </div>
                )}
              </div>
              <CardHeader>
                <CardTitle>{product.name}</CardTitle>
                <CardDescription>
                  <Badge variant="outline" className="mr-2">
                    {productCategories.find((cat) => cat.value === product.category)?.label || "Άλλο"}
                  </Badge>
                  {product.price}€
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500">{product.description}</p>
              </CardContent>
              {/* Το CardFooter και το κουμπί "Περισσότερα" έχουν αφαιρεθεί εντελώς */}
            </Card>
          ))
        ) : (
          <div className="col-span-3 text-center py-12">
            <h3 className="text-xl font-medium text-gray-400">Δεν υπάρχουν διαθέσιμα προϊόντα</h3>
            <p className="text-gray-500 mt-2">Επισκεφθείτε ξανά αργότερα για νέα προϊόντα</p>
          </div>
        )}
      </div>

      {/* Modal λεπτομερειών προϊόντος */}
      {selectedProductId && (
        <ProductDetailModal productId={selectedProductId} isOpen={isModalOpen} onClose={closeProductDetails} />
      )}
    </div>
  )
}
