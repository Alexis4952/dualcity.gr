"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight, ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useRouter } from "next/navigation"
import Image from "next/image"

interface CarouselItem {
  id: string
  title: string
  description: string
  price: number
  images: string[]
}

interface ShopCarousel3DProps {
  items: CarouselItem[]
}

export default function ShopCarousel3D({ items }: ShopCarousel3DProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [direction, setDirection] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null)
  const router = useRouter()

  // Handle auto play
  useEffect(() => {
    if (isAutoPlaying) {
      autoPlayRef.current = setTimeout(() => {
        setDirection(1)
        setCurrentIndex((prevIndex) => (prevIndex + 1) % items.length)
      }, 5000)
    }

    return () => {
      if (autoPlayRef.current) {
        clearTimeout(autoPlayRef.current)
      }
    }
  }, [currentIndex, isAutoPlaying, items.length])

  const handleNext = () => {
    if (autoPlayRef.current) {
      clearTimeout(autoPlayRef.current)
    }
    setIsAutoPlaying(false)
    setDirection(1)
    setCurrentIndex((prevIndex) => (prevIndex + 1) % items.length)
  }

  const handlePrev = () => {
    if (autoPlayRef.current) {
      clearTimeout(autoPlayRef.current)
    }
    setIsAutoPlaying(false)
    setDirection(-1)
    setCurrentIndex((prevIndex) => (prevIndex - 1 + items.length) % items.length)
  }

  const handlePurchase = (itemId: string, title: string, price: number) => {
    router.push(`/shop/checkout?title=${encodeURIComponent(title)}&price=${price}&itemId=${itemId}`)
  }

  // Variants for animations
  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.8,
      rotateY: direction > 0 ? -30 : 30,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      rotateY: 0,
      transition: {
        duration: 0.5,
      },
    },
    exit: (direction: number) => ({
      x: direction > 0 ? -1000 : 1000,
      opacity: 0,
      scale: 0.8,
      rotateY: direction > 0 ? 30 : -30,
      transition: {
        duration: 0.5,
      },
    }),
  }

  return (
    <div className="relative w-full h-[500px] overflow-hidden">
      {/* 3D perspective container */}
      <div className="w-full h-full" style={{ perspective: "1000px" }}>
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={currentIndex}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            tial="enter"
            animate="center"
            exit="exit"
            className="absolute inset-0 flex items-center justify-center"
            style={{ transformStyle: "preserve-3d" }}
          >
            <div className="bg-gray-900/80 backdrop-blur-md border border-gray-800 rounded-xl overflow-hidden shadow-2xl w-full max-w-4xl transform-gpu">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
                {/* Image */}
                <div className="relative h-64 md:h-full overflow-hidden">
                  <Image
                    src={items[currentIndex].images[0] || "/placeholder.svg"}
                    alt={items[currentIndex].title}
                    fill
                    className="object-cover transition-transform duration-500 hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <Badge className="absolute top-4 left-4 bg-purple-600 text-white">€{items[currentIndex].price}</Badge>
                </div>

                {/* Content */}
                <div className="p-6 flex flex-col justify-between">
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-2">{items[currentIndex].title}</h3>
                    <p className="text-gray-300">{items[currentIndex].description}</p>
                  </div>
                  <div className="mt-6">
                    <Button
                      className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                      onClick={() =>
                        handlePurchase(items[currentIndex].id, items[currentIndex].title, items[currentIndex].price)
                      }
                    >
                      <ShoppingCart className="mr-2 h-4 w-4" /> Αγορά Τώρα
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation buttons */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white rounded-full h-10 w-10 z-10"
        onClick={handlePrev}
      >
        <ChevronLeft className="h-6 w-6" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white rounded-full h-10 w-10 z-10"
        onClick={handleNext}
      >
        <ChevronRight className="h-6 w-6" />
      </Button>

      {/* Indicators */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
        {items.map((_, index) => (
          <button
            key={index}
            className={`w-2 h-2 rounded-full transition-all ${index === currentIndex ? "bg-white w-4" : "bg-white/50"}`}
            onClick={() => {
              setDirection(index > currentIndex ? 1 : -1)
              setCurrentIndex(index)
              setIsAutoPlaying(false)
              if (autoPlayRef.current) {
                clearTimeout(autoPlayRef.current)
              }
            }}
          />
        ))}
      </div>
    </div>
  )
}
