"use client"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import { NeumorphicToggleIcon } from "@/components/ui/neumorphic-toggle-icon"
import { Button } from "@/components/ui/button"

interface ModelDetails {
  name: string
  description: string
  temperature: number
  maxTokens: number
  topP: number
  frequencyPenalty: number
  presencePenalty: number
}

interface ModelDetailsSidebarProps {
  modelDetails: ModelDetails
  isExpanded: boolean
  onToggle: () => void
}

export function ModelDetailsSidebar({ modelDetails, isExpanded, onToggle }: ModelDetailsSidebarProps) {
  return (
    <div
      className={cn(
        "fixed right-0 top-16 h-[calc(100vh-4rem-4rem)] transition-all duration-300 ease-in-out",
        "bg-white dark:bg-gray-800",
        "shadow-[6px_6px_12px_rgba(0,0,0,0.08),-6px_-6px_12px_rgba(255,255,255,0.8)]",
        "dark:shadow-[5px_5px_10px_rgba(0,0,0,0.2),-5px_-5px_10px_rgba(30,30,30,0.1)]",
        "rounded-l-2xl overflow-hidden",
        isExpanded ? "w-64 pl-8" : "w-12 pl-0",
      )}
    >
      <Button
        className={cn(
          "absolute left-0 top-4 w-10 h-10 flex items-center justify-center",
          "bg-white dark:bg-gray-800 rounded-r-full",
          "shadow-[-4px_-2px_8px_rgba(255,255,255,0.8),4px_2px_8px_rgba(0,0,0,0.1)]",
          "dark:shadow-[-4px_-2px_8px_rgba(30,30,30,0.1),4px_2px_8px_rgba(0,0,0,0.3)]",
          "focus:outline-none focus:ring-2 focus:ring-primary",
          "transition-all duration-300 ease-in-out",
          isExpanded ? "-left-5" : "left-0",
        )}
        onClick={onToggle}
      >
        <NeumorphicToggleIcon isExpanded={isExpanded} direction="right" />
      </Button>
      {isExpanded && (
        <ScrollArea className="h-full p-4 pt-12">
          <h2 className="font-semibold mb-4">Model Details</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium">{modelDetails.name}</h3>
              <p className="text-sm text-muted-foreground">{modelDetails.description}</p>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm">Temperature:</span>
                <span className="text-sm font-medium">{modelDetails.temperature}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Max Tokens:</span>
                <span className="text-sm font-medium">{modelDetails.maxTokens}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Top P:</span>
                <span className="text-sm font-medium">{modelDetails.topP}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Frequency Penalty:</span>
                <span className="text-sm font-medium">{modelDetails.frequencyPenalty}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Presence Penalty:</span>
                <span className="text-sm font-medium">{modelDetails.presencePenalty}</span>
              </div>
            </div>
          </div>
        </ScrollArea>
      )}
    </div>
  )
}

