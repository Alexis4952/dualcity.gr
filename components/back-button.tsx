"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ChevronLeft } from "lucide-react"

export default function BackButton() {
  const router = useRouter()

  return (
    <div className="fixed top-20 left-4 z-50">
      <Button
        variant="ghost"
        size="icon"
        className="bg-black/50 backdrop-blur-sm border border-gray-800 hover:bg-gray-800/50 text-white rounded-full w-10 h-10"
        onClick={() => router.back()}
        aria-label="Πίσω"
      >
        <ChevronLeft className="h-5 w-5" />
      </Button>
    </div>
  )
}
