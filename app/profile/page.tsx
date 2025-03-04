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

const ProfilePage = () => {
  const router = useRouter()
  const { user, getUser, loading } = useAuth()

  const [profileData, setProfileData] = useState({
    id: "",
    email: "",
    avatar_url: null,
    website: null,
    first_name: "",
    last_name: "",
    name: null,
  })

  const [isEditing, setIsEditing] = useState(false)
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  // Redirect if not logged in
  if (!user && !loading) {
    router.push("/auth/login")
    return null
  }

  // Fetch user data on mount
  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        const userData = await getUser(user.id)
        console.log("Fetched User Data:", userData)
        setProfileData({
          id: userData.id,
          email: userData.email,
          avatar_url: userData.profile.avatar_url || null,
          website: userData.profile.website || null,
          first_name: userData.profile.first_name || "",
          last_name: userData.profile.last_name || "",
          name: userData.profile.name || null,
        })
      }
    }
    fetchUserData()
  }, [user])

  if (loading) {
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

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setProfileData((prev) => ({ ...prev, [name]: value }))
  }

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    // Call your API to update the profile
    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          avatar_url: profileData.avatar_url,
          website: profileData.website,
          first_name: profileData.first_name,
          last_name: profileData.last_name,
        })
        .eq("id", profileData.id)

      if (error) throw error

      toast({
        title: "Success",
        description: "Your profile has been updated successfully.",
      })
      setIsEditing(false) // Exit edit mode
    } catch (error) {
      console.error("Error updating profile:", error)
      toast({
        variant: "destructive",
        title: "Profile update failed",
        description: error instanceof Error ? error.message : "An unknown error occurred",
      })
    }
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setPasswordData((prev) => ({ ...prev, [name]: value }))
  }

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate the new password
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      console.error("Passwords do not match");
      return; // You can also show a toast or alert here
    }

    // Call your API to update the password
    try {
      const { error } = await supabase.auth.updateUser({
        password: passwordData.newPassword,
      });

      if (error) throw error;

      console.log("Password successfully updated");
      // Provide feedback to the user
      toast({
        title: "Success",
        description: "Your password has been updated successfully.",
      });

      // Optionally, reset the password data
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      console.error("Error updating password:", error);
      toast({
        variant: "destructive",
        title: "Password update failed",
        description: error instanceof Error ? error.message : "An unknown error occurred",
      });
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 container max-w-4xl py-8 mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center">Account Settings</h1>
        
        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="profile">Profile Information</TabsTrigger>
            <TabsTrigger value="password">Reset Password</TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleProfileUpdate}>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      value={profileData.email}
                      disabled
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="avatarUrl">Avatar URL</Label>
                    <Input
                      id="avatarUrl"
                      name="avatar_url"
                      value={profileData.avatar_url || ""}
                      onChange={handleProfileChange}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="website">Website</Label>
                    <Input
                      id="website"
                      name="website"
                      value={profileData.website || ""}
                      onChange={handleProfileChange}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      name="first_name"
                      value={profileData.first_name}
                      onChange={handleProfileChange}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      name="last_name"
                      value={profileData.last_name}
                      onChange={handleProfileChange}
                      disabled={!isEditing}
                    />
                  </div>
                  
                  {/* Row for Edit and Save buttons */}
                  <div className="flex justify-between mt-4">
                    <Button type="button" onClick={() => setIsEditing(!isEditing)}>
                      {isEditing ? "Cancel" : "Edit"}
                    </Button>
                    {isEditing && <Button type="submit">Save Changes</Button>}
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="password">
            <Card>
              <CardHeader>
                <CardTitle>Reset Password</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handlePasswordReset}>
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">Current Password</Label>
                    <Input
                      id="currentPassword"
                      name="currentPassword"
                      type="password"
                      value={passwordData.currentPassword}
                      onChange={handlePasswordChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="newPassword">New Password</Label>
                    <Input
                      id="newPassword"
                      name="newPassword"
                      type="password"
                      value={passwordData.newPassword}
                      onChange={handlePasswordChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      value={passwordData.confirmPassword}
                      onChange={handlePasswordChange}
                      required
                    />
                  </div>
                  <Button type="submit">Reset Password</Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
      <Footer />
    </div>
  )
}

export default ProfilePage

