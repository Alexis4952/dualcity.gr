"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Loader2, RefreshCw } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"

interface SupportAvatarProps {
  emotion: "neutral" | "happy" | "thinking" | "surprised" | "confused"
  message?: string
  thinking?: boolean
  avatarType?: "male" | "female"
}

export default function SupportAvatar({
  emotion = "neutral",
  message,
  thinking = false,
  avatarType = "male",
}: SupportAvatarProps) {
  const [isLoading, setIsLoading] = useState(true)

  // Χαρτογράφηση συναισθημάτων σε εκφράσεις προσώπου
  const getEmotionImage = () => {
    // Επιλογή avatar με βάση το φύλο
    const baseUrl = avatarType === "male" ? "/images/support-male" : "/images/support-female"

    // Επιλογή έκφρασης με βάση το συναίσθημα
    switch (emotion) {
      case "happy":
        return `${baseUrl}-happy.png`
      case "thinking":
        return `${baseUrl}-thinking.png`
      case "surprised":
        return `${baseUrl}-surprised.png`
      case "confused":
        return `${baseUrl}-confused.png`
      default:
        return `${baseUrl}-neutral.png`
    }
  }

  // Προσομοίωση φόρτωσης
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  // Για τους σκοπούς της επίδειξης, χρησιμοποιούμε placeholder εικόνες
  // Σε πραγματική εφαρμογή, θα χρησιμοποιούσαμε πραγματικές εικόνες
  const avatarSrc = getEmotionImage()
  const placeholderSrc = `/placeholder.svg?height=300&width=300&text=Support+${avatarType === "male" ? "Agent" : "Assistant"}`

  return (
    <div className="relative">
      <div className="w-64 h-64 md:w-80 md:h-80 relative rounded-lg overflow-hidden">
        {isLoading ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-900/50 z-10 rounded-lg">
            <Loader2 className="w-12 h-12 text-cyan-400 animate-spin mb-2" />
            <p className="text-white text-sm">Φόρτωση avatar...</p>
          </div>
        ) : (
          <div className={`w-full h-full flex items-center justify-center avatar-${emotion}`}>
            <div className="relative w-full h-full">
              <Image
                src={placeholderSrc || "/placeholder.svg"}
                alt={`Support ${avatarType} with ${emotion} expression`}
                fill
                className="object-cover rounded-lg"
              />

              {/* Προσθήκη εφέ ανάλογα με το συναίσθημα */}
              <div className={`absolute inset-0 bg-gradient-to-b from-transparent to-gray-900/30 rounded-lg`}></div>

              {/* Προσθήκη λάμψης για πιο επαγγελματικό look */}
              <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/10 to-purple-500/10 rounded-lg"></div>
            </div>
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
          onClick={() => setIsLoading(true)}
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Επαναφόρτωση
        </Button>
      </div>
    </div>
  )
}
