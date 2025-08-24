"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Smile } from "lucide-react"

const EMOJI_CATEGORIES = [
  {
    name: "Smileys",
    emojis: ["😀", "😃", "😄", "😁", "😆", "😅", "😂", "🤣", "😊", "😇", "🙂", "🙃", "😉", "😌", "😍", "🥰", "😘"],
  },
  {
    name: "Gestures",
    emojis: ["👍", "👎", "👌", "✌️", "🤞", "🤟", "🤘", "🤙", "👈", "👉", "👆", "👇", "☝️", "👋", "🤚", "🖐️", "✋"],
  },
  {
    name: "Activities",
    emojis: ["🎮", "🎯", "🎲", "🎭", "🎨", "🎬", "🎤", "🎧", "🎼", "🎹", "🥁", "🎷", "🎺", "🎸", "🎻", "🏀", "⚽"],
  },
  {
    name: "Objects",
    emojis: ["📱", "💻", "⌨️", "🖥️", "🖨️", "💿", "💾", "💰", "💎", "⚙️", "🔧", "🔨", "💣", "🔫", "🚬", "⚰️", "🔮"],
  },
]

interface EmojiPickerProps {
  onEmojiSelect: (emoji: string) => void
}

export default function EmojiPicker({ onEmojiSelect }: EmojiPickerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [activeCategory, setActiveCategory] = useState(0)
  const pickerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  return (
    <div className="relative" ref={pickerRef}>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsOpen(!isOpen)}
        className={`text-gray-400 hover:text-yellow-400 ${isOpen ? "text-yellow-400" : ""}`}
      >
        <Smile className="h-5 w-5" />
      </Button>

      {isOpen && (
        <div className="absolute bottom-full right-0 mb-2 bg-gray-900 border border-gray-800 rounded-lg shadow-lg p-2 w-64 z-50 animate-in fade-in slide-in-from-bottom-5 duration-200">
          <div className="flex border-b border-gray-800 mb-2">
            {EMOJI_CATEGORIES.map((category, index) => (
              <button
                key={category.name}
                className={`flex-1 p-2 text-xs ${activeCategory === index ? "text-cyan-400 border-b-2 border-cyan-400" : "text-gray-400"}`}
                onClick={() => setActiveCategory(index)}
              >
                {category.name}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1 max-h-32 overflow-y-auto hide-scrollbar">
            {EMOJI_CATEGORIES[activeCategory].emojis.map((emoji, index) => (
              <button
                key={index}
                className="p-1 text-lg hover:bg-gray-800 rounded"
                onClick={() => {
                  onEmojiSelect(emoji)
                  setIsOpen(false)
                }}
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
