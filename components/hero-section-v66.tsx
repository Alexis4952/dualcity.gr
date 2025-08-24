"use client"

import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { ChevronRight, ExternalLink } from "lucide-react"
import Image from "next/image"
import { motion } from "framer-motion"

export default function HeroSectionV66() {
  const [scrollY, setScrollY] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)

  // Parallax effect
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY)
    }

    window.addEventListener("scroll", handleScroll)
    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  // Text animation variants
  const titleVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut",
      },
    },
  }

  const subtitleVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        delay: 0.3,
        ease: "easeOut",
      },
    },
  }

  const buttonVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        delay: 0.6,
        ease: "easeOut",
      },
    },
  }

  return (
    <section ref={containerRef} className="relative h-screen flex flex-col items-center justify-center overflow-hidden">
      {/* Content */}
      <div className="container relative z-30 text-center px-4 flex flex-col items-center">
        {/* Animated Logo */}
        <motion.div
          className="mb-8"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{
            duration: 0.8,
            type: "spring",
            bounce: 0.4,
          }}
        >
          <motion.div
            className="relative"
            animate={{ y: [0, -8, 0] }}
            transition={{
              duration: 4,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
          >
            <Image src="/images/new-logo.png" alt="Dual City Logo" width={180} height={180} className="relative z-10" />
          </motion.div>
        </motion.div>

        <motion.h1
          className="text-4xl md:text-6xl font-bold mb-4"
          variants={titleVariants}
          initial="hidden"
          animate="visible"
        >
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-pink-600 drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)]">
            Dual City
          </span>
        </motion.h1>

        <motion.p
          className="text-xl md:text-2xl mb-8 max-w-2xl text-gray-300"
          variants={subtitleVariants}
          initial="hidden"
          animate="visible"
        >
          Ζήστε την απόλυτη εμπειρία roleplay στον πιο προηγμένο FiveM server
        </motion.p>

        <motion.div
          className="flex flex-col sm:flex-row gap-4"
          variants={buttonVariants}
          initial="hidden"
          animate="visible"
        >
          <Button
            className="bg-gradient-to-r from-cyan-900 to-cyan-700 hover:from-cyan-800 hover:to-cyan-600 text-white px-8 py-6 text-lg rounded-full relative overflow-hidden group"
            onClick={() => window.open("https://cfx.re/join/rj49b7", "_blank")}
          >
            Σύνδεση στον Server <ChevronRight className="ml-2 h-5 w-5" />
          </Button>

          <Button
            variant="outline"
            className="border-cyan-700 text-cyan-400 hover:bg-cyan-950 px-8 py-6 text-lg rounded-full relative overflow-hidden group"
            onClick={() => window.open("https://discord.gg/ztH8UdKxGU", "_blank")}
          >
            <ExternalLink className="mr-2 h-5 w-5" /> Discord Community
          </Button>
        </motion.div>
      </div>
    </section>
  )
}
