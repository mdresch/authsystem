"use client";

import { useState } from "react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { NeumorphicCard, CardContent, CardHeader } from "@/components/layout/cbacard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Play, Save, MessageSquare, Mail, FileText, Database, ArrowRight, Settings, Trash2, Clock, Calendar } from 'lucide-react';

// Mock data
const workflows = [
  {
    id: "1",
    name: "Daily News Summary",
    description: "Summarizes news articles and sends an email",
    steps: 4,
    lastRun: "2023-06-15T10:30:00Z",
    status: "active"
  },
  {
    id: "2",
    name: "Customer Support Assistant",
    description: "Analyzes support tickets and suggests responses",
    steps: 3,
    lastRun: "2023-06-14T08:15:00Z",
    status: "active"
  },
  {
    id: "3",
    name: "Content Calendar Generator",
    description: "Creates content ideas and schedules them",
    steps: 5,
    lastRun: null,
    status: "draft"
  }
];

export default function WorkflowsPage() {
  const [activeTab, setActiveTab] = useState("all");
  const [isCreatingWorkflow, setIsCreatingWorkflow] = useState(false);
  const [newWorkflowName, setNewWorkflowName] = useState("");

  const filteredWorkflows = workflows.filter(workflow => {
    if (activeTab === "all") return true;
    if (activeTab === "active") return workflow.status === "active";
    if (activeTab === "draft") return workflow.status === "draft";
    return true;
  });

  const createWorkflow = () => {
    if (!newWorkflowName.trim()) return;
    // Implementation for creating a new workflow
    console.log("Creating workflow:", newWorkflowName);
    setNewWorkflowName("");
    setIsCreatingWorkflow(false);
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 flex flex-col items-center justify-center py-8">
        <div className="w-full max-w-7xl">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">AI Workflows</h1>
            <Button onClick={() => setIsCreatingWorkflow(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Create Workflow
            </Button>
          </div>

          {isCreatingWorkflow && (
            <NeumorphicCard elevated className="mb-6">
              <CardHeader>
                <h2 className="text-xl font-semibold">Create New Workflow</h2>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="workflow-name">Workflow Name</Label>
                    <Input
                      id="workflow-name"
                      placeholder="Enter workflow name"
                      value={newWorkflowName}
                      onChange={(e) => setNewWorkflowName(e.target.value)}
                    />
                  </div>

                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setIsCreatingWorkflow(false)}>
                      Cancel
                    </Button>
                    <Button onClick={createWorkflow}>
                      Create & Edit
                    </Button>
                  </div>
                </div>
              </CardContent>
            </NeumorphicCard>
          )}

          <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-6">
              <TabsTrigger value="all">All Workflows</TabsTrigger>
              <TabsTrigger value="active">Active</TabsTrigger>
              <TabsTrigger value="draft">Drafts</TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="mt-0">
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filteredWorkflows.map((workflow) => (
                  <NeumorphicCard key={workflow.id}>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <h3 className="text-lg font-medium">{workflow.name}</h3>
                        <div className={`px-2 py-1 rounded-full text-xs ${
                          workflow.status === 'active'
                            ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                            : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400'
                        }`}>
                          {workflow.status === 'active' ? 'Active' : 'Draft'}
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">{workflow.description}</p>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center text-sm text-muted-foreground mb-4">
                        <span>{workflow.steps} steps</span>
                        {workflow.lastRun && (
                          <>
                            <span className="mx-2">•</span>
                            <span>Last run: {new Date(workflow.lastRun).toLocaleDateString()}</span>
                          </>
                        )}
                      </div>

                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm" className="flex-1">
                          <Settings className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                        <Button size="sm" className="flex-1">
                          <Play className="h-4 w-4 mr-1" />
                          Run
                        </Button>
                      </div>
                    </CardContent>
                  </NeumorphicCard>
                ))}
              </div>
            </TabsContent>
          </Tabs>

          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-6">Featured Templates</h2>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <NeumorphicCard>
                <CardHeader className="pb-2">
                  <h3 className="text-lg font-medium">Email Summarizer</h3>
                  <p className="text-sm text-muted-foreground">Automatically summarize long emails</p>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-4">
                    <Mail className="h-4 w-4" />
                    <ArrowRight className="h-4 w-4" />
                    <MessageSquare className="h-4 w-4" />
                    <ArrowRight className="h-4 w-4" />
                    <Mail className="h-4 w-4" />
                  </div>

                  <Button variant="outline" size="sm" className="w-full">
                    Use Template
                  </Button>
                </CardContent>
              </NeumorphicCard>

              <NeumorphicCard>
                <CardHeader className="pb-2">
                  <h3 className="text-lg font-medium">Document Analyzer</h3>
                  <p className="text-sm text-muted-foreground">Extract insights from documents</p>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-4">
                    <FileText className="h-4 w-4" />
                    <ArrowRight className="h-4 w-4" />
                    <MessageSquare className="h-4 w-4" />
                    <ArrowRight className="h-4 w-4" />
                    <Database className="h-4 w-4" />
                  </div>

                  <Button variant="outline" size="sm" className="w-full">
                    Use Template
                  </Button>
                </CardContent>
              </NeumorphicCard>

              <NeumorphicCard>
                <CardHeader className="pb-2">
                  <h3 className="text-lg font-medium">Scheduled Reports</h3>
                  <p className="text-sm text-muted-foreground">Generate and send reports on schedule</p>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-4">
                    <Clock className="h-4 w-4" />
                    <ArrowRight className="h-4 w-4" />
                    <Database className="h-4 w-4" />
                    <ArrowRight className="h-4 w-4" />
                    <MessageSquare className="h-4 w-4" />
                    <ArrowRight className="h-4 w-4" />
                    <Mail className="h-4 w-4" />
                  </div>

                  <Button variant="outline" size="sm" className="w-full">
                    Use Template
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