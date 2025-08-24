"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Loader2, RefreshCw } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"

interface FallbackAvatarProps {
  emotion: "neutral" | "happy" | "thinking" | "surprised" | "confused"
  message?: string
  thinking?: boolean
}

export default function FallbackAvatar({ emotion = "neutral", message, thinking = false }: FallbackAvatarProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [avatarSeed, setAvatarSeed] = useState(Math.floor(Math.random() * 1000))

  // Χαρτογράφηση συναισθημάτων σε στυλ του Dicebear API
  const emotionToStyle = {
    neutral: "neutral",
    happy: "happy",
    thinking: "concerned",
    surprised: "surprised",
    confused: "confused",
  }

  // Προσομοίωση φόρτωσης
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [avatarSeed])

  // Δημιουργία URL για το Dicebear API
  const getAvatarUrl = () => {
    return `https://api.dicebear.com/7.x/adventurer/svg?seed=${avatarSeed}&mouth=${emotionToStyle[emotion]}`
  }

  const regenerateAvatar = () => {
    setIsLoading(true)
    setAvatarSeed(Math.floor(Math.random() * 1000))
  }

  return (
    <div className="relative">
      <div className="w-64 h-64 md:w-80 md:h-80 relative rounded-lg overflow-hidden bg-gradient-to-b from-gray-800 to-gray-900">
        {isLoading ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-900/50 z-10 rounded-lg">
            <Loader2 className="w-12 h-12 text-cyan-500 animate-spin mb-2" />
            <p className="text-white text-sm">Φόρτωση avatar...</p>
          </div>
        ) : (
          <div className={`w-full h-full flex items-center justify-center avatar-${emotion}`}>
            <Image
              src={getAvatarUrl() || "/placeholder.svg"}
              alt={`Avatar with ${emotion} emotion`}
              width={240}
              height={240}
              className="w-3/4 h-3/4 object-contain"
            />
          </div>
        )}
      </div>

      {/* Συννεφάκι σκέψης */}
      <AnimatePresence>
        {thinking && message && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.9 }}
            className="absolute -top-20 left-1/2 -translate-x-1/2 bg-white p-4 rounded-2xl max-w-xs z-10 thinking-bubble"
          >
            <p className="text-gray-800 text-sm md:text-base">{message}</p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mt-2 text-center">
        <Button
          variant="outline"
          size="sm"
          className="bg-gray-900/70 border-gray-700 text-gray-300 hover:text-cyan-400"
          onClick={regenerateAvatar}
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Νέο Avatar
        </Button>
      </div>
    </div>
  )
}
