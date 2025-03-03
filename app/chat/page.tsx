"use client"

import { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Header } from "@/components/layout/header"
import { ChatInput } from "@/components/chat/chat-input"
import { ChatMessage } from "@/components/chat/chat-message"
import { MessageHistorySidebar } from "@/components/chat/message-history-sidebar"
import { ModelDetailsSidebar } from "@/components/chat/model-details-sidebar"
import { useToast } from "@/components/ui/use-toast"
import { Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

// Message type definition
type Message = {
  id: string
  content: string
  role: "user" | "assistant"
  timestamp: Date
  model: string
  agent: string
}

// Mock AI response function
const getAIResponse = async (message: string, model: string, agent: string): Promise<string> => {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 1000 + Math.random() * 2000))

  const responses = [
    "I understand what you're saying. Could you tell me more about that?",
    "That's an interesting perspective. I'd like to explore that further.",
    "I see your point. Here's what I think about it...",
    "Thanks for sharing that with me. I'm here to help with any questions.",
    "I appreciate your input. Let me think about how to respond...",
    `I've processed your message: "${message.substring(0, 30)}${message.length > 30 ? "..." : ""}". Here's my response...`,
    "I'm analyzing what you've shared. It's giving me some interesting insights.",
    "That's a great question. Let me provide some thoughts on this topic.",
  ]

  return responses[Math.floor(Math.random() * responses.length)]
}

// Mock model details
const modelDetails = {
  name: "GPT-3.5 Turbo",
  description: "GPT-3.5 Turbo is a powerful language model optimized for dialogue.",
  temperature: 0.7,
  maxTokens: 2048,
  topP: 1,
  frequencyPenalty: 0,
  presencePenalty: 0,
}

export default function ChatPage() {
  const router = useRouter()
  const { user, loading } = useAuth()
  const [messages, setMessages] = useState<Message[]>([])
  const [isTyping, setIsTyping] = useState(false)
  const [isPageLoaded, setIsPageLoaded] = useState(false)
  const [isPageUnloading, setIsPageUnloading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { toast } = useToast()
  const [leftSidebarExpanded, setLeftSidebarExpanded] = useState(false)
  const [rightSidebarExpanded, setRightSidebarExpanded] = useState(false)

  // Redirect if not logged in
  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/login")
    }
  }, [loading, user, router])

  // Set page as loaded after a short delay for animation purposes
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsPageLoaded(true)
    }, 300)

    return () => clearTimeout(timer)
  }, [])

  // Handle page unload animation
  useEffect(() => {
    const handleBeforeUnload = () => {
      setIsPageUnloading(true)
    }

    window.addEventListener("beforeunload", handleBeforeUnload)

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload)
    }
  }, [])

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom()
  }, []) // Removed unnecessary dependency: [messages]

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const handleSendMessage = async (content: string, model: string, agent: string) => {
    if (!content.trim()) return

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      role: "user",
      timestamp: new Date(),
      model,
      agent,
    }

    setMessages((prev) => [...prev, userMessage])

    // Simulate AI thinking
    setIsTyping(true)

    try {
      // Get AI response (in a real app, you'd use the selected model and agent here)
      const aiResponse = await getAIResponse(content, model, agent)

      // Add AI message
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: aiResponse,
        role: "assistant",
        timestamp: new Date(),
        model,
        agent,
      }

      setMessages((prev) => [...prev, assistantMessage])
    } catch (error) {
      console.error("Error getting AI response:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to get AI response. Please try again.",
      })
    } finally {
      setIsTyping(false)
    }
  }

  const handleCopyMessage = (content: string) => {
    navigator.clipboard.writeText(content)
    toast({
      title: "Copied to clipboard",
      description: "Message has been copied to clipboard",
    })
  }

  const handleSelectConversation = (id: string) => {
    // In a real app, you would load the selected conversation here
    console.log(`Selected conversation: ${id}`)
  }

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </main>
      </div>
    )
  }

  const messageHistory = messages
    .filter((m) => m.role === "user")
    .map((m) => ({
      id: m.id,
      title: m.content.substring(0, 30) + (m.content.length > 30 ? "..." : ""),
      model: m.model,
      timestamp: m.timestamp,
    }))

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <Header />
      <main className="flex-1 flex relative">
        <MessageHistorySidebar
          history={messageHistory}
          onSelectConversation={handleSelectConversation}
          isExpanded={leftSidebarExpanded}
          onToggle={() => setLeftSidebarExpanded(!leftSidebarExpanded)}
        />
        <div
          className={cn(
            "flex-1 flex flex-col p-4 md:p-6 relative overflow-hidden transition-all duration-300",
            leftSidebarExpanded ? "ml-64" : "ml-12",
            rightSidebarExpanded ? "mr-64" : "mr-12",
          )}
        >
          {/* Chat messages container */}
          <div
            className={cn(
              "flex-1 flex flex-col space-y-4 overflow-y-auto transition-all duration-500 rounded-lg",
              "bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm p-6",
              "shadow-[inset_0_2px_4px_rgba(0,0,0,0.06)] dark:shadow-[inset_0_2px_4px_rgba(0,0,0,0.2)]",
              isPageLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10",
              isPageUnloading ? "opacity-0 translate-y-10" : "opacity-100 translate-y-0",
            )}
          >
            {messages.length === 0 ? (
              <div className="flex-1 flex items-center justify-center text-muted-foreground">
                <p>Send a message to start chatting with AI</p>
              </div>
            ) : (
              messages.map((message, index) => (
                <ChatMessage
                  key={message.id}
                  message={message}
                  onCopy={() => handleCopyMessage(message.content)}
                  index={index}
                  total={messages.length}
                />
              ))
            )}

            {isTyping && (
              <div className="self-start max-w-[80%] md:max-w-[70%] animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl p-4 shadow-[4px_4px_10px_rgba(0,0,0,0.1),-4px_-4px_10px_rgba(255,255,255,0.9)] dark:shadow-[4px_4px_10px_rgba(0,0,0,0.3),-4px_-4px_10px_rgba(30,30,30,0.2)]">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 rounded-full bg-primary/40 animate-bounce" />
                    <div className="w-2 h-2 rounded-full bg-primary/40 animate-bounce [animation-delay:0.2s]" />
                    <div className="w-2 h-2 rounded-full bg-primary/40 animate-bounce [animation-delay:0.4s]" />
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Chat input */}
          <div
            className={cn(
              "mt-4 transition-opacity duration-500",
              isPageLoaded ? "opacity-100" : "opacity-0",
              isPageUnloading ? "opacity-0" : "opacity-100",
            )}
          >
            <ChatInput onSendMessage={handleSendMessage} />
          </div>
        </div>
        <ModelDetailsSidebar
          modelDetails={modelDetails}
          isExpanded={rightSidebarExpanded}
          onToggle={() => setRightSidebarExpanded(!rightSidebarExpanded)}
        />
      </main>
    </div>
  )
}

