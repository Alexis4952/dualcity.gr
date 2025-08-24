"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"

type AvatarEmotion = "neutral" | "happy" | "thinking" | "surprised" | "confused"
type AvatarType = "male-agent" | "female-agent" | "male-support" | "female-support"

interface HumanAvatarProps {
  emotion: AvatarEmotion
  avatarType: AvatarType
  thinking: boolean
  message?: string
}

export default function HumanAvatar({ emotion, avatarType, thinking, message }: HumanAvatarProps) {
  const [blinkFrame, setBlinkFrame] = useState(0)
  const blinkIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const messageTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Τυχαίο blinking animation
  useEffect(() => {
    const startBlinking = () => {
      // Αρχικά κλειστά μάτια
      setBlinkFrame(1)

      // Μετά από 150ms, ανοιχτά μάτια
      setTimeout(() => {
        setBlinkFrame(0)

        // Προγραμματισμός του επόμενου blink
        const nextBlinkDelay = 3000 + Math.random() * 5000 // Μεταξύ 3-8 δευτερολέπτων
        blinkIntervalRef.current = setTimeout(startBlinking, nextBlinkDelay)
      }, 150)
    }

    // Αρχικό blink μετά από τυχαίο χρόνο
    blinkIntervalRef.current = setTimeout(startBlinking, 1000 + Math.random() * 3000)

    return () => {
      if (blinkIntervalRef.current) {
        clearTimeout(blinkIntervalRef.current)
      }
    }
  }, [])

  // Επιλογή της σωστής εικόνας με βάση τον τύπο και το συναίσθημα
  const getAvatarImageUrl = () => {
    // Για τους σκοπούς της επίδειξης, χρησιμοποιούμε placeholders
    // Σε πραγματική εφαρμογή, θα χρησιμοποιούσαμε πραγματικές εικόνες ανθρώπων

    // Δημιουργία ενός μοναδικού seed για κάθε συνδυασμό τύπου/συναισθήματος
    const seed = `${avatarType}-${emotion}`.replace(/[^a-z0-9]/gi, "")

    // Χρήση του Dicebear API για τη δημιουργία ρεαλιστικών ανθρώπινων avatars
    // Το "personas" collection έχει ρεαλιστικά πρόσωπα
    return `https://api.dicebear.com/7.x/personas/svg?seed=${seed}&backgroundColor=b6e3f4`
  }

  // Δημιουργία διαφορετικών URLs για διαφορετικές εκφράσεις
  const avatarUrl = getAvatarImageUrl()

  return (
    <div className="relative">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", damping: 12 }}
        className="relative"
      >
        <div className="w-60 h-60 md:w-72 md:h-72 relative rounded-full overflow-hidden bg-gradient-to-b from-blue-100 to-blue-200 p-1">
          <Image
            src={avatarUrl || "/placeholder.svg"}
            alt={`${avatarType} with ${emotion} expression`}
            width={300}
            height={300}
            className="rounded-full object-cover"
          />

          {/* Subtle glow effect */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-b from-purple-600/20 to-cyan-600/20 opacity-50 blur-md -z-10"></div>
        </div>
      </motion.div>

      {/* Thinking bubble */}
      <AnimatePresence>
        {thinking && message && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.9 }}
            className="absolute -top-16 -right-4 md:right-0 bg-white p-4 rounded-2xl max-w-xs z-10 thinking-bubble"
          >
            <p className="text-gray-800 text-sm md:text-base">{message}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
