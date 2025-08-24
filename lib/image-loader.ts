export function getImageUrl(src: string | undefined, fallback = "/bustling-city-market.png"): string {
  if (!src) return fallback

  // Έλεγχος αν το src είναι έγκυρο URL
  try {
    new URL(src)
    return src
  } catch (e) {
    // Αν δεν είναι έγκυρο URL, ελέγχουμε αν είναι τοπικό path
    if (src.startsWith("/")) {
      return src
    }
    return fallback
  }
}

export function preloadImage(src: string): Promise<boolean> {
  return new Promise((resolve) => {
    const img = new Image()
    img.onload = () => resolve(true)
    img.onerror = () => resolve(false)
    img.src = src
  })
}
