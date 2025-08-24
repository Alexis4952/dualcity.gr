"use client"
import { Button } from "@/components/ui/button"
import { Check } from "lucide-react"
import Image from "next/image"

type AvatarCharacter = "robot" | "agent" | "alien" | "neon"

interface AvatarSelectorProps {
  selectedCharacter: AvatarCharacter
  onSelectCharacter: (character: AvatarCharacter) => void
}

export default function AvatarSelector({ selectedCharacter, onSelectCharacter }: AvatarSelectorProps) {
  const characters: { id: AvatarCharacter; name: string }[] = [
    { id: "robot", name: "Ρομπότ" },
    { id: "agent", name: "Πράκτορας" },
    { id: "alien", name: "Εξωγήινος" },
    { id: "neon", name: "Neon" },
  ]

  return (
    <div className="p-2">
      <h3 className="text-sm font-medium text-gray-300 mb-2">Επιλογή Avatar</h3>
      <div className="grid grid-cols-2 gap-2">
        {characters.map((character) => (
          <Button
            key={character.id}
            variant="outline"
            className={`p-2 h-auto flex flex-col items-center justify-center border ${
              selectedCharacter === character.id ? "border-cyan-500 bg-cyan-900/20" : "border-gray-800 bg-gray-900/50"
            }`}
            onClick={() => onSelectCharacter(character.id)}
          >
            <div className="relative w-12 h-12 mb-1">
              <Image
                src={`/placeholder.svg?height=48&width=48`}
                alt={character.name}
                width={48}
                height={48}
                className="rounded-full"
              />
              {selectedCharacter === character.id && (
                <div className="absolute -top-1 -right-1 bg-cyan-500 rounded-full p-0.5">
                  <Check className="h-3 w-3 text-white" />
                </div>
              )}
            </div>
            <span className="text-xs">{character.name}</span>
          </Button>
        ))}
      </div>
    </div>
  )
}
