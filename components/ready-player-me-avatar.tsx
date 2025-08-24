"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Loader2, RefreshCw } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface ReadyPlayerMeAvatarProps {
  emotion: "neutral" | "happy" | "thinking" | "surprised" | "confused"
  message?: string
  thinking?: boolean
}

export default function ReadyPlayerMeAvatar({
  emotion = "neutral",
  message,
  thinking = false,
}: ReadyPlayerMeAvatarProps) {
  const [isLoading, setIsLoading] = useState(true)
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Χαρτογράφηση συναισθημάτων σε εκφράσεις του Ready Player Me API
  const emotionToExpression = {
    neutral: "neutral",
    happy: "happy",
    thinking: "thoughtful",
    surprised: "surprised",
    confused: "confused",
  }

  useEffect(() => {
    // Ενημέρωση του avatar όταν αλλάζει το συναίσθημα
    if (iframeRef.current && iframeRef.current.contentWindow) {
      try {
        iframeRef.current.contentWindow.postMessage(
          {
            target: "readyplayerme",
            type: "expression",
            data: emotionToExpression[emotion],
          },
          "*",
        )
      } catch (error) {
        console.error("Failed to update avatar expression:", error)
      }
    }
  }, [emotion])

  // Χειρισμός μηνυμάτων από το iframe
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data.source !== "readyplayerme") {
        return
      }

      // Έλεγχος για διάφορα events από το iframe
      switch (event.data.eventName) {
        case "v1.frame.ready":
          setIsLoading(false)
          break
        case "v1.avatar.loaded":
          setIsLoading(false)
          break
        case "v1.user.set":
          setIsLoading(false)
          break
      }
    }

    window.addEventListener("message", handleMessage)
    return () => window.removeEventListener("message", handleMessage)
  }, [])

  return (
    <div className="relative" ref={containerRef}>
      <div className="w-64 h-64 md:w-80 md:h-80 relative rounded-lg overflow-hidden">
        {isLoading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-900/50 z-10 rounded-lg">
            <Loader2 className="w-12 h-12 text-cyan-500 animate-spin mb-2" />
            <p className="text-white text-sm">Φόρτωση avatar...</p>
          </div>
        )}
        <iframe
          ref={iframeRef}
          className="w-full h-full"
          allow="camera *; microphone *"
          src="https://models.readyplayer.me/64d3a7df9673b5e9c5e8e5c1.glb?morphTargets=ARKit&textureAtlas=1024&quality=medium&pose=A&cameraTarget=head"
          title="Ready Player Me Avatar"
        ></iframe>
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
          onClick={() => {
            if (iframeRef.current) {
              iframeRef.current.src = iframeRef.current.src
            }
          }}
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Επαναφόρτωση Avatar
        </Button>
      </div>
    </div>
  )
}
