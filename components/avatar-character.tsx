"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"

type AvatarEmotion = "neutral" | "happy" | "thinking" | "surprised" | "confused" | "excited"
type AvatarCharacter = "robot" | "agent" | "alien" | "neon"

interface AvatarCharacterProps {
  emotion: AvatarEmotion
  character: AvatarCharacter
  speaking: boolean
  message?: string
}

export default function AvatarCharacter({ emotion, character, speaking, message }: AvatarCharacterProps) {
  const [currentFrame, setCurrentFrame] = useState(0)
  const [showMessage, setShowMessage] = useState(false)
  const messageTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Εναλλαγή frames για animation
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFrame((prev) => (prev + 1) % 3)
    }, 150)

    return () => clearInterval(interval)
  }, [])

  // Εμφάνιση μηνύματος με καθυστέρηση
  useEffect(() => {
    if (message) {
      setShowMessage(true)

      if (messageTimeoutRef.current) {
        clearTimeout(messageTimeoutRef.current)
      }

      messageTimeoutRef.current = setTimeout(() => {
        setShowMessage(false)
      }, 5000)
    }

    return () => {
      if (messageTimeoutRef.current) {
        clearTimeout(messageTimeoutRef.current)
      }
    }
  }, [message])

  // Επιλογή του σωστού avatar με βάση τον χαρακτήρα και το συναίσθημα
  const getAvatarSrc = () => {
    const frameIndex = speaking ? currentFrame : 0

    switch (character) {
      case "robot":
        switch (emotion) {
          case "happy":
            return `/avatars/robot-happy-${frameIndex}.png`
          case "thinking":
            return `/avatars/robot-thinking-${frameIndex}.png`
          case "surprised":
            return `/avatars/robot-surprised-${frameIndex}.png`
          case "confused":
            return `/avatars/robot-confused-${frameIndex}.png`
          case "excited":
            return `/avatars/robot-excited-${frameIndex}.png`
          default:
            return `/avatars/robot-neutral-${frameIndex}.png`
        }
      case "agent":
        switch (emotion) {
          case "happy":
            return `/avatars/agent-happy-${frameIndex}.png`
          case "thinking":
            return `/avatars/agent-thinking-${frameIndex}.png`
          case "surprised":
            return `/avatars/agent-surprised-${frameIndex}.png`
          case "confused":
            return `/avatars/agent-confused-${frameIndex}.png`
          case "excited":
            return `/avatars/agent-excited-${frameIndex}.png`
          default:
            return `/avatars/agent-neutral-${frameIndex}.png`
        }
      case "alien":
        switch (emotion) {
          case "happy":
            return `/avatars/alien-happy-${frameIndex}.png`
          case "thinking":
            return `/avatars/alien-thinking-${frameIndex}.png`
          case "surprised":
            return `/avatars/alien-surprised-${frameIndex}.png`
          case "confused":
            return `/avatars/alien-confused-${frameIndex}.png`
          case "excited":
            return `/avatars/alien-excited-${frameIndex}.png`
          default:
            return `/avatars/alien-neutral-${frameIndex}.png`
        }
      case "neon":
        switch (emotion) {
          case "happy":
            return `/avatars/neon-happy-${frameIndex}.png`
          case "thinking":
            return `/avatars/neon-thinking-${frameIndex}.png`
          case "surprised":
            return `/avatars/neon-surprised-${frameIndex}.png`
          case "confused":
            return `/avatars/neon-confused-${frameIndex}.png`
          case "excited":
            return `/avatars/neon-excited-${frameIndex}.png`
          default:
            return `/avatars/neon-neutral-${frameIndex}.png`
        }
      default:
        return `/avatars/robot-neutral-${frameIndex}.png`
    }
  }

  // Για τους σκοπούς της επίδειξης, χρησιμοποιούμε placeholder εικόνες
  // Σε πραγματική εφαρμογή, θα χρησιμοποιούσαμε πραγματικά animated avatars
  const avatarSrc = getAvatarSrc()

  // Χρησιμοποιούμε placeholder για την επίδειξη
  const placeholderSrc = `/placeholder.svg?height=200&width=200`

  return (
    <div className="relative">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        transition={{ type: "spring", damping: 12 }}
        className="relative"
      >
        <div className="w-32 h-32 md:w-40 md:h-40 relative">
          <Image
            src={placeholderSrc || "/placeholder.svg"}
            alt={`${character} avatar`}
            width={160}
            height={160}
            className="rounded-full bg-gradient-to-r from-purple-600 to-cyan-600 p-1"
          />

          {/* Animated glow effect */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-600 to-cyan-600 opacity-30 blur-md -z-10"></div>

          {/* Animated pulse */}
          {speaking && (
            <div className="absolute inset-0 rounded-full border-4 border-cyan-500 animate-ping opacity-20"></div>
          )}
        </div>
      </motion.div>

      {/* Speech bubble */}
      <AnimatePresence>
        {showMessage && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.9 }}
            className="absolute top-0 left-full ml-4 bg-gray-900 border border-gray-800 p-3 rounded-lg max-w-xs z-10"
          >
            <div className="absolute left-0 top-1/2 transform -translate-x-2 -translate-y-1/2 w-0 h-0 border-t-8 border-r-8 border-b-8 border-transparent border-r-gray-900"></div>
            <p className="text-white text-sm">{message}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
