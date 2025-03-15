"use client";

import { useState } from "react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { NeumorphicCard, CardContent, CardHeader } from "@/components/layout/cbacard";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Brain, Save, Play, Plus, Trash2 } from 'lucide-react';

export default function AgentBuilderPage() {
  const [agentName, setAgentName] = useState("New Agent");
  const [agentDescription, setAgentDescription] = useState("");
  const [temperature, setTemperature] = useState(0.7);
  const [maxTokens, setMaxTokens] = useState(2048);
  const [systemPrompt, setSystemPrompt] = useState("");
  const [enableWebSearch, setEnableWebSearch] = useState(false);
  const [enableCodeExecution, setEnableCodeExecution] = useState(false);

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 flex flex-col items-center justify-center py-8">
        <div className="w-full max-w-7xl">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">Agent Builder</h1>
            <div className="flex space-x-2">
              <Button variant="outline">
                <Play className="mr-2 h-4 w-4" />
                Test Agent
              </Button>
              <Button>
                <Save className="mr-2 h-4 w-4" />
                Save Agent
              </Button>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <div className="md:col-span-1">
              <NeumorphicCard>
                <CardHeader>
                  <h2 className="text-xl font-semibold">My Agents</h2>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-2 bg-secondary rounded-md">
                      <div className="flex items-center">
                        <Brain className="h-4 w-4 mr-2" />
                        <span>Code Expert</span>
                      </div>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-secondary rounded-md">
                      <div className="flex items-center">
                        <Brain className="h-4 w-4 mr-2" />
                        <span>Creative Writer</span>
                      </div>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-secondary rounded-md">
                      <div className="flex items-center">
                        <Brain className="h-4 w-4 mr-2" />
                        <span>Data Analyst</span>
                      </div>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <Button variant="outline" className="w-full">
                      <Plus className="mr-2 h-4 w-4" />
                      Create New Agent
                    </Button>
                  </div>
                </CardContent>
              </NeumorphicCard>
            </div>

            <div className="md:col-span-2">
              <NeumorphicCard>
                <CardHeader>
                  <h2 className="text-xl font-semibold">Agent Configuration</h2>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="basic">
                    <TabsList className="mb-4">
                      <TabsTrigger value="basic">Basic Settings</TabsTrigger>
                      <TabsTrigger value="advanced">Advanced Settings</TabsTrigger>
                      <TabsTrigger value="capabilities">Capabilities</TabsTrigger>
                    </TabsList>

                    <TabsContent value="basic" className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="agent-name">Agent Name</Label>
                        <Input
                          id="agent-name"
                          value={agentName}
                          onChange={(e) => setAgentName(e.target.value)}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="agent-description">Description</Label>
                        <Textarea
                          id="agent-description"
                          value={agentDescription}
                          onChange={(e) => setAgentDescription(e.target.value)}
                          placeholder="Describe what this agent does..."
                          rows={3}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="system-prompt">System Prompt</Label>
                        <Textarea
                          id="system-prompt"
                          value={systemPrompt}
                          onChange={(e) => setSystemPrompt(e.target.value)}
                          placeholder="Instructions for the AI..."
                          rows={6}
                        />
                      </div>
                    </TabsContent>

                    <TabsContent value="advanced" className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <Label htmlFor="temperature">Temperature: {temperature}</Label>
                          <span className="text-sm text-muted-foreground">Controls randomness</span>
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
                          <span className="text-sm text-muted-foreground">Maximum response length</span>
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
                    </TabsContent>

                    <TabsContent value="capabilities" className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="web-search">Web Search</Label>
                          <p className="text-sm text-muted-foreground">Allow agent to search the web for information</p>
                        </div>
                        <Switch
                          id="web-search"
                          checked={enableWebSearch}
                          onCheckedChange={setEnableWebSearch}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="code-execution">Code Execution</Label>
                          <p className="text-sm text-muted-foreground">Allow agent to execute code</p>
                        </div>
                        <Switch
                          id="code-execution"
                          checked={enableCodeExecution}
                          onCheckedChange={setEnableCodeExecution}
                        />
                      </div>
                    </TabsContent>
                  </Tabs>
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