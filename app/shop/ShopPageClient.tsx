"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import { ShopBackground } from "@/components/shop-background"
import Navbar from "@/components/navbar"
import BackButton from "@/components/back-button"
import { ChevronLeft, ChevronRight, ExternalLink, Info, Tag, Clock, ZoomIn, Search } from "lucide-react"
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
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [currentImageIndices, setCurrentImageIndices] = useState<Record<string, number>>({})
  const [modalImageIndex, setModalImageIndex] = useState(0)
  const [activeTab, setActiveTab] = useState<"description" | "features">("description")
  const [isImageModalOpen, setIsImageModalOpen] = useState(false)
  const imageContainerRef = useRef<HTMLDivElement>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")

  // Discord server URL
  const DISCORD_URL = "https://discord.gg/ztH8UdKxGU"

  const [hoveringProductId, setHoveringProductId] = useState<string | null>(null)
  const slideshowIntervals = useRef<Record<string, NodeJS.Timeout>>({})

  // Ακριβώς οι κατηγορίες που ζήτησε ο χρήστης με τη σειρά που τις θέλει
  // Αλλαγή του "συνεργεία" σε "workshops"
  const categoryOrder = ["all", "mlo", "workshops", "gang", "mafia", "house", "services"]

  // Ονόματα κατηγοριών για εμφάνιση
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

  // Φιλτράρισμα προϊόντων με βάση την αναζήτηση και την επιλεγμένη κατηγορία
  const filteredProducts = products.filter((product) => {
    // Φιλτράρισμα με βάση την κατηγορία
    if (selectedCategory !== "all" && product.category !== selectedCategory) {
      return false
    }

    // Φιλτράρισμα με βάση την αναζήτηση
    if (searchTerm.trim() !== "") {
      return (
        product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    return true
  })

  // Χειρισμός αλλαγής εικόνας στη λίστα προϊόντων
  const handleImageNavigation = (e: React.MouseEvent, productId: string, direction: "prev" | "next") => {
    e.preventDefault()
    e.stopPropagation()

    const product = products.find((p) => p.id === productId)
    if (!product || product.images.length <= 1) return

    setCurrentImageIndices((prev) => {
      const currentIndex = prev[productId] || 0
      let newIndex

      if (direction === "prev") {
        newIndex = currentIndex === 0 ? product.images.length - 1 : currentIndex - 1
      } else {
        newIndex = currentIndex === product.images.length - 1 ? 0 : currentIndex + 1
      }

      return { ...prev, [productId]: newIndex }
    })
  }

  // Χειρισμός αλλαγής εικόνας στο modal
  const handleModalImageNavigation = (direction: "prev" | "next") => {
    if (!selectedProduct || selectedProduct.images.length <= 1) return

    if (direction === "prev") {
      setModalImageIndex((prev) => (prev === 0 ? selectedProduct.images.length - 1 : prev - 1))
    } else {
      setModalImageIndex((prev) => (prev === selectedProduct.images.length - 1 ? 0 : prev + 1))
    }
  }

  // Άνοιγμα του modal με τις λεπτομέρειες προϊόντος
  const openProductDetails = (product: Product) => {
    console.log("Opening product details:", product)
    setSelectedProduct(product)
    setModalImageIndex(0) // Επαναφορά του δείκτη εικόνας στο modal
    setActiveTab("description") // Επαναφορά στην καρτέλα περιγραφής
  }

  // Άνοιγμα του modal με την εικόνα σε μεγέθυνση
  const openImageModal = () => {
    setIsImageModalOpen(true)
  }

  // Κλείσιμο του modal με την εικόνα σε μεγέθυνση
  const closeImageModal = () => {
    setIsImageModalOpen(false)
  }

  // Μορφοποίηση τιμής
  const formatPrice = (price: number) => {
    if (price === -1) {
      return "Ρωτήστε τιμή"
    }
    return price.toLocaleString("el-GR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
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
      slideshowIntervals.current[productId] = setInterval(() => {
        setCurrentImageIndices((prev) => ({
          ...prev,
          [productId]: (prev[productId] + 1) % product.images.length,
        }))
      }, 2000) // Αλλαγή εικόνας κάθε 2 δευτερόλεπτα
    }
  }

  const handleProductMouseLeave = (productId: string) => {
    setHoveringProductId(null)

    // Σταματάμε το slideshow
    if (slideshowIntervals.current[productId]) {
      clearInterval(slideshowIntervals.current[productId])
      delete slideshowIntervals.current[productId]
    }
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

        {/* Μενού κατηγοριών - Μόνο οι κατηγορίες που ζήτησε ο χρήστης */}
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
                {categoryNames[category] || category}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => {
              const currentIndex = currentImageIndices[product.id] || 0
              const currentImage = product.images[currentIndex]?.url || "/placeholder.svg"

              return (
                <motion.div
                  key={product.id}
                  className="card-v66 overflow-hidden rounded-lg transition-all duration-300 hover:scale-[1.02] cursor-pointer"
                  whileHover={{ y: -5 }}
                  onClick={() => openProductDetails(product)}
                  onMouseEnter={() => handleProductMouseEnter(product.id)}
                  onMouseLeave={() => handleProductMouseLeave(product.id)}
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
                          onClick={(e) => handleImageNavigation(e, product.id, "prev")}
                          className="h-8 w-8 rounded-full bg-black/70 text-white flex items-center justify-center border border-cyan-700 neon-border z-10 hover:bg-cyan-900/50"
                        >
                          <ChevronLeft className="h-5 w-5" />
                        </button>
                        <button
                          onClick={(e) => handleImageNavigation(e, product.id, "next")}
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
                          <span className="text-red-400 font-bold text-lg">{formatPrice(product.discount_price)}€</span>
                          <span className="line-through text-gray-500 text-sm">{formatPrice(product.price)}€</span>
                        </div>
                      ) : (
                        <span className="text-cyan-400 font-bold text-lg">{formatPrice(product.price)}€</span>
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
                  </div>
                </motion.div>
              )
            })
          ) : (
            <div className="col-span-3 text-center py-12">
              <h3 className="text-xl font-medium text-gray-400">Δεν βρέθηκαν προϊόντα</h3>
              <p className="text-gray-500 mt-2">Δοκιμάστε διαφορετικά κριτήρια αναζήτησης</p>
            </div>
          )}
        </div>
      </div>

      {/* Modal για λεπτομέρειες προϊόντος */}
      <AnimatePresence>
        {selectedProduct && (
          <motion.div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-gray-900/90 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-auto border border-cyan-900/50 dialog-v66"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h2 className="text-3xl font-bold text-white neon-text">{selectedProduct.title}</h2>
                    <div className="flex items-center mt-2">
                      <span className="bg-cyan-900/80 text-cyan-100 px-2 py-1 rounded text-xs font-medium border border-cyan-700 flex items-center mr-2">
                        <Tag className="h-3 w-3 mr-1" />
                        {getCategoryLabel(selectedProduct.category)}
                      </span>
                      {selectedProduct.on_sale && selectedProduct.discount_percentage && (
                        <span className="bg-red-600/90 text-white px-2 py-1 rounded text-xs font-medium border border-red-500 flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          Έκπτωση {selectedProduct.discount_percentage}%
                        </span>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedProduct(null)}
                    className="text-gray-400 hover:text-white bg-gray-800 hover:bg-gray-700 rounded-full h-8 w-8 flex items-center justify-center transition-colors"
                  >
                    ✕
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Αριστερή στήλη - Εικόνες */}
                  <div>
                    {selectedProduct.images.length > 0 && (
                      <div className="mb-6">
                        {/* Κύρια εικόνα */}
                        <div className="h-72 relative mb-3 rounded-lg overflow-hidden group">
                          <Image
                            src={selectedProduct.images[modalImageIndex]?.url || "/placeholder.svg"}
                            alt={selectedProduct.title}
                            fill
                            style={{ objectFit: "cover" }}
                            className="transition-transform duration-700 group-hover:scale-110"
                          />

                          {selectedProduct.sold && (
                            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-20">
                              <div className="border-2 border-red-600 rounded-lg px-6 py-3 transform rotate-[-20deg]">
                                <span className="text-red-600 font-bold text-3xl">ΠΩΛΗΘΗΚΕ</span>
                              </div>
                            </div>
                          )}

                          {/* Overlay gradient */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>

                          {/* Κουμπί προβολής εικόνας */}
                          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                openImageModal()
                              }}
                              className="bg-black/70 text-white px-4 py-2 rounded-full flex items-center gap-2 border border-cyan-500 hover:bg-cyan-900/50 transition-colors z-10"
                            >
                              <ZoomIn className="h-5 w-5" />
                              Μεγέθυνση
                            </button>
                          </div>

                          {/* Κουμπιά πλοήγησης εικόνων */}
                          {selectedProduct.images.length > 1 && (
                            <div className="absolute inset-0 flex items-center justify-between px-4 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button
                                onClick={() => handleModalImageNavigation("prev")}
                                className="h-10 w-10 rounded-full bg-black/70 text-white flex items-center justify-center border border-cyan-700 neon-border hover:bg-cyan-900/50"
                              >
                                <ChevronLeft className="h-6 w-6" />
                              </button>
                              <button
                                onClick={() => handleModalImageNavigation("next")}
                                className="h-10 w-10 rounded-full bg-black/70 text-white flex items-center justify-center border border-cyan-700 neon-border hover:bg-cyan-900/50"
                              >
                                <ChevronRight className="h-6 w-6" />
                              </button>
                            </div>
                          )}

                          {/* Ένδειξη τρέχουσας εικόνας */}
                          {selectedProduct.images.length > 1 && (
                            <div className="absolute bottom-2 right-2 bg-black/70 text-white px-2 py-1 rounded-full text-xs backdrop-blur-sm border border-gray-700">
                              {modalImageIndex + 1}/{selectedProduct.images.length}
                            </div>
                          )}
                        </div>

                        {/* Thumbnails */}
                        {selectedProduct.images.length > 1 && (
                          <div className="grid grid-cols-5 gap-2">
                            {selectedProduct.images.map((image, index) => (
                              <button
                                key={image.id}
                                onClick={() => setModalImageIndex(index)}
                                className={`relative h-16 w-full rounded-md overflow-hidden transition-all duration-200 ${
                                  modalImageIndex === index
                                    ? "ring-2 ring-cyan-500 scale-105 z-10"
                                    : "opacity-70 hover:opacity-100"
                                }`}
                              >
                                <Image
                                  src={image.url || "/placeholder.svg"}
                                  alt={`${selectedProduct.title} - Εικόνα ${index + 1}`}
                                  fill
                                  style={{ objectFit: "cover" }}
                                />
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Τιμή και κουμπί Discord */}
                    <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700 mb-4">
                      <div className="flex justify-between items-center">
                        {selectedProduct.price === -1 ? (
                          <span className="text-cyan-400 font-bold text-2xl">Ρωτήστε τιμή</span>
                        ) : selectedProduct.on_sale && selectedProduct.discount_price ? (
                          <div className="flex flex-col">
                            <span className="text-red-400 font-bold text-2xl">
                              {formatPrice(selectedProduct.discount_price)}€
                            </span>
                            <span className="line-through text-gray-500">{formatPrice(selectedProduct.price)}€</span>
                          </div>
                        ) : (
                          <span className="text-cyan-400 font-bold text-2xl">
                            {formatPrice(selectedProduct.price)}€
                          </span>
                        )}

                        {/* Κουμπί Discord */}
                        <a
                          href={selectedProduct.sold ? "#" : DISCORD_URL}
                          target={selectedProduct.sold ? "_self" : "_blank"}
                          rel="noopener noreferrer"
                          className={`${
                            selectedProduct.sold ? "bg-gray-600 cursor-not-allowed" : "bg-[#5865F2] hover:bg-[#4752C4]"
                          } text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-colors font-medium`}
                          onClick={(e) => selectedProduct.sold && e.preventDefault()}
                        >
                          {selectedProduct.sold ? "Μη διαθέσιμο" : "Discord"}
                          {!selectedProduct.sold && <ExternalLink className="h-4 w-4" />}
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* Δεξιά στήλη - Πληροφορίες */}
                  <div>
                    {/* Tabs */}
                    <div className="flex mb-4 border-b border-gray-700">
                      <button
                        className={`px-4 py-2 font-medium text-sm ${
                          activeTab === "description"
                            ? "text-cyan-400 border-b-2 border-cyan-400"
                            : "text-gray-400 hover:text-gray-200"
                        }`}
                        onClick={() => setActiveTab("description")}
                      >
                        <Info className="h-4 w-4 inline mr-1" />
                        Περιγραφή
                      </button>
                      {selectedProduct.features && selectedProduct.features.length > 0 && (
                        <button
                          className={`px-4 py-2 font-medium text-sm ${
                            activeTab === "features"
                              ? "text-cyan-400 border-b-2 border-cyan-400"
                              : "text-gray-400 hover:text-gray-200"
                          }`}
                          onClick={() => setActiveTab("features")}
                        >
                          <Tag className="h-4 w-4 inline mr-1" />
                          Χαρακτηριστικά
                        </button>
                      )}
                    </div>

                    {/* Tab content */}
                    <div className="bg-gray-800/50 rounded-lg p-5 border border-gray-700">
                      {activeTab === "description" && (
                        <div>
                          <p className="text-gray-300 mb-4">{selectedProduct.description}</p>
                          {selectedProduct.long_description && (
                            <div className="mt-4 text-gray-300">
                              {selectedProduct.long_description.split("\n").map((paragraph, idx) => (
                                <p key={idx} className="mb-2">
                                  {paragraph}
                                </p>
                              ))}
                            </div>
                          )}
                        </div>
                      )}

                      {activeTab === "features" && selectedProduct.features && (
                        <ul className="list-disc list-inside text-gray-300 space-y-2">
                          {selectedProduct.features.map((feature, idx) => (
                            <li key={idx} className="ml-2">
                              {feature}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal για μεγέθυνση εικόνας */}
      <AnimatePresence>
        {isImageModalOpen && selectedProduct && (
          <motion.div
            className="fixed inset-0 bg-black/95 flex items-center justify-center z-[60]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeImageModal}
          >
            <div ref={imageContainerRef} className="w-[95vw] h-[95vh] relative">
              <div className="w-full h-full flex items-center justify-center">
                <Image
                  src={selectedProduct.images[modalImageIndex]?.url || "/placeholder.svg"}
                  alt={selectedProduct.title}
                  fill
                  style={{ objectFit: "contain" }}
                  quality={100}
                  priority
                  draggable={false}
                  className="scale-[0.9]" // Μικρότερη εικόνα κατά 10%
                />
              </div>

              {selectedProduct.images.length > 1 && (
                <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-4">
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleModalImageNavigation("prev")
                    }}
                    className="bg-black/70 text-white px-4 py-2 rounded-full flex items-center gap-2 border border-cyan-500"
                  >
                    <ChevronLeft className="h-5 w-5" />
                    Προηγούμενη
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleModalImageNavigation("next")
                    }}
                    className="bg-black/70 text-white px-4 py-2 rounded-full flex items-center gap-2 border border-cyan-500"
                  >
                    <ChevronRight className="h-5 w-5" />
                    Επόμενη
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
