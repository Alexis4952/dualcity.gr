"use client"
import { Check } from "lucide-react"
import Image from "next/image"

type AvatarType = "male-agent" | "female-agent" | "male-support" | "female-support"

interface AvatarSelectionPanelProps {
  selectedAvatar: AvatarType
  onSelectAvatar: (avatar: AvatarType) => void
}

export default function AvatarSelectionPanel({ selectedAvatar, onSelectAvatar }: AvatarSelectionPanelProps) {
  const avatars: { id: AvatarType; name: string; seed: string }[] = [
    { id: "male-agent", name: "Άνδρας Agent", seed: "felix" },
    { id: "female-agent", name: "Γυναίκα Agent", seed: "anaya" },
    { id: "male-support", name: "Άνδρας Support", seed: "tyler" },
    { id: "female-support", name: "Γυναίκα Support", seed: "sophie" },
  ]

  return (
    <div className="avatar-selection">
      <h3 className="text-base font-medium text-white mb-4">Επιλογή Υποστήριξης</h3>
      <div className="grid grid-cols-2 gap-4">
        {avatars.map((avatar) => (
          <div
            key={avatar.id}
            className={`avatar-option p-2 border rounded-lg cursor-pointer ${
              selectedAvatar === avatar.id
                ? "selected bg-cyan-900/20 border-cyan-500"
                : "border-gray-700 bg-gray-800/50"
            }`}
            onClick={() => onSelectAvatar(avatar.id)}
          >
            <div className="relative w-full h-32 mb-2">
              <Image
                src={`https://api.dicebear.com/7.x/personas/svg?seed=${avatar.seed}`}
                alt={avatar.name}
                width={96}
                height={128}
                className="rounded-md mx-auto object-cover"
              />
              {selectedAvatar === avatar.id && (
                <div className="absolute top-2 right-2 bg-cyan-500 rounded-full p-1">
                  <Check className="h-4 w-4 text-white" />
                </div>
              )}
            </div>
            <p className="text-center text-sm text-gray-300">{avatar.name}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
