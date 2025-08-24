"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ListFilter } from "lucide-react"

const QUICK_RESPONSES = [
  "Πώς μπορώ να συνδεθώ στον server;",
  "Υπάρχουν διαθέσιμες θέσεις εργασίας;",
  "Χρειάζομαι βοήθεια με το Discord.",
  "Πώς μπορώ να αγοράσω ένα MLO;",
  "Ποιοι είναι οι κανόνες του server;",
  "Πότε είναι η επόμενη ενημέρωση;",
  "Πώς μπορώ να αναφέρω ένα πρόβλημα;",
]

interface QuickResponsesProps {
  onSelectResponse: (response: string) => void
}

export default function QuickResponses({ onSelectResponse }: QuickResponsesProps) {
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  return (
    <div className="relative" ref={menuRef}>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsOpen(!isOpen)}
        className={`text-gray-400 hover:text-cyan-400 ${isOpen ? "text-cyan-400" : ""}`}
      >
        <ListFilter className="h-5 w-5" />
      </Button>

      {isOpen && (
        <div className="absolute bottom-full right-0 mb-2 bg-gray-900 border border-gray-800 rounded-lg shadow-lg p-2 w-64 z-50 animate-in fade-in slide-in-from-bottom-5 duration-200">
          <div className="text-xs text-gray-400 mb-2 px-2">Γρήγορες ερωτήσεις</div>
          <div className="max-h-48 overflow-y-auto pr-1 hide-scrollbar">
            {QUICK_RESPONSES.map((response, index) => (
              <button
                key={index}
                className="w-full text-left p-2 text-sm text-gray-300 hover:bg-cyan-900/30 rounded mb-1 transition-colors"
                onClick={() => {
                  onSelectResponse(response)
                  setIsOpen(false)
                }}
              >
                {response}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
