"use client";

import { useState } from "react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { NeumorphicCard, CardContent, CardHeader } from "@/components/layout/cbacard";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { NeumorphicChatBubble } from "@/components/layout/NeumorphicChatBubble";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Play, Copy, ThumbsUp, ThumbsDown, BarChart4 } from 'lucide-react';

// Mock data
const availableModels = [
  { id: "gpt-3.5", name: "GPT-3.5 Turbo", provider: "OpenAI" },
  { id: "gpt-4", name: "GPT-4", provider: "OpenAI" },
  { id: "claude-v1", name: "Claude v1", provider: "Anthropic" },
  { id: "claude-instant", name: "Claude Instant", provider: "Anthropic" },
  { id: "llama-2", name: "Llama 2", provider: "Meta" },
  { id: "palm-2", name: "PaLM 2", provider: "Google" },
];

export default function ModelComparisonPage() {
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedModels, setSelectedModels] = useState(["gpt-3.5", "gpt-4", "claude-v1"]);
  const [responses, setResponses] = useState<Record<string, string>>({});

  const handleToggleModel = (modelId: string) => {
    setSelectedModels(prev =>
      prev.includes(modelId)
        ? prev.filter(id => id !== modelId)
        : [...prev, modelId]
    );
  };

  const handleGenerate = () => {
    if (!prompt.trim() || selectedModels.length === 0) return;

    setIsGenerating(true);
    setResponses({});

    // Simulate responses from different models
    const mockResponses: Record<string, string> = {};

    setTimeout(() => {
      selectedModels.forEach(modelId => {
        const model = availableModels.find(m => m.id === modelId);
        if (model) {
          mockResponses[modelId] = `Response from ${model.name}:\n\nBased on your prompt, I can provide the following insights...\n\nThis is a simulated response for demonstration purposes. In a real application, this would be the actual response from the ${model.name} model.`;
        }
      });

      setResponses(mockResponses);
      setIsGenerating(false);
    }, 2000);
  };

  const handleCopyResponse = (modelId: string) => {
    if (responses[modelId]) {
      navigator.clipboard.writeText(responses[modelId]);
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 flex flex-col items-center justify-center py-8">
        <div className="w-full max-w-7xl">
          <h1 className="text-3xl font-bold mb-6 text-center">AI Model Comparison</h1>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-1 space-y-6">
              <NeumorphicCard>
                <CardHeader>
                  <h2 className="text-xl font-semibold">Select Models</h2>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {availableModels.map((model) => (
                      <div key={model.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={`model-${model.id}`}
                          checked={selectedModels.includes(model.id)}
                          onCheckedChange={() => handleToggleModel(model.id)}
                        />
                        <Label htmlFor={`model-${model.id}`} className="flex flex-col">
                          <span>{model.name}</span>
                          <span className="text-xs text-muted-foreground">{model.provider}</span>
                        </Label>
                      </div>
                    ))}
                  </div>

                  <Button
                    className="w-full mt-4"
                    onClick={handleGenerate}
                    disabled={isGenerating || !prompt.trim() || selectedModels.length === 0}
                  >
                    {isGenerating ? (
                      <>
                        <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-current border-t-transparent" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Play className="h-4 w-4 mr-1" />
                        Compare Models
                      </>
                    )}
                  </Button>
                </CardContent>
              </NeumorphicCard>

              <NeumorphicCard>
                <CardHeader>
                  <h2 className="text-xl font-semibold">Comparison Metrics</h2>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Button variant="outline" className="w-full justify-start" disabled={Object.keys(responses).length === 0}>
                      <BarChart4 className="h-4 w-4 mr-2" />
                      Response Length
                    </Button>
                    <Button variant="outline" className="w-full justify-start" disabled={Object.keys(responses).length === 0}>
                      <BarChart4 className="h-4 w-4 mr-2" />
                      Response Time
                    </Button>
                    <Button variant="outline" className="w-full justify-start" disabled={Object.keys(responses).length === 0}>
                      <BarChart4 className="h-4 w-4 mr-2" />
                      Sentiment Analysis
                    </Button>
                  </div>
                </CardContent>
              </NeumorphicCard>
            </div>

            <div className="lg:col-span-3 space-y-6">
              <NeumorphicCard>
                <CardHeader>
                  <h2 className="text-xl font-semibold">Prompt</h2>
                </CardHeader>
                <CardContent>
                  <Textarea
                    placeholder="Enter your prompt here..."
                    className="min-h-[150px] resize-none"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                  />
                </CardContent>
              </NeumorphicCard>

              <div>
                <h2 className="text-xl font-semibold mb-4">Responses</h2>

                {isGenerating ? (
                  <div className="flex items-center justify-center p-12 bg-muted/20 rounded-lg">
                    <div className="flex flex-col items-center">
                      <div className="flex space-x-2 mb-2">
                        <div className="w-2 h-2 rounded-full bg-primary/40 animate-bounce" />
                        <div className="w-2 h-2 rounded-full bg-primary/40 animate-bounce [animation-delay:0.2s]" />
                        <div className="w-2 h-2 rounded-full bg-primary/40 animate-bounce [animation-delay:0.4s]" />
                      </div>
                      <p className="text-muted-foreground">Generating responses from selected models...</p>
                    </div>
                  </div>
                ) : Object.keys(responses).length > 0 ? (
                  <Tabs defaultValue={selectedModels[0]}>
                    <TabsList className="mb-4">
                      {selectedModels.map((modelId) => {
                        const model = availableModels.find(m => m.id === modelId);
                        return model && (
                          <TabsTrigger key={modelId} value={modelId}>
                            {model.name}
                          </TabsTrigger>
                        );
                      })}
                    </TabsList>

                    {selectedModels.map((modelId) => {
                      const model = availableModels.find(m => m.id === modelId);
                      return model && (
                        <TabsContent key={modelId} value={modelId}>
                          <NeumorphicCard>
                            <CardContent className="p-6">
                              <div className="flex justify-between items-start mb-4">
                                <div>
                                  <h3 className="font-medium">{model.name}</h3>
                                  <p className="text-sm text-muted-foreground">{model.provider}</p>
                                </div>
                                <div className="flex space-x-2">
                                  <Button variant="outline" size="sm" onClick={() => handleCopyResponse(modelId)}>
                                    <Copy className="h-4 w-4" />
                                    <span className="sr-only">Copy</span>
                                  </Button>
                                  <Button variant="outline" size="sm">
                                    <ThumbsUp className="h-4 w-4" />
                                    <span className="sr-only">Like</span>
                                  </Button>
                                  <Button variant="outline" size="sm">
                                    <ThumbsDown className="h-4 w-4" />
                                    <span className="sr-only">Dislike</span>
                                  </Button>
                                </div>
                              </div>

                              <NeumorphicChatBubble isUser={false} className="w-full max-w-full">
                                <div className="whitespace-pre-wrap">{responses[modelId]}</div>
                              </NeumorphicChatBubble>
                            </CardContent>
                          </NeumorphicCard>
                        </TabsContent>
                      );
                    })}
                  </Tabs>
                ) : (
                  <div className="flex items-center justify-center p-12 bg-muted/20 rounded-lg">
                    <p className="text-muted-foreground">
                      Enter a prompt and select models to compare responses
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}