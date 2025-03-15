"use client";

import { useState } from "react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { NeumorphicCard, CardContent, CardHeader } from "@/components/layout/cbacard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { NeumorphicProgress } from "@/components/layout/neumorphicprogressbar";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Database, FileText, Globe, Link, Plus, RefreshCw, Trash2, Upload, Check, X } from 'lucide-react';

// Mock data
const knowledgeSources = [
  { 
    id: "1", 
    name: "Company Documentation", 
    type: "files", 
    status: "synced", 
    items: 24, 
    lastSync: "2023-06-15T10:30:00Z",
    enabled: true
  },
  { 
    id: "2", 
    name: "Product Knowledge Base", 
    type: "website", 
    status: "synced", 
    items: 156, 
    lastSync: "2023-06-14T08:15:00Z",
    enabled: true
  },
  { 
    id: "3", 
    name: "Customer Support FAQ", 
    type: "database", 
    status: "syncing", 
    items: 78, 
    lastSync: "2023-06-16T14:45:00Z",
    enabled: true
  },
  { 
    id: "4", 
    name: "Engineering Wiki", 
    type: "website", 
    status: "error", 
    items: 0, 
    lastSync: "2023-06-10T11:20:00Z",
    enabled: false
  },
];

export default function KnowledgeBasePage() {
  const [sources, setSources] = useState(knowledgeSources);
  const [newSourceUrl, setNewSourceUrl] = useState("");
  const [isAddingSource, setIsAddingSource] = useState(false);
  
  const getSourceIcon = (type: string) => {
    switch (type) {
      case "files": return <FileText className="h-5 w-5" />;
      case "website": return <Globe className="h-5 w-5" />;
      case "database": return <Database className="h-5 w-5" />;
      default: return <Link className="h-5 w-5" />;
    }
  };
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "synced":
        return (
          <div className="flex items-center text-green-600 dark:text-green-400">
            <Check className="h-4 w-4 mr-1" />
            <span>Synced</span>
          </div>
        );
      case "syncing":
        return (
          <div className="flex items-center text-blue-600 dark:text-blue-400">
            <RefreshCw className="h-4 w-4 mr-1 animate-spin" />
            <span>Syncing</span>
          </div>
        );
      case "error":
        return (
          <div className="flex items-center text-red-600 dark:text-red-400">
            <X className="h-4 w-4 mr-1" />
            <span>Error</span>
          </div>
        );
      default:
        return null;
    }
  };
  
  const toggleSourceEnabled = (id: string) => {
    setSources(sources.map(source => 
      source.id === id ? { ...source, enabled: !source.enabled } : source
    ));
  };
  
  const deleteSource = (id: string) => {
    setSources(sources.filter(source => source.id !== id));
  };
  
  const addNewSource = () => {
    if (!newSourceUrl.trim()) return;
    
    const newSource = {
      id: Date.now().toString(),
      name: new URL(newSourceUrl).hostname,
      type: "website",
      status: "syncing",
      items: 0,
      lastSync: new Date().toISOString(),
      enabled: true
    };
    
    setSources([...sources, newSource]);
    setNewSourceUrl("");
    setIsAddingSource(false);
  };
  
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 flex flex-col items-center justify-center py-8">
        <div className="w-full max-w-7xl">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">Knowledge Base</h1>
            <Button onClick={() => setIsAddingSource(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Source
            </Button>
          </div>
          
          <Tabs defaultValue="sources">
            <TabsList className="mb-6">
              <TabsTrigger value="sources">Knowledge Sources</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
              <TabsTrigger value="usage">Usage & Analytics</TabsTrigger>
            </TabsList>
            
            <TabsContent value="sources">
              <div className="space-y-6">
                {isAddingSource && (
                  <NeumorphicCard elevated>
                    <CardHeader>
                      <h2 className="text-xl font-semibold">Add Knowledge Source</h2>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="p-4 rounded-lg border border-primary/20 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-primary/5 transition-colors">
                            <Globe className="h-8 w-8 mb-2 text-primary" />
                            <h3 className="font-medium">Website</h3>
                            <p className="text-sm text-muted-foreground">Connect to a website or web page</p>
                          </div>
                          <div className="p-4 rounded-lg border border-muted flex flex-col items-center justify-center text-center cursor-pointer hover:bg-muted/20 transition-colors">
                            <Upload className="h-8 w-8 mb-2 text-muted-foreground" />
                            <h3 className="font-medium">Upload Files</h3>
                            <p className="text-sm text-muted-foreground">Upload PDF, DOCX, or TXT files</p>
                          </div>
                          <div className="p-4 rounded-lg border border-muted flex flex-col items-center justify-center text-center cursor-pointer hover:bg-muted/20 transition-colors">
                            <Database className="h-8 w-8 mb-2 text-muted-foreground" />
                            <h3 className="font-medium">Database</h3>
                            <p className="text-sm text-muted-foreground">Connect to a database or API</p>
                          </div>
                        </div>
                        
                        <div className="space-y-2 mt-4">
                          <Label htmlFor="source-url">Website URL</Label>
                          <div className="flex space-x-2">
                            <Input 
                              id="source-url" 
                              placeholder="https://example.com" 
                              value={newSourceUrl}
                              onChange={(e) => setNewSourceUrl(e.target.value)}
                            />
                            <Button onClick={addNewSource}>Add</Button>
                            <Button variant="outline" onClick={() => setIsAddingSource(false)}>Cancel</Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </NeumorphicCard>
                )}
                
                {sources.map((source) => (
                  <NeumorphicCard key={source.id}>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center">
                          <div className="mr-4 p-2 bg-primary/10 rounded-full">
                            {getSourceIcon(source.type)}
                          </div>
                          <div>
                            <h3 className="text-lg font-medium">{source.name}</h3>
                            <div className="flex items-center text-sm text-muted-foreground">
                              <span className="capitalize">{source.type}</span>
                              <span className="mx-2">•</span>
                              <span>{source.items} items</span>
                              {source.lastSync && (
                                <>
                                  <span className="mx-2">•</span>
                                  <span>Last sync: {new Date(source.lastSync).toLocaleDateString()}</span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          {getStatusBadge(source.status)}
                          <Switch 
                            checked={source.enabled} 
                            onCheckedChange={() => toggleSourceEnabled(source.id)}
                          />
                          <Button variant="ghost" size="icon" onClick={() => deleteSource(source.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      
                      {source.status === "syncing" && (
                        <div className="mt-4">
                          <NeumorphicProgress value={45} className="h-2" />
                          <p className="text-xs text-muted-foreground mt-1">Syncing... 45%</p>
                        </div>
                      )}
                    </CardContent>
                  </NeumorphicCard>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="settings">
              <NeumorphicCard>
                <CardHeader>
                  <h2 className="text-xl font-semibold">Knowledge Base Settings</h2>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="auto-sync">Automatic Synchronization</Label>
                      <p className="text-sm text-muted-foreground">Automatically sync knowledge sources daily</p>
                    </div>
                    <Switch id="auto-sync" defaultChecked />
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="use-knowledge">Use Knowledge Base in Chat</Label>
                      <p className="text-sm text-muted-foreground">Allow AI to reference knowledge base when responding</p>
                    </div>
                    <Switch id="use-knowledge" defaultChecked />
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="cite-sources">Cite Sources</Label>
                      <p className="text-sm text-muted-foreground">Include citations when AI uses knowledge base</p>
                    </div>
                    <Switch id="cite-sources" defaultChecked />
                  </div>
                </CardContent>
              </NeumorphicCard>
            </TabsContent>
            
            <TabsContent value="usage">
              <NeumorphicCard>
                <CardHeader>
                  <h2 className="text-xl font-semibold">Knowledge Base Usage</h2>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <h3 className="text-lg font-medium">Total Documents</h3>
                      <p className="text-3xl font-bold">258</p>
                      <p className="text-sm text-muted-foreground">Across all sources</p>
                    </div>
                    
                    <div className="space-y-2">
                      <h3 className="text-lg font-medium">Storage Used</h3>
                      <p className="text-3xl font-bold">1.2 GB</p>
                      <p className="text-sm text-muted-foreground">Of 5 GB limit</p>
                    </div>
                    
                    <div className="space-y-2">
                      <h3 className="text-lg font-medium">Knowledge Queries</h3>
                      <p className="text-3xl font-bold">1,458</p>
                      <p className="text-sm text-muted-foreground">This month</p>
                    </div>
                  </div>
                  
                  <div className="mt-8">
                    <h3 className="text-lg font-medium mb-4">Most Referenced Documents</h3>
                    <div className="space-y-4">
                      {[
                        { name: "Product Manual.pdf", count: 145, source: "Company Documentation" },
                        { name: "API Reference", count: 98, source: "Product Knowledge Base" },
                        { name: "Troubleshooting Guide", count: 76, source: "Customer Support FAQ" },
                      ].map((doc, i) => (
                        <div key={i} className="flex items-center justify-between p-3 bg-muted/20 rounded-lg">
                          <div>
                            <p className="font-medium">{doc.name}</p>
                            <p className="text-xs text-muted-foreground">{doc.source}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">{doc.count}</p>
                            <p className="text-xs text-muted-foreground">references</p>
                          </div>
                        </div>
                      ))}
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