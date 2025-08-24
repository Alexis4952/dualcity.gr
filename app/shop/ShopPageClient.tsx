"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import { ShopBackground } from "@/components/shop-background"
import Navbar from "@/components/navbar"
import BackButton from "@/components/back-button"
import { ChevronLeft, ChevronRight, ExternalLink, Tag, Clock, Search, X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { V66Background } from "@/components/v66-background"
import { Input } from "@/components/ui/input"

interface ProductImage {
  id: string
  product_id: string
  url: string
  is_main: boolean
}

interface Product {
  id: string
  title: string
  description: string
  price: number
  category: string
  on_sale?: boolean
  discount_percentage?: number
  discount_price?: number
  images: ProductImage[]
  features?: string[]
  long_description?: string
  sold?: boolean
  discount_start_date?: string
  discount_end_date?: string
}

export function ShopPageClient({ products }: { products: Product[] }) {
  const [currentImageIndices, setCurrentImageIndices] = useState<Record<string, number>>({})
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  
  // Modal state
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [modalImageIndex, setModalImageIndex] = useState(0)
  const [activeTab, setActiveTab] = useState<"description" | "features">("description")
  const [isImageModalOpen, setIsImageModalOpen] = useState(false)
  const [isImageZoomed, setIsImageZoomed] = useState(false)
  const imageContainerRef = useRef<HTMLDivElement>(null)

  // Discord server URL
  const DISCORD_URL = "https://discord.gg/PdMYvK7WGN"

  const [hoveringProductId, setHoveringProductId] = useState<string | null>(null)
  const slideshowIntervals = useRef<Record<string, NodeJS.Timeout>>({})

  // Κατηγορίες προϊόντων
  const categoryOrder = ["all", "mlo", "workshops", "gang", "mafia", "house", "services"]

  const categoryNames: Record<string, string> = {
    all: "All",
    mlo: "MLO",
    workshops: "Workshops",
    gang: "Gang",
    mafia: "Mafia",
    house: "House",
    services: "Services",
  }

  // Αρχικοποίηση των δεικτών εικόνων για κάθε προϊόν
  useEffect(() => {
    const initialIndices: Record<string, number> = {}
    products.forEach((product) => {
      initialIndices[product.id] = 0
    })
    setCurrentImageIndices(initialIndices)
  }, [products])

  useEffect(() => {
    return () => {
      // Καθαρίζουμε όλα τα intervals κατά το unmount
      Object.values(slideshowIntervals.current).forEach((interval) => {
        clearInterval(interval)
      })
    }
  }, [])

  // Φιλτράρισμα προϊόντων
  const filteredProducts = products.filter((product) => {
    if (selectedCategory !== "all" && product.category !== selectedCategory) {
      return false
    }

    if (searchTerm.trim() !== "") {
      return (
        product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    return true
  })

  // Μορφοποίηση τιμής
  const formatPrice = (price: number) => {
    if (price === -1) {
      return "Ρωτήστε τιμή"
    }
    return `€${price.toFixed(2)}`
  }

  // Υπολογισμός έκπτωσης
  const calculateDiscount = (originalPrice: number, discountPercentage: number) => {
    return originalPrice * (1 - discountPercentage / 100)
  }

  // Εμφάνιση εικόνων προϊόντος
  const handleImageNavigation = (productId: string, direction: "prev" | "next") => {
    setCurrentImageIndices((prev) => {
      const currentIndex = prev[productId] || 0
      const product = products.find((p) => p.id === productId)
      if (!product || product.images.length === 0) return prev

      let newIndex: number
      if (direction === "prev") {
        newIndex = currentIndex === 0 ? product.images.length - 1 : currentIndex - 1
      } else {
        newIndex = currentIndex === product.images.length - 1 ? 0 : currentIndex + 1
      }

      return {
        ...prev,
        [productId]: newIndex,
      }
    })
  }

  // Modal functions
  const openProductDetails = (product: Product) => {
    console.log("Opening product details for:", product.title)
    setSelectedProduct(product)
    setModalImageIndex(0)
    setActiveTab("description")
  }

  const openImageModal = (product: Product, imageIndex: number) => {
    setSelectedProduct(product)
    setModalImageIndex(imageIndex)
    setIsImageModalOpen(true)
  }

  const closeImageModal = () => {
    setIsImageModalOpen(false)
    setSelectedProduct(null)
  }

  const handleModalImageNavigation = (direction: "prev" | "next") => {
    if (!selectedProduct) return

    const totalImages = selectedProduct?.images?.length || 0
    if (totalImages === 0) return

    let newIndex: number
    if (direction === "prev") {
      newIndex = modalImageIndex === 0 ? totalImages - 1 : modalImageIndex - 1
    } else {
      newIndex = modalImageIndex === totalImages - 1 ? 0 : modalImageIndex + 1
    }

    setModalImageIndex(newIndex)
  }

  // Slideshow για εικόνες προϊόντων
  const startSlideshow = (productId: string) => {
    const product = products.find((p) => p.id === productId)
    if (!product || product.images.length <= 1) return

    const interval = setInterval(() => {
      setCurrentImageIndices((prev) => {
        const currentIndex = prev[productId] || 0
        const nextIndex = (currentIndex + 1) % product.images.length
        return {
          ...prev,
          [productId]: nextIndex,
        }
      })
    }, 3000)

    slideshowIntervals.current[productId] = interval
  }

  const stopSlideshow = (productId: string) => {
    const interval = slideshowIntervals.current[productId]
    if (interval) {
      clearInterval(interval)
      delete slideshowIntervals.current[productId]
    }
  }

  // Κατηγορίες προϊόντων
  const getCategoryLabel = (category: string) => {
    return categoryNames[category] || category
  }

  const handleProductMouseEnter = (productId: string) => {
    setHoveringProductId(productId)

    // Αν το προϊόν έχει πολλαπλές εικόνες, ξεκινάμε το slideshow
    const product = products.find((p) => p.id === productId)
    if (product && product.images.length > 1) {
      startSlideshow(productId)
    }
  }

  const handleProductMouseLeave = (productId: string) => {
    setHoveringProductId(null)

    // Σταματάμε το slideshow
    stopSlideshow(productId)
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <ShopBackground />
      <Navbar />
      <BackButton />
      <V66Background animated={false} />

      <div className="container mx-auto p-4 pt-24 relative z-10">
        <h1 className="text-4xl font-bold text-center mb-8 bg-gradient-to-r from-cyan-500 to-purple-600 text-transparent bg-clip-text neon-text">
          Κατάστημα Dual City
        </h1>

        {/* Μπάρα αναζήτησης */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            type="text"
            placeholder="Αναζήτηση προϊόντων..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-gray-800/60 border-gray-700 text-white"
          />
        </div>

        {/* Μενού κατηγοριών */}
        <div className="mb-8 overflow-x-auto pb-2">
          <div className="flex space-x-2 min-w-max">
            {categoryOrder.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-md transition-all duration-200 ${
                  selectedCategory === category
                    ? "bg-gradient-to-r from-cyan-600 to-purple-600 text-white font-medium shadow-lg shadow-cyan-900/20"
                    : "bg-gray-800/60 text-gray-300 hover:bg-gray-700/60"
                }`}
              >
                {categoryNames[category]}
              </button>
            ))}
          </div>
        </div>

        {/* Λίστα προϊόντων */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => {
            const currentIndex = currentImageIndices[product.id] || 0
            const currentImage = product.images[currentIndex]?.url || "/placeholder.svg"

            return (
              <motion.div
                key={product.id}
                className="card-v66 overflow-hidden rounded-lg transition-all duration-300 hover:scale-[1.02] cursor-pointer"
                whileHover={{ y: -5 }}
                onMouseEnter={() => handleProductMouseEnter(product.id)}
                onMouseLeave={() => handleProductMouseLeave(product.id)}
                onClick={() => {
                  console.log("Product card clicked:", product.title)
                  openProductDetails(product)
                }}
              >
                  <div className="h-56 relative group">
                    <Image
                      src={currentImage || "/placeholder.svg"}
                      alt={product.title}
                      fill
                      style={{ objectFit: "cover" }}
                      className="transition-transform duration-700 group-hover:scale-110"
                    />

                    {product.sold && (
                      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-20">
                        <div className="border-2 border-red-600 rounded-lg px-4 py-2 transform rotate-[-20deg]">
                          <span className="text-red-600 font-bold text-2xl">ΠΩΛΗΘΗΚΕ</span>
                        </div>
                      </div>
                    )}

                    {/* Κουμπιά πλοήγησης εικόνων */}
                    {product.images.length > 1 && (
                      <div className="absolute inset-0 flex items-center justify-between px-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleImageNavigation(product.id, "prev")}
                          className="h-8 w-8 rounded-full bg-black/70 text-white flex items-center justify-center border border-cyan-700 neon-border z-10 hover:bg-cyan-900/50"
                        >
                          <ChevronLeft className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleImageNavigation(product.id, "next")}
                          className="h-8 w-8 rounded-full bg-black/70 text-white flex items-center justify-center border border-cyan-700 neon-border z-10 hover:bg-cyan-900/50"
                        >
                          <ChevronRight className="h-5 w-5" />
                        </button>
                      </div>
                    )}

                    {/* Ένδειξη τρέχουσας εικόνας */}
                    {product.images.length > 1 && (
                      <div className="absolute bottom-2 right-2 bg-black/70 text-white px-2 py-1 rounded-full text-xs z-10 backdrop-blur-sm border border-gray-700">
                        {currentIndex + 1}/{product.images.length}
                      </div>
                    )}

                    {/* Badge κατηγορίας */}
                    <div className="absolute top-2 right-2 z-10">
                      <span className="bg-cyan-900/80 backdrop-blur-sm text-cyan-100 px-2 py-1 rounded text-xs font-medium border border-cyan-700 flex items-center">
                        <Tag className="h-3 w-3 mr-1" />
                        {getCategoryLabel(product.category)}
                      </span>
                    </div>

                    {/* Badge προσφοράς */}
                    {product.on_sale && product.discount_percentage && (
                      <div className="absolute top-2 left-2 z-10">
                        <span className="bg-red-600/90 backdrop-blur-sm text-white px-2 py-1 rounded text-xs font-medium border border-red-500 flex items-center">
                          <Clock className="h-3 w-3 mr-1" />-{product.discount_percentage}%
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="p-5">
                    <h2 className="text-xl font-bold mb-2 text-white neon-text">{product.title}</h2>
                    <p className="text-gray-300 text-sm mb-4 line-clamp-2">{product.description}</p>
                    <div className="flex justify-between items-center">
                      {product.price === -1 ? (
                        <span className="text-cyan-400 font-bold text-lg">Ρωτήστε τιμή</span>
                      ) : product.on_sale && product.discount_price ? (
                        <div className="flex flex-col">
                          <span className="text-red-400 font-bold text-lg">{formatPrice(product.discount_price)}</span>
                          <span className="line-through text-gray-500 text-sm">{formatPrice(product.price)}</span>
                        </div>
                      ) : (
                        <span className="text-cyan-400 font-bold text-lg">{formatPrice(product.price)}</span>
                      )}
                      <span className="text-cyan-400 text-sm">Περισσότερα →</span>
                    </div>
                  </div>
                </motion.div>
            )
          })}
        </div>

        {/* Μήνυμα αν δεν βρέθηκαν προϊόντα */}
        {filteredProducts.length === 0 && (
          <div className="text-center py-16">
            <h3 className="text-2xl font-bold text-gray-400 mb-4">Δεν βρέθηκαν προϊόντα</h3>
            <p className="text-gray-500">Δοκιμάστε να αλλάξετε τα φίλτρα αναζήτησης</p>
          </div>
        )}
      </div>

      {/* Product Details Modal */}
      <AnimatePresence>
        {selectedProduct && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-[9999] p-4"
            onClick={() => setSelectedProduct(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-gray-900 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex justify-between items-center p-6 border-b border-gray-700">
                <h2 className="text-2xl font-bold text-white">{selectedProduct?.title || "Product"}</h2>
                <button
                  onClick={() => setSelectedProduct(null)}
                  className="text-gray-400 hover:text-white"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              {/* Content */}
              <div className="p-6">
                {/* Images */}
                <div className="mb-6">
                  <div className={`relative mb-4 transition-all duration-300 ${
                    isImageZoomed ? "h-96" : "h-64"
                  }`}>
                    <Image
                      src={selectedProduct?.images?.[modalImageIndex]?.url || "/placeholder.svg"}
                      alt={selectedProduct?.title || "Product"}
                      fill
                      className={`rounded-lg transition-all duration-300 ${
                        isImageZoomed ? "object-contain scale-110" : "object-cover"
                      }`}
                    />
                    {/* Navigation buttons */}
                    {selectedProduct?.images && selectedProduct.images.length > 1 && (
                      <div className="absolute inset-0 flex items-center justify-between px-4">
                        <button
                          onClick={() => handleModalImageNavigation("prev")}
                          className="h-10 w-10 rounded-full bg-black/70 text-white flex items-center justify-center hover:bg-cyan-900/50"
                        >
                          <ChevronLeft className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleModalImageNavigation("next")}
                          className="h-10 w-10 rounded-full bg-black/70 text-white flex items-center justify-center hover:bg-cyan-900/50"
                        >
                          <ChevronRight className="h-5 w-5" />
                        </button>
                      </div>
                    )}

                    {/* Zoom/Enlarge button */}
                    <div className="absolute top-2 right-2">
                      <button
                        onClick={() => setIsImageZoomed(!isImageZoomed)}
                        className="bg-black/70 text-white px-3 py-2 rounded-lg hover:bg-cyan-900/50 transition-colors flex items-center space-x-2"
                      >
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                        </svg>
                        <span>{isImageZoomed ? "Μικρότερη" : "Μεγέθυνση"}</span>
                      </button>
                    </div>


                  </div>
                  
                  {/* Thumbnails */}
                  {selectedProduct?.images && selectedProduct.images.length > 1 && (
                    <div className="flex space-x-2 overflow-x-auto">
                      {selectedProduct.images.map((image, index) => (
                        <button
                          key={image.id}
                          onClick={() => setModalImageIndex(index)}
                          className={`flex-shrink-0 w-16 h-16 rounded border-2 ${
                            index === modalImageIndex ? "border-cyan-500" : "border-gray-600"
                          }`}
                        >
                          <Image
                            src={image.url}
                            alt={`${selectedProduct?.title || "Product"} ${index + 1}`}
                            width={64}
                            height={64}
                            className="rounded object-cover w-full h-full"
                          />
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Price */}
                <div className="mb-6">
                  {selectedProduct?.price === -1 ? (
                    <span className="text-2xl font-bold text-cyan-400">Ρωτήστε τιμή</span>
                  ) : selectedProduct?.on_sale && selectedProduct?.discount_price ? (
                    <div className="flex items-center space-x-3">
                      <span className="text-3xl font-bold text-red-400">
                        {formatPrice(selectedProduct.discount_price)}
                      </span>
                      <span className="text-xl line-through text-gray-500">
                        {formatPrice(selectedProduct.price)}
                      </span>
                      <span className="bg-red-600 text-white px-2 py-1 rounded text-sm font-medium">
                        -{selectedProduct.discount_percentage}%
                      </span>
                    </div>
                  ) : (
                    <span className="text-3xl font-bold text-cyan-400">
                      {formatPrice(selectedProduct?.price || 0)}
                    </span>
                  )}
                </div>

                {/* Tabs */}
                <div className="mb-6">
                  <div className="flex space-x-1 bg-gray-800 rounded-lg p-1">
                    <button
                      onClick={() => setActiveTab("description")}
                      className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                        activeTab === "description"
                          ? "bg-cyan-600 text-white"
                          : "text-gray-400 hover:text-white"
                      }`}
                    >
                      Περιγραφή
                    </button>
                    <button
                      onClick={() => setActiveTab("features")}
                      className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                        activeTab === "features"
                          ? "bg-cyan-600 text-white"
                          : "text-cyan-400 hover:text-white"
                      }`}
                    >
                      Χαρακτηριστικά
                    </button>
                  </div>
                </div>

                {/* Tab Content */}
                <div className="min-h-[200px]">
                  {activeTab === "description" && (
                    <div>
                      <p className="text-gray-300 mb-4">{selectedProduct?.description || ""}</p>
                      {selectedProduct?.long_description && (
                        <p className="text-gray-400">{selectedProduct.long_description}</p>
                      )}
                    </div>
                  )}
                  
                  {activeTab === "features" && (
                    <div>
                      {selectedProduct?.features && selectedProduct.features.length > 0 ? (
                        <ul className="space-y-2">
                          {selectedProduct.features.map((feature, index) => (
                            <li key={index} className="flex items-center text-gray-300">
                              <div className="w-2 h-2 bg-cyan-500 rounded-full mr-3"></div>
                              {feature}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-gray-400">Δεν υπάρχουν διαθέσιμα χαρακτηριστικά</p>
                      )}
                    </div>
                  )}
                </div>

                {/* Contact Button */}
                <div className="mt-6">
                  <a
                    href={DISCORD_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center bg-cyan-600 hover:bg-cyan-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
                  >
                    <ExternalLink className="h-5 w-5 mr-2" />
                    Επικοινωνήστε μαζί μας στο Discord
                  </a>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Image Modal */}
      <AnimatePresence>
        {isImageModalOpen && selectedProduct && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50"
            onClick={closeImageModal}
          >
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              className="w-full max-w-4xl h-full flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={closeImageModal}
                className="absolute top-4 right-4 text-white hover:text-gray-300"
              >
                <X className="h-6 w-6" />
              </button>
              <div className="flex-1 flex items-center justify-center">
                <Image
                  src={selectedProduct?.images?.[modalImageIndex]?.url || "/placeholder.svg"}
                  alt={selectedProduct?.title || "Product"}
                  fill
                  style={{ objectFit: "contain" }}
                />
              </div>
              <div className="flex justify-center space-x-2 p-4">
                <button
                  onClick={() => handleModalImageNavigation("prev")}
                  className="h-10 w-10 rounded-full bg-black/70 text-white flex items-center justify-center border border-cyan-700 neon-border z-10 hover:bg-cyan-900/50"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  onClick={() => handleModalImageNavigation("next")}
                  className="h-10 w-10 rounded-full bg-black/70 text-white flex items-center justify-center border border-cyan-700 neon-border z-10 hover:bg-cyan-900/50"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
