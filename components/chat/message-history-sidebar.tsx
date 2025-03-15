"use client"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import { NeumorphicToggleIcon } from "@/components/ui/neumorphic-toggle-icon"

interface MessageHistoryItem {
  id: string
  title: string
  model: string
  timestamp: Date
}

interface MessageHistorySidebarProps {
  history: MessageHistoryItem[]
  onSelectConversation: (id: string) => void
  isExpanded: boolean
  onToggle: () => void
}

export function MessageHistorySidebar({
  history,
  onSelectConversation,
  isExpanded,
  onToggle,
}: MessageHistorySidebarProps) {
  return (
    <div
      className={cn(
        "fixed left-0 top-16 h-[calc(100vh-4rem-4rem)] transition-all duration-300 ease-in-out",
        "bg-white dark:bg-gray-800",
        "shadow-[6px_6px_12px_rgba(0,0,0,0.08),-6px_-6px_12px_rgba(255,255,255,0.8)]",
        "dark:shadow-[5px_5px_10px_rgba(0,0,0,0.2),-5px_-5px_10px_rgba(30,30,30,0.1)]",
        "rounded-r-2xl overflow-hidden",
        isExpanded ? "w-64 pr-8" : "w-12 pr-0",
      )}
    >
      <Button
        className={cn(
          "absolute right-0 top-4 w-10 h-10 flex items-center justify-center",
          "bg-white dark:bg-gray-800 rounded-l-full",
          "shadow-[-4px_-2px_8px_rgba(255,255,255,0.8),4px_2px_8px_rgba(0,0,0,0.1)]",
          "dark:shadow-[-4px_-2px_8px_rgba(30,30,30,0.1),4px_2px_8px_rgba(0,0,0,0.3)]",
          "focus:outline-none focus:ring-2 focus:ring-primary",
          "transition-all duration-300 ease-in-out",
          isExpanded ? "-right-5" : "right-0",
        )}
        onClick={onToggle}
      >
        <NeumorphicToggleIcon isExpanded={isExpanded} direction="left" />
      </Button>
      {isExpanded && (
        <ScrollArea className="h-full p-4 pt-12">
          <h2 className="font-semibold mb-4">Message History</h2>
          <div className="space-y-2">
            {history.map((item) => (
              <Button
                key={item.id}
                variant="ghost"
                className="w-full justify-start text-left"
                onClick={() => onSelectConversation(item.id)}
              >
                <div className="truncate">
                  <div className="font-medium">{item.title}</div>
                  <div className="text-xs text-muted-foreground">
                    {item.model} • {item.timestamp.toLocaleString()}
                  </div>
                </div>
              </Button>
            ))}
          </div>
        </ScrollArea>
      )}
    </div>
  )
}

