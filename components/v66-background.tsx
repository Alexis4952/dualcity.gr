"use client"

import { useEffect, useRef } from "react"

export function V66Background({ animated = true }: { animated?: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions
    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    // Create stars
    const stars: Star[] = []
    const starCount = 300

    class Star {
      x: number
      y: number
      size: number
      color: string
      twinkleSpeed: number
      twinklePhase: number

      constructor() {
        this.x = Math.random() * canvas.width
        this.y = Math.random() * canvas.height
        this.size = Math.random() * 2 + 0.5
        this.color = "#ffffff"
        this.twinkleSpeed = Math.random() * 0.03 + 0.01
        this.twinklePhase = Math.random() * Math.PI * 2
      }

      update() {
        // Twinkle effect
        this.twinklePhase += this.twinkleSpeed
        if (this.twinklePhase > Math.PI * 2) {
          this.twinklePhase = 0
        }
      }

      draw() {
        const twinkleFactor = (Math.sin(this.twinklePhase) + 1) * 0.5
        const opacity = 0.2 + twinkleFactor * 0.8
        const size = this.size * (0.5 + twinkleFactor * 0.5)

        ctx.beginPath()
        ctx.arc(this.x, this.y, size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`
        ctx.fill()
      }
    }

    // Initialize stars
    for (let i = 0; i < starCount; i++) {
      stars.push(new Star())
    }

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Fill background with dark color
      ctx.fillStyle = "#050816"
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Draw stars
      stars.forEach((star) => {
        star.update()
        star.draw()
      })

      requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener("resize", resizeCanvas)
    }
  }, [])

  return (
    <div className="fixed inset-0 z-[-1]">
      <canvas ref={canvasRef} className="absolute inset-0" />
      {!animated && (
        <>
          {/* Διακοσμητικά στοιχεία - Οριζόντιες γραμμές */}
          <div className="absolute inset-0">
            {Array.from({ length: 10 }).map((_, i) => (
              <div
                key={`line-${i}`}
                className="absolute h-[1px] w-full opacity-20"
                style={{
                  top: `${10 + i * 10}%`,
                  background:
                    "linear-gradient(90deg, transparent 0%, rgba(0, 204, 255, 0.3) 20%, rgba(0, 204, 255, 0.6) 50%, rgba(0, 204, 255, 0.3) 80%, transparent 100%)",
                  boxShadow: "0 0 15px rgba(0, 204, 255, 0.5)",
                }}
              />
            ))}
          </div>

          {/* Κύκλοι στο background */}
          <div
            className="absolute top-[10%] right-[5%] w-[300px] h-[300px] rounded-full opacity-10"
            style={{
              background:
                "radial-gradient(circle, rgba(0, 204, 255, 0.4) 0%, rgba(0, 204, 255, 0.1) 50%, transparent 70%)",
              filter: "blur(40px)",
            }}
          />

          <div
            className="absolute bottom-[15%] left-[10%] w-[400px] h-[400px] rounded-full opacity-10"
            style={{
              background:
                "radial-gradient(circle, rgba(128, 0, 255, 0.4) 0%, rgba(128, 0, 255, 0.1) 50%, transparent 70%)",
              filter: "blur(50px)",
            }}
          />

          {/* Εξαγωνικό pattern */}
          <div
            className="absolute inset-0 opacity-5"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0l25.98 15v30L30 60 4.02 45V15L30 0z' fillRule='evenodd' stroke='%23ffffff' strokeWidth='1' fill='none'/%3E%3C/svg%3E")`,
              backgroundSize: "60px 60px",
            }}
          />

          {/* Αστέρια */}
          <div
            className="absolute inset-0 opacity-30"
            style={{
              backgroundImage: `radial-gradient(circle, rgba(255,255,255,0.3) 1px, transparent 1px)`,
              backgroundSize: "70px 70px",
            }}
          />

          {/* Διακοσμητικό στοιχείο - Γωνίες */}
          <div className="absolute top-0 left-0 w-[100px] h-[100px] opacity-30">
            <div className="absolute top-0 left-0 w-[50px] h-[2px] bg-cyan-500"></div>
            <div className="absolute top-0 left-0 w-[2px] h-[50px] bg-cyan-500"></div>
          </div>

          <div className="absolute top-0 right-0 w-[100px] h-[100px] opacity-30">
            <div className="absolute top-0 right-0 w-[50px] h-[2px] bg-purple-500"></div>
            <div className="absolute top-0 right-0 w-[2px] h-[50px] bg-purple-500"></div>
          </div>

          <div className="absolute bottom-0 left-0 w-[100px] h-[100px] opacity-30">
            <div className="absolute bottom-0 left-0 w-[50px] h-[2px] bg-purple-500"></div>
            <div className="absolute bottom-0 left-0 w-[2px] h-[50px] bg-purple-500"></div>
          </div>

          <div className="absolute bottom-0 right-0 w-[100px] h-[100px] opacity-30">
            <div className="absolute bottom-0 right-0 w-[50px] h-[2px] bg-cyan-500"></div>
            <div className="absolute bottom-0 right-0 w-[2px] h-[50px] bg-cyan-500"></div>
          </div>
        </>
      )}
    </div>
  )
}

interface Star {
  x: number
  y: number
  size: number
  color: string
  twinkleSpeed: number
  twinklePhase: number
  update: () => void
  draw: () => void
}
