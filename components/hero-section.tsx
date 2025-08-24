"use client"

import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { ChevronRight } from "lucide-react"
import Image from "next/image"

export default function HeroSection() {
  const [scrollY, setScrollY] = useState(0)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particlesRef = useRef<Particle[]>([])
  const animationRef = useRef<number>(0)

  // Particle class
  class Particle {
    x: number
    y: number
    size: number
    speedX: number
    speedY: number
    color: string

    constructor(canvas: HTMLCanvasElement) {
      this.x = Math.random() * canvas.width
      this.y = Math.random() * canvas.height
      this.size = Math.random() * 3 + 1
      this.speedX = Math.random() * 2 - 1
      this.speedY = Math.random() * 2 - 1
      this.color = `rgba(${Math.floor(Math.random() * 160) + 95}, ${Math.floor(Math.random() * 160) + 95}, ${
        Math.floor(Math.random() * 160) + 95
      }, ${Math.random() * 0.5 + 0.2})`
    }

    update(canvas: HTMLCanvasElement) {
      this.x += this.speedX
      this.y += this.speedY

      if (this.x > canvas.width || this.x < 0) {
        this.speedX = -this.speedX
      }
      if (this.y > canvas.height || this.y < 0) {
        this.speedY = -this.speedY
      }
    }

    draw(ctx: CanvasRenderingContext2D) {
      ctx.fillStyle = this.color
      ctx.beginPath()
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
      ctx.fill()
    }
  }

  // Initialize particles
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const handleResize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight

      // Reinitialize particles
      particlesRef.current = []
      for (let i = 0; i < 100; i++) {
        particlesRef.current.push(new Particle(canvas))
      }
    }

    handleResize()
    window.addEventListener("resize", handleResize)

    // Animation loop
    const animate = () => {
      const ctx = canvas.getContext("2d")
      if (!ctx) return

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      particlesRef.current.forEach((particle) => {
        particle.update(canvas)
        particle.draw(ctx)
      })

      // Connect particles with lines
      connectParticles(ctx)

      animationRef.current = requestAnimationFrame(animate)
    }

    const connectParticles = (ctx: CanvasRenderingContext2D) => {
      const maxDistance = 150
      for (let a = 0; a < particlesRef.current.length; a++) {
        for (let b = a; b < particlesRef.current.length; b++) {
          const dx = particlesRef.current[a].x - particlesRef.current[b].x
          const dy = particlesRef.current[a].y - particlesRef.current[b].y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < maxDistance) {
            const opacity = 1 - distance / maxDistance
            ctx.strokeStyle = `rgba(150, 150, 255, ${opacity * 0.2})`
            ctx.lineWidth = 1
            ctx.beginPath()
            ctx.moveTo(particlesRef.current[a].x, particlesRef.current[a].y)
            ctx.lineTo(particlesRef.current[b].x, particlesRef.current[b].y)
            ctx.stroke()
          }
        }
      }
    }

    animate()

    return () => {
      window.removeEventListener("resize", handleResize)
      cancelAnimationFrame(animationRef.current)
    }
  }, [])

  // Parallax effect
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <section className="relative h-screen flex flex-col items-center justify-center overflow-hidden">
      {/* Particle canvas background */}
      <canvas ref={canvasRef} className="absolute inset-0 z-0" />

      {/* Parallax elements */}
      <div
        className="absolute inset-0 z-10 opacity-20"
        style={{
          backgroundImage: "url('/images/city-silhouette.png')",
          backgroundSize: "cover",
          backgroundPosition: "center bottom",
          transform: `translateY(${scrollY * 0.2}px)`,
        }}
      />

      <div
        className="absolute inset-0 z-20 opacity-30"
        style={{
          backgroundImage: "url('/images/grid.png')",
          backgroundSize: "cover",
          transform: `translateY(${scrollY * 0.1}px)`,
        }}
      />

      {/* Content */}
      <div className="container relative z-30 text-center px-4">
        <div className="flex flex-col items-center justify-center">
          {/* Animated Logo */}
          <div className="mb-8 animate-float">
            <Image src="/images/new-logo.png" alt="Dual City Logo" width={180} height={180} />
          </div>

          <h1 className="text-4xl md:text-6xl font-bold mb-4 relative">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-pink-600 drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">
              Dual City
            </span>
            <span className="absolute -inset-x-1 -inset-y-1 bg-gradient-to-r from-cyan-400 to-pink-600 opacity-20 blur-md -z-10"></span>
          </h1>

          <p className="text-xl md:text-2xl mb-8 max-w-2xl text-gray-300">
            Ζήστε την απόλυτη εμπειρία roleplay στον πιο προηγμένο FiveM server
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white px-8 py-6 text-lg rounded-full relative overflow-hidden group"
              onClick={() => window.open("https://cfx.re/join/o8lojy", "_blank")}
            >
              <span className="absolute top-0 left-0 w-full h-full bg-white/20 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300"></span>
              Σύνδεση στον Server <ChevronRight className="ml-2 h-5 w-5" />
            </Button>

            <Button
              variant="outline"
              className="border-cyan-500 text-cyan-400 hover:bg-cyan-950/50 px-8 py-6 text-lg rounded-full relative overflow-hidden group bg-transparent"
              onClick={() => window.open("https://discord.gg/PdMYvK7WGN", "_blank")}
            >
              <span className="absolute top-0 left-0 w-full h-full bg-cyan-500/10 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300"></span>
              Discord Community
            </Button>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-30 animate-bounce">
        <div className="w-8 h-12 rounded-full border-2 border-white/30 flex justify-center">
          <div className="w-1 h-3 bg-white/50 rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </section>
  )
}
