"use client";

import { useState } from "react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { NeumorphicCard, CardContent, CardHeader } from "@/components/layout/cbacard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

export default function SettingsPage() {
  const [autoSave, setAutoSave] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [temperature, setTemperature] = useState(0.7);
  const [maxTokens, setMaxTokens] = useState(2048);
  const [defaultModel, setDefaultModel] = useState("gpt-3.5-turbo");
  const [defaultAgent, setDefaultAgent] = useState("general");

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 flex flex-col items-center justify-center py-8">
        <div className="w-full max-w-7xl">
          <h1 className="text-3xl font-bold mb-6 text-center">Settings</h1>

          <Tabs defaultValue="general">
            <TabsList className="mb-6">
              <TabsTrigger value="general">General</TabsTrigger>
              <TabsTrigger value="ai">AI Configuration</TabsTrigger>
              <TabsTrigger value="appearance">Appearance</TabsTrigger>
              <TabsTrigger value="privacy">Privacy & Security</TabsTrigger>
            </TabsList>

            <TabsContent value="general">
              <NeumorphicCard>
                <CardHeader>
                  <h2 className="text-xl font-semibold">General Settings</h2>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="auto-save">Auto-save conversations</Label>
                      <p className="text-sm text-muted-foreground">Automatically save all conversations</p>
                    </div>
                    <Switch
                      id="auto-save"
                      checked={autoSave}
                      onCheckedChange={setAutoSave}
                    />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="notifications">Notifications</Label>
                      <p className="text-sm text-muted-foreground">Receive notifications for new messages</p>
                    </div>
                    <Switch
                      id="notifications"
                      checked={notifications}
                      onCheckedChange={setNotifications}
                    />
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <Label htmlFor="language">Language</Label>
                    <Select defaultValue="en">
                      <SelectTrigger id="language">
                        <SelectValue placeholder="Select language" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="es">Spanish</SelectItem>
                        <SelectItem value="fr">French</SelectItem>
                        <SelectItem value="de">German</SelectItem>
                        <SelectItem value="ja">Japanese</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </NeumorphicCard>
            </TabsContent>

            <TabsContent value="ai">
              <NeumorphicCard>
                <CardHeader>
                  <h2 className="text-xl font-semibold">AI Configuration</h2>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="default-model">Default Model</Label>
                    <Select value={defaultModel} onValueChange={setDefaultModel}>
                      <SelectTrigger id="default-model">
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
                    <Label htmlFor="default-agent">Default Agent</Label>
                    <Select value={defaultAgent} onValueChange={setDefaultAgent}>
                      <SelectTrigger id="default-agent">
                        <SelectValue placeholder="Select agent" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="general">General Assistant</SelectItem>
                        <SelectItem value="coder">Code Expert</SelectItem>
                        <SelectItem value="writer">Creative Writer</SelectItem>
                        <SelectItem value="analyst">Data Analyst</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Separator />

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
                </CardContent>
              </NeumorphicCard>
            </TabsContent>

            <TabsContent value="appearance">
              <NeumorphicCard>
                <CardHeader>
                  <h2 className="text-xl font-semibold">Appearance</h2>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="dark-mode">Dark Mode</Label>
                      <p className="text-sm text-muted-foreground">Toggle between light and dark mode</p>
                    </div>
                    <Switch
                      id="dark-mode"
                      checked={darkMode}
                      onCheckedChange={setDarkMode}
                    />
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <Label>Theme Color</Label>
                    <div className="grid grid-cols-5 gap-2">
                      {['blue', 'purple', 'green', 'red', 'orange'].map((color) => (
                        <div
                          key={color}
                          className={`h-8 rounded-md cursor-pointer border-2 ${color === 'blue' ? 'border-primary' : 'border-transparent'}`}
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <Label htmlFor="font-size">Font Size</Label>
                    <Select defaultValue="medium">
                      <SelectTrigger id="font-size">
                        <SelectValue placeholder="Select font size" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="small">Small</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="large">Large</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </NeumorphicCard>
            </TabsContent>

            <TabsContent value="privacy">
              <NeumorphicCard>
                <CardHeader>
                  <h2 className="text-xl font-semibold">Privacy & Security</h2>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="data-collection">Data Collection</Label>
                      <p className="text-sm text-muted-foreground">Allow anonymous usage data collection</p>
                    </div>
                    <Switch id="data-collection" defaultChecked />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="conversation-history">Conversation History</Label>
                      <p className="text-sm text-muted-foreground">Store conversation history</p>
                    </div>
                    <Switch id="conversation-history" defaultChecked />
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <Label>Data Management</Label>
                    <div className="flex flex-col space-y-2">
                      <Button variant="outline">Export All Data</Button>
                      <Button variant="outline" className="text-destructive">Delete All Conversations</Button>
                      <Button variant="outline" className="text-destructive">Delete Account</Button>
                    </div>
                  </div>
                </CardContent>
              </NeumorphicCard>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
}