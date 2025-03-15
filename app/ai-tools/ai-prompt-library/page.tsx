"use client"

import { useState } from "react"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { NeumorphicCard, CardContent, CardHeader } from "@/components/layout/cbacard"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PlusCircle, Search, Bookmark, Clock, Star } from 'lucide-react'

// Mock data for prompts
const promptCategories = [
  { id: "creative", name: "Creative Writing" },
  { id: "business", name: "Business" },
  { id: "academic", name: "Academic" },
  { id: "coding", name: "Coding" },
  { id: "personal", name: "Personal" },
]

const samplePrompts = [
  {
    id: "1",
    title: "Blog Post Outline",
    content: "Create an outline for a blog post about [topic] with at least 5 main sections and 3 subsections each.",
    category: "creative",
    isFavorite: true,
  },
  {
    id: "2",
    title: "Code Refactoring",
    content: "Refactor this code to improve readability and performance: [code]",
    category: "coding",
    isFavorite: false,
  },
  {
    id: "3",
    title: "Email Response",
    content: "Draft a professional email response to [message] that is concise and friendly.",
    category: "business",
    isFavorite: true,
  },
]

export default function PromptLibraryPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeCategory, setActiveCategory] = useState("all")
  
  const filteredPrompts = samplePrompts.filter(prompt => 
    (activeCategory === "all" || prompt.category === activeCategory) &&
    (searchQuery === "" || 
     prompt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
     prompt.content.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 container py-8">
        <h1 className="text-3xl font-bold mb-6">Prompt Library</h1>
        
        <div className="flex justify-between items-center mb-6">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search prompts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button className="ml-4">
            <PlusCircle className="mr-2 h-4 w-4" />
            Create Prompt
          </Button>
        </div>
        
        <Tabs defaultValue="all" value={activeCategory} onValueChange={setActiveCategory}>
          <TabsList className="mb-6">
            <TabsTrigger value="all">All Prompts</TabsTrigger>
            <TabsTrigger value="favorites">Favorites</TabsTrigger>
            <TabsTrigger value="recent">Recent</TabsTrigger>
            {promptCategories.map(category => (
              <TabsTrigger key={category.id} value={category.id}>
                {category.name}
              </TabsTrigger>
            ))}
          </TabsList>
          
          <TabsContent value={activeCategory} className="mt-0">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredPrompts.map(prompt => (
                <NeumorphicCard key={prompt.id} className="h-full">
                  <CardHeader className="flex flex-row items-start justify-between pb-2">
                    <h3 className="font-medium">{prompt.title}</h3>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      {prompt.isFavorite ? (
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      ) : (
                        <Star className="h-4 w-4" />
                      )}
                    </Button>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{prompt.content}</p>
                    <div className="flex justify-between items-center mt-4">
                      <span className="text-xs bg-secondary px-2 py-1 rounded-full">
                        {promptCategories.find(c => c.id === prompt.category)?.name}
                      </span>
                      <div className="flex space-x-2">
                        <Button variant="ghost" size="sm" className="h-8 px-2">
                          <Bookmark className="h-4 w-4 mr-1" />
                          Save
                        </Button>
                        <Button variant="ghost" size="sm" className="h-8 px-2">
                          <Clock className="h-4 w-4 mr-1" />
                          Use
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </NeumorphicCard>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </main>
      <Footer />
    </div>
  )
}