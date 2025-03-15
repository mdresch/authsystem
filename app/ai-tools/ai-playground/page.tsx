"use client";

import { useState } from "react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { NeumorphicCard, CardContent, CardHeader } from "@/components/layout/cbacard";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { NeumorphicChatBubble } from "@/components/layout/NeumorphicChatBubble";
import { Separator } from "@/components/ui/separator";
import { Play, Save, Copy, Download, Share2, Code, Wand2 } from 'lucide-react';

export default function PlaygroundPage() {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [model, setModel] = useState("gpt-4");
  const [temperature, setTemperature] = useState(0.7);
  const [maxTokens, setMaxTokens] = useState(2048);
  const [systemPrompt, setSystemPrompt] = useState("You are a helpful AI assistant.");

  const handleGenerate = () => {
    if (!prompt.trim()) return;

    setIsGenerating(true);
    setResponse("");

    // Simulate streaming response
    let fullResponse = "I'm analyzing your request...\n\n";
    const words = [
      "Based on your prompt, I can provide the following insights:",
      "First, let's consider the key aspects of your question.",
      "There are several important factors to consider here.",
      "Looking at this from multiple perspectives will be helpful.",
      "The approach I would recommend involves these steps:",
      "1. Analyze the core problem",
      "2. Consider various solutions",
      "3. Evaluate the trade-offs",
      "4. Implement the best approach",
      "Let me know if you'd like me to elaborate on any specific part of this response.",
    ];

    let i = 0;
    const interval = setInterval(() => {
      if (i < words.length) {
        fullResponse += " " + words[i];
        setResponse(fullResponse);
        i++;
      } else {
        clearInterval(interval);
        setIsGenerating(false);
      }
    }, 300);
  };

  const handleSavePrompt = () => {
    // Implementation for saving prompt
    console.log("Saving prompt:", prompt);
  };

  const handleCopyResponse = () => {
    navigator.clipboard.writeText(response);
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 flex flex-col items-center justify-center py-8">
        <div className="w-full max-w-7xl">
          <h1 className="text-3xl font-bold mb-6 text-center">AI Playground</h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <NeumorphicCard>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold">Prompt</h2>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" onClick={handleSavePrompt}>
                        <Save className="h-4 w-4 mr-1" />
                        Save
                      </Button>
                      <Button size="sm" onClick={handleGenerate} disabled={isGenerating || !prompt.trim()}>
                        {isGenerating ? (
                          <>
                            <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-current border-t-transparent" />
                            Generating...
                          </>
                        ) : (
                          <>
                            <Play className="h-4 w-4 mr-1" />
                            Generate
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Textarea
                    placeholder="Enter your prompt here..."
                    className="min-h-[200px] resize-none"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                  />

                  <div className="flex flex-wrap gap-2 mt-4">
                    {["Generate a story", "Explain a concept", "Write code", "Analyze data", "Create a plan"].map((suggestion) => (
                      <Button 
                        key={suggestion} 
                        variant="outline" 
                        size="sm"
                        onClick={() => setPrompt(prompt ? `${prompt}\n\n${suggestion}` : suggestion)}
                      >
                        {suggestion}
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </NeumorphicCard>

              <NeumorphicCard>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold">Response</h2>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" onClick={handleCopyResponse} disabled={!response}>
                        <Copy className="h-4 w-4 mr-1" />
                        Copy
                      </Button>
                      <Button variant="outline" size="sm" disabled={!response}>
                        <Download className="h-4 w-4 mr-1" />
                        Export
                      </Button>
                      <Button variant="outline" size="sm" disabled={!response}>
                        <Share2 className="h-4 w-4 mr-1" />
                        Share
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {response ? (
                    <NeumorphicChatBubble isUser={false} className="w-full max-w-full">
                      <div className="whitespace-pre-wrap">{response}</div>
                    </NeumorphicChatBubble>
                  ) : (
                    <div className="min-h-[200px] flex items-center justify-center text-muted-foreground">
                      {isGenerating ? (
                        <div className="flex flex-col items-center">
                          <div className="flex space-x-2 mb-2">
                            <div className="w-2 h-2 rounded-full bg-primary/40 animate-bounce" />
                            <div className="w-2 h-2 rounded-full bg-primary/40 animate-bounce [animation-delay:0.2s]" />
                            <div className="w-2 h-2 rounded-full bg-primary/40 animate-bounce [animation-delay:0.4s]" />
                          </div>
                          <p>Generating response...</p>
                        </div>
                      ) : (
                        <p>Response will appear here</p>
                      )}
                    </div>
                  )}
                </CardContent>
              </NeumorphicCard>
            </div>

            <div className="space-y-6">
              <NeumorphicCard>
                <CardHeader>
                  <h2 className="text-xl font-semibold">Model Settings</h2>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="model">Model</Label>
                    <Select value={model} onValueChange={setModel}>
                      <SelectTrigger id="model">
                        <SelectValue placeholder="Select model" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo</SelectItem>
                        <SelectItem value="gpt-4">GPT-4</SelectItem>
                        <SelectItem value="claude-v1">Claude v1</SelectItem>
                        <SelectItem value="claude-instant-v1">Claude Instant</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label htmlFor="temperature">Temperature: {temperature}</Label>
                      <span className="text-xs text-muted-foreground">Creativity</span>
                    </div>
                    <Slider 
                      id="temperature"
                      min={0} 
                      max={1} 
                      step={0.1} 
                      value={[temperature]} 
                      onValueChange={(value) => setTemperature(value[0])} 
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label htmlFor="max-tokens">Max Tokens: {maxTokens}</Label>
                      <span className="text-xs text-muted-foreground">Length</span>
                    </div>
                    <Slider 
                      id="max-tokens"
                      min={256} 
                      max={4096} 
                      step={256} 
                      value={[maxTokens]} 
                      onValueChange={(value) => setMaxTokens(value[0])} 
                    />
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <Label htmlFor="system-prompt">System Prompt</Label>
                    <Textarea 
                      id="system-prompt" 
                      value={systemPrompt} 
                      onChange={(e) => setSystemPrompt(e.target.value)}
                      rows={3}
                    />
                  </div>
                </CardContent>
              </NeumorphicCard>

              <NeumorphicCard>
                <CardHeader>
                  <h2 className="text-xl font-semibold">Tools</h2>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Button variant="outline" className="w-full justify-start">
                      <Code className="h-4 w-4 mr-2" />
                      Code Interpreter
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Wand2 className="h-4 w-4 mr-2" />
                      Image Generation
                    </Button>
                  </div>
                </CardContent>
              </NeumorphicCard>

              <NeumorphicCard>
                <CardHeader>
                  <h2 className="text-xl font-semibold">Saved Prompts</h2>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {["Write a blog post", "Explain quantum computing", "Debug this code"].map((savedPrompt) => (
                      <Button 
                        key={savedPrompt} 
                        variant="outline" 
                        className="w-full justify-start text-left"
                        onClick={() => setPrompt(savedPrompt)}
                      >
                        <span className="truncate">{savedPrompt}</span>
                      </Button>
                    ))}
                  </div>
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