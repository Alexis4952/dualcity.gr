import { cn } from "@/lib/utils"

interface SoldBadgeProps {
  className?: string
  size?: "sm" | "md" | "lg"
  rotate?: boolean
}

export function SoldBadge({ className, size = "md", rotate = true }: SoldBadgeProps) {
  const sizeClasses = {
    sm: "text-sm px-2 py-1 border-2",
    md: "text-lg px-3 py-1 border-2",
    lg: "text-4xl px-8 py-4 border-4",
  }

  return (
    <div
      className={cn(
        "border-red-600 rounded-lg bg-black/80 font-bold text-red-600",
        rotate ? "transform rotate-[-20deg]" : "",
        sizeClasses[size],
        className,
      )}
    >
      ΠΩΛΗΘΗΚΕ
    </div>
  )
}
