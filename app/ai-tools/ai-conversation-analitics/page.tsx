"use client";

import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { NeumorphicCard, CardContent, CardHeader } from "@/components/layout/cbacard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

// Mock data for analytics
const usageData = [
  { day: 'Mon', messages: 24 },
  { day: 'Tue', messages: 13 },
  { day: 'Wed', messages: 38 },
  { day: 'Thu', messages: 27 },
  { day: 'Fri', messages: 42 },
  { day: 'Sat', messages: 15 },
  { day: 'Sun', messages: 8 },
];

const modelUsageData = [
  { name: 'GPT-3.5', value: 55 },
  { name: 'GPT-4', value: 30 },
  { name: 'Claude', value: 15 },
];

const agentUsageData = [
  { name: 'General Assistant', value: 40 },
  { name: 'Code Expert', value: 25 },
  { name: 'Creative Writer', value: 20 },
  { name: 'Data Analyst', value: 15 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

export default function AnalyticsPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 flex flex-col items-center justify-center py-8">
        <div className="w-full max-w-7xl">
          <h1 className="text-3xl font-bold mb-6 text-center">Conversation Analytics</h1>
          
          <div className="grid gap-6 md:grid-cols-3 mb-6">
            <NeumorphicCard>
              <CardHeader className="pb-2">
                <h3 className="font-medium">Total Conversations</h3>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">127</div>
                <p className="text-sm text-muted-foreground">+12% from last month</p>
              </CardContent>
            </NeumorphicCard>
            
            <NeumorphicCard>
              <CardHeader className="pb-2">
                <h3 className="font-medium">Total Messages</h3>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">1,842</div>
                <p className="text-sm text-muted-foreground">+8% from last month</p>
              </CardContent>
            </NeumorphicCard>
            
            <NeumorphicCard>
              <CardHeader className="pb-2">
                <h3 className="font-medium">Average Response Time</h3>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">1.8s</div>
                <p className="text-sm text-muted-foreground">-0.3s from last month</p>
              </CardContent>
            </NeumorphicCard>
          </div>
          
          <Tabs defaultValue="usage">
            <TabsList className="mb-6">
              <TabsTrigger value="usage">Usage</TabsTrigger>
              <TabsTrigger value="models">Models</TabsTrigger>
              <TabsTrigger value="agents">Agents</TabsTrigger>
              <TabsTrigger value="topics">Topics</TabsTrigger>
            </TabsList>
            
            <TabsContent value="usage">
              <NeumorphicCard>
                <CardHeader>
                  <h2 className="text-xl font-semibold">Daily Message Volume</h2>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={usageData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="day" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="messages" fill="#3b82f6" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </NeumorphicCard>
            </TabsContent>
            
            <TabsContent value="models">
              <NeumorphicCard>
                <CardHeader>
                  <h2 className="text-xl font-semibold">Model Usage Distribution</h2>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={modelUsageData}
                          cx="50%"
                          cy="50%"
                          labelLine={true}
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {modelUsageData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </NeumorphicCard>
            </TabsContent>
            
            <TabsContent value="agents">
              <NeumorphicCard>
                <CardHeader>
                  <h2 className="text-xl font-semibold">Agent Usage Distribution</h2>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={agentUsageData}
                          cx="50%"
                          cy="50%"
                          labelLine={true}
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {agentUsageData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </NeumorphicCard>
            </TabsContent>
            
            <TabsContent value="topics">
              <NeumorphicCard>
                <CardHeader>
                  <h2 className="text-xl font-semibold">Common Topics</h2>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                    {['Programming', 'Writing', 'Data Analysis', 'Design', 'Business', 'Education', 'Science', 'Technology'].map((topic) => (
                      <div key={topic} className="bg-secondary rounded-lg p-4 text-center">
                        <div className="font-medium">{topic}</div>
                        <div className="text-sm text-muted-foreground">{Math.floor(Math.random() * 100)}%</div>
                      </div>
                    ))}
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