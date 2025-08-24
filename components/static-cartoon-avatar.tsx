"use client"

import { useState, useEffect } from "react"
import { Loader2 } from "lucide-react"

interface StaticCartoonAvatarProps {
  emotion: "neutral" | "happy" | "thinking" | "surprised" | "confused"
}

export default function StaticCartoonAvatar({ emotion = "neutral" }: StaticCartoonAvatarProps) {
  const [isLoading, setIsLoading] = useState(true)

  // Χαρτογράφηση συναισθημάτων σε εικόνες
  const emotionToImage = {
    neutral: "/avatars/cartoon-neutral.png",
    happy: "/avatars/cartoon-happy.png",
    thinking: "/avatars/cartoon-thinking.png",
    surprised: "/avatars/cartoon-surprised.png",
    confused: "/avatars/cartoon-confused.png",
  }

  useEffect(() => {
    // Προφόρτωση της εικόνας
    const img = new Image()
    img.src = emotionToImage[emotion]
    img.onload = () => setIsLoading(false)
  }, [emotion])

  return (
    <div className="relative">
      <div className="w-64 h-64 md:w-80 md:h-80 relative rounded-lg overflow-hidden bg-gradient-to-b from-gray-800 to-gray-900 flex items-center justify-center">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center">
            <Loader2 className="w-12 h-12 text-cyan-500 animate-spin mb-2" />
            <p className="text-white text-sm">Φόρτωση avatar...</p>
          </div>
        ) : (
          <img
            src={emotionToImage[emotion] || "/placeholder.svg"}
            alt={`Avatar with ${emotion} emotion`}
            className="w-full h-full object-contain"
          />
        )}
      </div>
    </div>
  )
}
