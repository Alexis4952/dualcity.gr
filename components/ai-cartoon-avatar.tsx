"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Loader2, RefreshCw } from "lucide-react"

interface AiCartoonAvatarProps {
  emotion: "neutral" | "happy" | "thinking" | "surprised" | "confused"
}

export default function AiCartoonAvatar({ emotion = "neutral" }: AiCartoonAvatarProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
  const [seed, setSeed] = useState<number>(Math.floor(Math.random() * 1000))

  // Χαρτογράφηση συναισθημάτων σε στυλ του API
  const emotionToStyle = {
    neutral: "pixar",
    happy: "pixar-smile",
    thinking: "pixar-thoughtful",
    surprised: "pixar-surprised",
    confused: "pixar-confused",
  }

  useEffect(() => {
    // Φόρτωση του avatar από το API
    const loadAvatar = async () => {
      setIsLoading(true)

      // Χρησιμοποιούμε το Avatars API για τη δημιουργία cartoon avatar
      // Σημείωση: Αυτό είναι ένα παράδειγμα URL, θα χρειαστεί να χρησιμοποιήσετε ένα πραγματικό API
      const style = emotionToStyle[emotion]
      const gender = "male" // Μπορείτε να το κάνετε παράμετρο

      // Προσομοίωση φόρτωσης από API
      setTimeout(() => {
        // Σε πραγματική εφαρμογή, εδώ θα γινόταν κλήση σε API
        // Για την επίδειξη, χρησιμοποιούμε μια στατική εικόνα
        setAvatarUrl(
          `https://api.dicebear.com/7.x/bottts/svg?seed=${seed}&backgroundColor=ffdfbf,ffd5dc,d1d4f9,c0aede,b6e3f4`,
        )
        setIsLoading(false)
      }, 1000)
    }

    loadAvatar()
  }, [emotion, seed])

  const regenerateAvatar = () => {
    setSeed(Math.floor(Math.random() * 1000))
  }

  return (
    <div className="relative">
      <div className="w-64 h-64 md:w-80 md:h-80 relative rounded-lg overflow-hidden bg-gradient-to-b from-gray-800 to-gray-900 flex items-center justify-center">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center">
            <Loader2 className="w-12 h-12 text-cyan-500 animate-spin mb-2" />
            <p className="text-white text-sm">Φόρτωση avatar...</p>
          </div>
        ) : (
          avatarUrl && (
            <img
              src={avatarUrl || "/placeholder.svg"}
              alt={`Avatar with ${emotion} emotion`}
              className="w-full h-full object-contain"
            />
          )
        )}
      </div>
      <div className="mt-2 flex justify-center">
        <Button
          variant="outline"
          size="sm"
          className="bg-gray-900/70 border-gray-700 text-gray-300 hover:text-cyan-400"
          onClick={regenerateAvatar}
          disabled={isLoading}
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Νέο Avatar
        </Button>
      </div>
    </div>
  )
}
