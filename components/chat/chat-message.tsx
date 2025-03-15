// chat-message.tsx

"use client"

import { useState, useEffect } from "react"
import { Copy } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface ChatMessageProps {
  message: {
    content: string
    role: "user" | "assistant"
    timestamp: Date
    model: string
  }
  onCopy: () => void
  index: number
  total: number
}

export function ChatMessage({ message, onCopy, index, total }: ChatMessageProps) {
  const [isVisible, setIsVisible] = useState(false)
  const isUser = message.role === "user"

  // Stagger the animation of messages
  useEffect(() => {
    const timer = setTimeout(
      () => {
        setIsVisible(true)
      },
      100 * (index % 5),
    ) // Stagger by index, but reset every 5 to avoid long delays

    return () => clearTimeout(timer)
  }, [index])

  useEffect(() => {
    return () => {
      setIsVisible(false)
    }
  }, [])

  return (
    <div
      className={cn(
        "group transition-all duration-500 ease-out transform",
        isUser ? "self-end" : "self-start",
        isUser ? "max-w-[80%] md:max-w-[70%]" : "max-w-[80%] md:max-w-[70%]",
        isVisible ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-16 scale-95",
      )}
      style={{
        transform: `translateY(${isVisible ? "-6px" : "0px"})`,
      }}
    >
      <div
        className={cn(
          "rounded-2xl p-4 transition-all duration-300",
          "shadow-[6px_6px_12px_rgba(0,0,0,0.08),-6px_-6px_12px_rgba(255,255,255,0.8)]",
          "dark:shadow-[5px_5px_10px_rgba(0,0,0,0.2),-5px_-5px_10px_rgba(30,30,30,0.1)]",
          isUser
            ? "bg-primary/10 text-black dark:bg-gray-700 dark:text-white"
            : "bg-gray-100 text-foreground dark:bg-gray-800",
        )}
      >
        <div className="whitespace-pre-wrap">{message.content}</div>

        <div className="mt-2 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="text-xs text-muted-foreground">
              {new Date(message.timestamp).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </div>
            {message.model && <div className="text-xs text-muted-foreground">{message.model}</div>}
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 rounded-full opacity-0 transition-opacity group-hover:opacity-100"
            onClick={onCopy}
          >
            <Copy className="h-3.5 w-3.5" />
            <span className="sr-only">Copy message</span>
          </Button>
        </div>
      </div>
    </div>
  )
}