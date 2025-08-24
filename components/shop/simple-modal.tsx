"use client"

import type React from "react"
import { useEffect, useRef } from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface SimpleModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
}

export default function SimpleModal({ isOpen, onClose, title, children }: SimpleModalProps) {
  const modalRef = useRef<HTMLDivElement>(null)

  // Κλείσιμο του modal όταν κάνουμε κλικ έξω από αυτό
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose()
      }
    }

    // Απενεργοποίηση του scroll στο body όταν το modal είναι ανοιχτό
    if (isOpen) {
      document.body.style.overflow = "hidden"
      document.addEventListener("mousedown", handleClickOutside)
    } else {
      document.body.style.overflow = "auto"
    }

    return () => {
      document.body.style.overflow = "auto"
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isOpen, onClose])

  // Κλείσιμο του modal με το πλήκτρο Escape
  useEffect(() => {
    function handleEscapeKey(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener("keydown", handleEscapeKey)
    }

    return () => {
      document.removeEventListener("keydown", handleEscapeKey)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 bg-black bg-opacity-95">
      <div
        ref={modalRef}
        className="relative w-full max-w-[95vw] max-h-[98vh] overflow-y-auto bg-gray-900 text-white border border-gray-800 rounded-lg shadow-xl"
      >
        <div className="sticky top-0 z-10 flex items-center justify-between p-4 border-b border-gray-800 bg-gray-900">
          <h2 className="text-2xl font-bold text-purple-400">{title}</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-gray-400 hover:text-white"
            aria-label="Κλείσιμο"
          >
            <X className="h-6 w-6" />
          </Button>
        </div>
        <div className="p-8">{children}</div>
      </div>
    </div>
  )
}
