"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "@/components/ui/use-toast"
import { supabase } from "@/lib/supabaseClient"

interface ProfileData {
  id: string;
  full_name?: string | null;
  bio?: string | null;
  avatar_url?: string | null;
  website?: string | null;
  first_name?: string | null;
  last_name?: string | null;
}

const ProfilePage = () => {
  const router = useRouter()
  const { user, getProfile, isLoading } = useAuth()

  const [profileData, setProfileData] = useState<ProfileData | null>(null)

  // Redirect if not logged in
  useEffect(() => {
    if (!user && !isLoading) {
      router.push("/auth/login")
    }
  }, [user, isLoading, router])

  // Fetch user data on mount
  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        try {
          const userData = await getProfile(user.id)
          console.log("Fetched User Data:", userData)
          setProfileData({
            id: user.id,
            full_name: userData.full_name,
            bio: userData.bio,
            avatar_url: userData.avatar_url,
            website: userData.website,
            first_name: userData.first_name,
            last_name: userData.last_name,
          })
        } catch (error) {
          console.error("Error fetching profile:", error)
          toast({
            variant: "destructive",
            title: "Error fetching profile",
            description: error instanceof Error ? error.message : "An unknown error occurred.",
          })
        }
      }
    }
    fetchUserData()
  }, [user, getProfile])

  if (isLoading || !user) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center p-4">
          <p>Loading...</p>
        </main>
        <Footer />
      </div>
    )
  }

  if (!profileData) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center p-4">
          <p>No profile data found.</p>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="container flex-1 items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>User Profile</CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              <strong>ID:</strong> {profileData.id}
            </p>
            {profileData.full_name && (
              <p>
                <strong>Full Name:</strong> {profileData.full_name}
              </p>
            )}
            {profileData.bio && (
              <p>
                <strong>Bio:</strong> {profileData.bio}
              </p>
            )}
            {profileData.first_name && (
              <p>
                <strong>First Name:</strong> {profileData.first_name}
              </p>
            )}
            {profileData.last_name && (
              <p>
                <strong>Last Name:</strong> {profileData.last_name}
              </p>
            )}
            {profileData.website && (
              <p>
                <strong>Website:</strong> {profileData.website}
              </p>
            )}
            {profileData.avatar_url && (
              <div>
                <strong>Avatar:</strong>
                <img
                  src={profileData.avatar_url}
                  alt="User Avatar"
                  className="mt-2 h-20 w-20 rounded-full"
                />
              </div>
            )}
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  )
}

export default ProfilePage

