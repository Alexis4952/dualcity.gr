"use client"

import { useState, useEffect } from "react"

interface FallbackImageProps {
  src: string
  alt: string
  fallbackSrc?: string
  className?: string
  width?: number
  height?: number
}

export default function FallbackImage({
  src,
  alt,
  fallbackSrc = "/bustling-city-market.png",
  className = "",
  width,
  height,
}: FallbackImageProps) {
  const [imgSrc, setImgSrc] = useState<string>(src)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setImgSrc(src)
    setIsLoading(true)
  }, [src])

  return (
    <div className={`relative ${isLoading ? "bg-gray-200 animate-pulse" : ""}`}>
      <img
        src={imgSrc || "/placeholder.svg"}
        alt={alt}
        className={className}
        width={width}
        height={height}
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setImgSrc(fallbackSrc)
          setIsLoading(false)
        }}
        loading="lazy"
      />
    </div>
  )
}
