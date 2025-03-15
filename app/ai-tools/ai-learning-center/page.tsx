"use client";

import { useState } from "react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { NeumorphicCard, CardContent, CardHeader } from "@/components/layout/cbacard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, BookOpen, Video, FileText, Lightbulb, Clock, Star, ChevronRight, Bookmark, Play } from 'lucide-react';

// Mock data
const tutorials = [
  {
    id: "1",
    title: "Getting Started with AI Chat",
    description: "Learn the basics of interacting with AI models",
    category: "beginner",
    type: "article",
    duration: "5 min read",
    featured: true
  },
  {
    id: "2",
    title: "Advanced Prompt Engineering",
    description: "Techniques to craft effective prompts for better results",
    category: "advanced",
    type: "video",
    duration: "15 min watch",
    featured: true
  },
  {
    id: "3",
    title: "Creating Custom AI Agents",
    description: "Build specialized AI agents for specific tasks",
    category: "intermediate",
    type: "tutorial",
    duration: "20 min read",
    featured: false
  },
  {
    id: "4",
    title: "Understanding AI Model Parameters",
    description: "Learn how temperature, tokens, and other settings affect AI responses",
    category: "intermediate",
    type: "article",
    duration: "10 min read",
    featured: false
  },
  {
    id: "5",
    title: "AI for Content Creation",
    description: "Use AI to enhance your content creation workflow",
    category: "beginner",
    type: "video",
    duration: "12 min watch",
    featured: true
  },
  {
    id: "6",
    title: "Integrating Knowledge Bases with AI",
    description: "Connect external knowledge to improve AI responses",
    category: "advanced",
    type: "tutorial",
    duration: "25 min read",
    featured: false
  },
];

export default function LearningCenterPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");

  const filteredTutorials = tutorials.filter(tutorial =>
    (activeCategory === "all" || tutorial.category === activeCategory) &&
    (searchQuery === "" ||
      tutorial.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tutorial.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const featuredTutorials = tutorials.filter(tutorial => tutorial.featured);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "article": return <FileText className="h-4 w-4" />;
      case "video": return <Video className="h-4 w-4" />;
      case "tutorial": return <BookOpen className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const getCategoryBadge = (category: string) => {
    switch (category) {
      case "beginner":
        return <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">Beginner</span>;
      case "intermediate":
        return <span className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">Intermediate</span>;
      case "advanced":
        return <span className="px-2 py-1 rounded-full text-xs bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400">Advanced</span>;
      default:
        return null;
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 flex flex-col items-center justify-center py-8">
        <div className="w-full max-w-7xl">
          <h1 className="text-3xl font-bold mb-6 text-center">AI Learning Center</h1>

          <div className="relative w-full max-w-md mb-8 mx-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search tutorials, guides, and resources..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6 text-center">Featured Resources</h2>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {featuredTutorials.map((tutorial) => (
                <NeumorphicCard key={tutorial.id} elevated>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="p-2 bg-primary/10 rounded-full">
                        {getTypeIcon(tutorial.type)}
                      </div>
                      {getCategoryBadge(tutorial.category)}
                    </div>

                    <h3 className="text-lg font-medium mb-2">{tutorial.title}</h3>
                    <p className="text-sm text-muted-foreground mb-4">{tutorial.description}</p>

                    <div className="flex justify-between items-center">
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Clock className="h-4 w-4 mr-1" />
                        <span>{tutorial.duration}</span>
                      </div>

                      <Button size="sm">
                        {tutorial.type === 'video' ? (
                          <>
                            <Play className="h-4 w-4 mr-1" />
                            Watch
                          </>
                        ) : (
                          <>
                            <BookOpen className="h-4 w-4 mr-1" />
                            Read
                          </>
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </NeumorphicCard>
              ))}
            </div>
          </div>

          <Tabs defaultValue="all" value={activeCategory} onValueChange={setActiveCategory}>
            <div className="flex justify-between items-center mb-6">
              <TabsList>
                <TabsTrigger value="all">All Resources</TabsTrigger>
                <TabsTrigger value="beginner">Beginner</TabsTrigger>
                <TabsTrigger value="intermediate">Intermediate</TabsTrigger>
                <TabsTrigger value="advanced">Advanced</TabsTrigger>
              </TabsList>

              <div className="flex space-x-2">
                <Button variant="outline" size="sm">
                  <Star className="h-4 w-4 mr-1" />
                  Popular
                </Button>
                <Button variant="outline" size="sm">
                  <Clock className="h-4 w-4 mr-1" />
                  Latest
                </Button>
              </div>
            </div>

            <TabsContent value={activeCategory} className="mt-0">
              <div className="space-y-4">
                {filteredTutorials.map((tutorial) => (
                  <NeumorphicCard key={tutorial.id}>
                    <CardContent className="p-6">
                      <div className="flex justify-between">
                        <div className="flex-1">
                          <div className="flex items-center mb-2">
                            <div className="p-1 bg-primary/10 rounded-full mr-2">
                              {getTypeIcon(tutorial.type)}
                            </div>
                            <h3 className="text-lg font-medium">{tutorial.title}</h3>
                          </div>

                          <p className="text-sm text-muted-foreground mb-2">{tutorial.description}</p>

                          <div className="flex items-center space-x-4">
                            {getCategoryBadge(tutorial.category)}
                            <div className="flex items-center text-sm text-muted-foreground">
                              <Clock className="h-4 w-4 mr-1" />
                              <span>{tutorial.duration}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-col space-y-2 ml-4">
                          <Button size="sm">
                            {tutorial.type === 'video' ? (
                              <>
                                <Play className="h-4 w-4 mr-1" />
                                Watch
                              </>
                            ) : (
                              <>
                                <BookOpen className="h-4 w-4 mr-1" />
                                Read
                              </>
                            )}
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Bookmark className="h-4 w-4 mr-1" />
                            Save
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </NeumorphicCard>
                ))}
              </div>
            </TabsContent>
          </Tabs>

          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-6 text-center">Learning Paths</h2>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <NeumorphicCard>
                <CardContent className="p-6">
                  <div className="p-2 bg-primary/10 rounded-full w-fit mb-4">
                    <Lightbulb className="h-5 w-5" />
                  </div>

                  <h3 className="text-lg font-medium mb-2">AI Fundamentals</h3>
                  <p className="text-sm text-muted-foreground mb-4">Master the basics of AI and learn how to use it effectively</p>

                  <div className="flex items-center text-sm text-muted-foreground mb-4">
                    <span>5 modules</span>
                    <span className="mx-2">•</span>
                    <span>2 hours total</span>
                  </div>

                  <Button className="w-full">
                    Start Learning Path
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </CardContent>
              </NeumorphicCard>

              <NeumorphicCard>
                <CardContent className="p-6">
                  <div className="p-2 bg-primary/10 rounded-full w-fit mb-4">
                    <Lightbulb className="h-5 w-5" />
                  </div>

                  <h3 className="text-lg font-medium mb-2">Prompt Engineering</h3>
                  <p className="text-sm text-muted-foreground mb-4">Learn techniques to craft effective prompts for better results</p>

                  <div className="flex items-center text-sm text-muted-foreground mb-4">
                    <span>4 modules</span>
                    <span className="mx-2">•</span>
                    <span>1.5 hours total</span>
                  </div>

                  <Button className="w-full">
                    Start Learning Path
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </CardContent>
              </NeumorphicCard>

              <NeumorphicCard>
                <CardContent className="p-6">
                  <div className="p-2 bg-primary/10 rounded-full w-fit mb-4">
                    <Lightbulb className="h-5 w-5" />
                  </div>

                  <h3 className="text-lg font-medium mb-2">AI for Developers</h3>
                  <p className="text-sm text-muted-foreground mb-4">Integrate AI into your applications and workflows</p>

                  <div className="flex items-center text-sm text-muted-foreground mb-4">
                    <span>6 modules</span>
                    <span className="mx-2">•</span>
                    <span>3 hours total</span>
                  </div>

                  <Button className="w-full">
                    Start Learning Path
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </CardContent>
              </NeumorphicCard>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}