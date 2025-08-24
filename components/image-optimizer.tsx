"use client"

import { useState } from "react"
import Image, { type ImageProps } from "next/image"

interface OptimizedImageProps extends Omit<ImageProps, "onLoad" | "loading"> {
  fallbackSrc?: string
}

export default function OptimizedImage({
  src,
  alt,
  fallbackSrc = "/bustling-city-market.png",
  ...props
}: OptimizedImageProps) {
  const [error, setError] = useState(false)

  return (
    <div className={`relative ${props.className || ""}`} style={{ ...props.style }}>
      <Image
        {...props}
        src={error ? fallbackSrc : src}
        alt={alt}
        className={`${props.className || ""} transition-all duration-300`}
        onError={() => setError(true)}
        loading="lazy"
        sizes={props.sizes || "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"}
        quality={props.quality || 75}
      />
    </div>
  )
}
