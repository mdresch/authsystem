"use client"

import { useEffect, useRef, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Header } from "@/components/layout/header";
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

// Claude API response type
type ClaudeResponse = {
  id: string
  type: string
  content: Array<{
    type: string
    text: string
  }>
}

// Function to get response from Claude API
const getClaudeResponse = async (
  messages: Array<{ role: string; content: string }>, 
  model: string
): Promise<string> => {
  try {
    const response = await fetch('/api/claude', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: model,
        messages: messages,
        max_tokens: 4096,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data: ClaudeResponse = await response.json();
    return data.content[0].text;
  } catch (error) {
    console.error("Error calling Claude API:", error);
    throw error;
  }
}

// Claude model details
const modelDetails = {
  name: "Claude 3.7 Sonnet",
  description: "Claude 3.7 Sonnet is Anthropic's advanced language model optimized for thoughtful dialogue and reasoning.",
  temperature: 0.7,
  maxTokens: 4096,
  topP: 1,
  frequencyPenalty: 0,
  presencePenalty: 0,
}

export default function ChatPage() {
  const router = useRouter()
  const searchParams = useSearchParams();
  const { user } = useAuth()
  const [messages, setMessages] = useState<Message[]>([])
  const [isTyping, setIsTyping] = useState(false)
  const [isPageLoaded, setIsPageLoaded] = useState(false)
  const [isPageUnloading, setIsPageUnloading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { toast } = useToast()
  const [leftSidebarExpanded, setLeftSidebarExpanded] = useState(false)
  const [rightSidebarExpanded, setRightSidebarExpanded] = useState(false)
  const [selectedModel, setSelectedModel] = useState<string>(searchParams.get('model') || "claude-3-sonnet-20240229");
  const [conversationHistory, setConversationHistory] = useState<Array<{ role: string; content: string }>>([])

  // Redirect if not logged in
  useEffect(() => {
    if (!user) {
      router.push("/auth/login")
    }
  }, [user, router])

  // Set page as loaded after a short delay for animation purposes
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsPageLoaded(true)
    }, 3000)

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
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const handleSendMessage = async (content: string, model: string = selectedModel, agent: string = "default") => {
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

    // Update conversation history for Claude API
    const updatedHistory = [...conversationHistory, { role: "user", content }];
    setConversationHistory(updatedHistory);

    // Simulate AI thinking
    setIsTyping(true)

    try {
      // Get Claude response
      const claudeResponse = await getClaudeResponse(updatedHistory, model);

      // Add AI message
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: claudeResponse,
        role: "assistant",
        timestamp: new Date(),
        model,
        agent,
      }

      setMessages((prev) => [...prev, assistantMessage])
      
      // Update conversation history with Claude's response
      setConversationHistory([...updatedHistory, { role: "assistant", content: claudeResponse }]);
      
    } catch (error) {
      console.error("Error getting Claude response:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to get a response from Claude. Please try again.",
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

  if (!user) {
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
                <p>Send a message to start chatting with Claude</p>
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
