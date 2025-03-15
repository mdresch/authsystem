"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { UserRound, Settings, FileText, LogOut } from "lucide-react"
import Link from "next/link"

export default function Dashboard() {
  const { user, isLoading, signOut, getProfile } = useAuth()
  const [profile, setProfile] = useState<any>(null)
  const [loadingProfile, setLoadingProfile] = useState(true)
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/auth/login")
    }
  }, [user, isLoading, router])

  useEffect(() => {
    const fetchProfile = async () => {
      if (user) {
        try {
          setLoadingProfile(true)
          const profileData = await getProfile(user.id)
          setProfile(profileData)
        } catch (error) {
          console.error("Error fetching profile:", error)
        } finally {
          setLoadingProfile(false)
        }
      }
    }

    if (user) {
      fetchProfile()
    }
  }, [user, getProfile])

  const handleSignOut = async () => {
    await signOut()
    router.push("/auth/login")
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <Skeleton className="h-12 w-1/3 mb-6" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Skeleton className="h-40" />
              <Skeleton className="h-40" />
            </div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  if (!user) {
    return null // Router will redirect to login
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <UserRound className="mr-2 h-5 w-5" />
                  Welcome, {profile?.name || user.email?.split('@')[0] || "User"}!
                </CardTitle>
                <CardDescription>
                  {new Date().toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p>Your account was created on {user.created_at ? new Date(user.created_at).toLocaleDateString() : "recently"}.</p>
                <p className="mt-2">Email: {user.email}</p>
              </CardContent>
              <CardFooter>
                <Button asChild variant="outline" size="sm">
                  <Link href="/profile">View Profile</Link>
                </Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Manage your account and settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link href="/profile">
                    <UserRound className="mr-2 h-4 w-4" /> Profile
                  </Link>
                </Button>
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link href="/settings">
                    <Settings className="mr-2 h-4 w-4" /> Settings
                  </Link>
                </Button>
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link href="/documents">
                    <FileText className="mr-2 h-4 w-4" /> Documents
                  </Link>
                </Button>
              </CardContent>
              <CardFooter>
                <Button variant="ghost" className="w-full text-destructive" onClick={handleSignOut}>
                  <LogOut className="mr-2 h-4 w-4" /> Sign out
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
