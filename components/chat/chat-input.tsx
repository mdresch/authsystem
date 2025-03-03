"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { SendIcon, ChevronDown, ChevronUp, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import TextareaAutosize from "react-textarea-autosize"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu"

interface ChatInputProps {
  onSendMessage: (message: string, model: string, agent: string) => void
}

const models = [
  { id: "gpt-3.5-turbo", name: "GPT-3.5 Turbo" },
  { id: "gpt-4", name: "GPT-4" },
  { id: "claude-v1", name: "Claude v1" },
  { id: "claude-instant-v1", name: "Claude Instant" },
]

const agents = [
  { id: "general", name: "General Assistant" },
  { id: "coder", name: "Code Expert" },
  { id: "writer", name: "Creative Writer" },
  { id: "analyst", name: "Data Analyst" },
]

export function ChatInput({ onSendMessage }: ChatInputProps) {
  const [message, setMessage] = useState("")
  const [isFocused, setIsFocused] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [selectedModel, setSelectedModel] = useState(models[0])
  const [selectedAgent, setSelectedAgent] = useState(agents[0])
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (message.trim()) {
      onSendMessage(message, selectedModel.id, selectedAgent.id)
      setMessage("")
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  // Focus the textarea when the component mounts
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus()
    }
  }, [])

  return (
    <div className={`relative transition-all duration-200 ease-in-out ${isFocused ? "shadow-lg" : "shadow-md"}`}>
      <form
        onSubmit={handleSubmit}
        className={`relative flex items-end rounded-xl bg-white dark:bg-gray-800 transition-all duration-200 ${
          isFocused
            ? "border-primary/50 shadow-[6px_6px_12px_rgba(0,0,0,0.08),-6px_-6px_12px_rgba(255,255,255,0.8)] dark:shadow-[5px_5px_10px_rgba(0,0,0,0.2),-5px_-5px_10px_rgba(30,30,30,0.1)]"
            : "border-border shadow-[4px_4px_8px_rgba(0,0,0,0.06),-4px_-4px_8px_rgba(255,255,255,0.6)] dark:shadow-[3px_3px_6px_rgba(0,0,0,0.2),-3px_-3px_6px_rgba(30,30,30,0.1)]"
        }`}
      >
        <TextareaAutosize
          ref={textareaRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder="Type a message..."
          className="flex-1 resize-none bg-transparent px-4 py-3 text-sm focus-visible:outline-none min-h-[40px]"
          maxRows={isFocused ? 12 : 4}
        />
        <div className="flex items-center mr-1">
          <DropdownMenu open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <DropdownMenuTrigger asChild>
              <Button type="button" size="icon" variant="ghost" className="h-9 w-9 rounded-full">
                {isMenuOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                <span className="sr-only">Select AI model and agent</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>
                  <span>Models</span>
                  <ChevronRight className="ml-auto h-4 w-4" />
                </DropdownMenuSubTrigger>
                <DropdownMenuSubContent>
                  <DropdownMenuRadioGroup
                    value={selectedModel.id}
                    onValueChange={(value) => setSelectedModel(models.find((m) => m.id === value) || models[0])}
                  >
                    {models.map((model) => (
                      <DropdownMenuRadioItem key={model.id} value={model.id}>
                        {model.name}
                      </DropdownMenuRadioItem>
                    ))}
                  </DropdownMenuRadioGroup>
                </DropdownMenuSubContent>
              </DropdownMenuSub>
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>
                  <span>Agents</span>
                  <ChevronRight className="ml-auto h-4 w-4" />
                </DropdownMenuSubTrigger>
                <DropdownMenuSubContent>
                  <DropdownMenuRadioGroup
                    value={selectedAgent.id}
                    onValueChange={(value) => setSelectedAgent(agents.find((a) => a.id === value) || agents[0])}
                  >
                    {agents.map((agent) => (
                      <DropdownMenuRadioItem key={agent.id} value={agent.id}>
                        {agent.name}
                      </DropdownMenuRadioItem>
                    ))}
                  </DropdownMenuRadioGroup>
                </DropdownMenuSubContent>
              </DropdownMenuSub>
              <DropdownMenuItem>
                Current: {selectedModel.name} / {selectedAgent.name}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button
            type="submit"
            size="icon"
            className={`ml-1 h-10 w-10 shrink-0 rounded-full transition-transform duration-200 ${
              message.trim() ? "scale-100 opacity-100" : "scale-90 opacity-70"
            } ${isFocused ? "bg-primary hover:bg-primary/90" : "bg-primary/90 hover:bg-primary"}`}
            disabled={!message.trim()}
          >
            <SendIcon className="h-5 w-5" />
            <span className="sr-only">Send message</span>
          </Button>
        </div>
      </form>
    </div>
  )
}

