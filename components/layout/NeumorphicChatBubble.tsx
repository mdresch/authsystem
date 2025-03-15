import { cn } from "@/lib/utils"
import { forwardRef } from "react"

interface NeumorphicChatBubbleProps extends React.HTMLAttributes<HTMLDivElement> {
  isUser?: boolean
  isTyping?: boolean
  timestamp?: Date
  model?: string
}

export const NeumorphicChatBubble = forwardRef<HTMLDivElement, NeumorphicChatBubbleProps>(
  ({ className, children, isUser = false, isTyping = false, timestamp, model, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "group transition-all duration-300 ease-out transform",
          isUser ? "self-end" : "self-start",
          isUser ? "max-w-[80%] md:max-w-[70%]" : "max-w-[80%] md:max-w-[70%]",
          className
        )}
        {...props}
      >
        <div
          className={cn(
            "rounded-2xl p-4 transition-all duration-300",
            isUser
              ? "bg-primary/10 text-black dark:bg-gray-700 dark:text-white"
              : "bg-gray-100 text-foreground dark:bg-gray-800",
            isUser
              ? "shadow-[4px_4px_10px_rgba(0,0,0,0.1),-2px_-2px_10px_rgba(255,255,255,0.7)]"
              : "shadow-[4px_4px_10px_rgba(0,0,0,0.1),-2px_-2px_10px_rgba(255,255,255,0.7)]",
            "dark:shadow-[4px_4px_10px_rgba(0,0,0,0.3),-2px_-2px_10px_rgba(30,30,30,0.2)]"
          )}
        >
          {isTyping ? (
            <div className="flex space-x-2">
              <div className="w-2 h-2 rounded-full bg-primary/40 animate-bounce" />
              <div className="w-2 h-2 rounded-full bg-primary/40 animate-bounce [animation-delay:0.2s]" />
              <div className="w-2 h-2 rounded-full bg-primary/40 animate-bounce [animation-delay:0.4s]" />
            </div>
          ) : (
            <>
              <div className="whitespace-pre-wrap">{children}</div>
              {(timestamp || model) && (
                <div className="mt-2 flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    {timestamp && (
                      <div className="text-xs text-muted-foreground">
                        {timestamp.toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                    )}
                    {model && <div className="text-xs text-muted-foreground">{model}</div>}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    )
  }
)
NeumorphicChatBubble.displayName = "NeumorphicChatBubble"