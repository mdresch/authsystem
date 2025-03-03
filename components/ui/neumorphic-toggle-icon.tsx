import { cn } from "@/lib/utils"

interface NeumorphicToggleIconProps {
  isExpanded: boolean
  direction: "left" | "right"
  className?: string
}

export function NeumorphicToggleIcon({ isExpanded, direction, className }: NeumorphicToggleIconProps) {
  return (
    <div
      className={cn(
        "w-8 h-8 relative",
        "bg-white dark:bg-gray-800",
        "rounded-full shadow-[inset_-2px_-2px_5px_rgba(255,255,255,0.7),inset_2px_2px_5px_rgba(0,0,0,0.1)]",
        "dark:shadow-[inset_-2px_-2px_5px_rgba(255,255,255,0.1),inset_2px_2px_5px_rgba(0,0,0,0.3)]",
        className,
      )}
    >
      <div
        className={cn(
          "absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2",
          "w-4 h-4 bg-gray-400 dark:bg-gray-600",
          "transition-all duration-300 ease-in-out",
          {
            "rotate-180": (direction === "left" && isExpanded) || (direction === "right" && !isExpanded),
          },
        )}
      >
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d={direction === "left" ? "M15 6L9 12L15 18" : "M9 6L15 12L9 18"}
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </div>
  )
}

