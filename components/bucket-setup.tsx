"use client"

import { useEffect, useState } from "react"
import { toast } from "@/components/ui/use-toast"

export function BucketSetup() {
  const [isChecking, setIsChecking] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const checkBucket = async () => {
      try {
        const response = await fetch("/api/setup-bucket")
        const data = await response.json()

        if (!data.success) {
          console.error("Bucket setup error:", data.message)
          setError(data.message)

          // Εμφάνιση toast μόνο σε περιβάλλον development
          if (process.env.NODE_ENV === "development") {
            toast({
              title: "Σφάλμα ρύθμισης bucket",
              description: data.message,
              variant: "destructive",
            })
          }
        } else {
          console.log("Bucket setup successful:", data.message)
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error during bucket setup"
        console.error("Error checking bucket:", errorMessage)
        setError(errorMessage)

        // Εμφάνιση toast μόνο σε περιβάλλον development
        if (process.env.NODE_ENV === "development") {
          toast({
            title: "Σφάλμα ρύθμισης bucket",
            description: errorMessage,
            variant: "destructive",
          })
        }
      } finally {
        setIsChecking(false)
      }
    }

    // Εκτέλεση του ελέγχου μόνο σε περιβάλλον παραγωγής ή αν υπάρχουν οι μεταβλητές περιβάλλοντος
    if (
      process.env.NODE_ENV === "production" ||
      (typeof window !== "undefined" && window.ENV && window.ENV.NEXT_PUBLIC_SUPABASE_URL)
    ) {
      checkBucket()
    } else {
      setIsChecking(false)
      console.log("Skipping bucket setup in development environment without Supabase configuration")
    }
  }, [])

  // Δεν εμφανίζουμε τίποτα στο UI
  return null
}
