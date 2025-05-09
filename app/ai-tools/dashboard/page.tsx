"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { User, Calendar, Settings, Bell } from "lucide-react";
import { useEffect } from "react"; // Import useEffect

export default function DashboardPage() {
  const router = useRouter();
  const { user, isLoading } = useAuth(); // Corrected variable name: isLoading

  // Use useEffect for redirection, *only* on the client
  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/auth/login");
    }
  }, [isLoading, user, router]); // Correct dependencies

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center p-4">
          <p>Loading...</p>
        </main>
        <Footer />
      </div>
    );
  }

  // If we get here, the user IS logged in, so render the dashboard
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 mx-auto">
        <section className="flex-1 container py-8">
          <h1 className="text-3xl font-bold mb-6 text-center">Dashboard</h1>
          {/* ... rest of your dashboard content ... */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Profile</CardTitle>
                <User className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold overflow-hidden overflow-ellipsis">{user?.email}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {user?.email}
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full mt-4"
                  onClick={() => router.push("/profile")}
                >
                  Manage Profile
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Calendar</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">0</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Upcoming events
                </p>
                <Button variant="outline" size="sm" className="w-full mt-4">
                  View Calendar
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  Notifications
                </CardTitle>
                <Bell className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">0</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Unread notifications
                </p>
                <Button variant="outline" size="sm" className="w-full mt-4">
                  View All
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Settings</CardTitle>
                <Settings className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">Account</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Manage your account settings
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full mt-4"
                  onClick={() => router.push("/profile")}
                >
                  Settings
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="mt-8">
            <Card>
              <CardHeader>
                <CardTitle>Welcome to your dashboard</CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  This is a demo dashboard for the authentication system. In a
                  real application, this would contain your actual application
                  content.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}