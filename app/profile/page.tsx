"use client";

import type React from "react";
import { useState, useEffect, useRef } from "react"; // Import useRef
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabaseClient";

interface ProfileData {
  id: string;
  updated_at?: string | null;
  username?: string | null;
  avatar_url?: string | null;
  website?: string | null;
  first_name?: string | null;
  last_name?: string | null;
  name?: string | null;
  defaultprovider?: string | null;
  defaulttemperature?: number | null;
  createdat?: string | null;
  lastlogin?: string | null;
  favoriteprompts?: any[] | null;
  customcategories?: any[] | null;
  bio?: string | null;
}

const ProfilePage = () => {
  const router = useRouter();
  const { user, getProfile, isLoading } = useAuth();

  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const realtimeSubscription = useRef<any>(null); // Use useRef to store the subscription

  // Redirect if not logged in
  useEffect(() => {
    if (!user && !isLoading) {
      router.push("/auth/login");
    }
  }, [user, isLoading, router]);

  // Fetch user data on mount and set up Realtime subscription
  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        try {
          const userData = await getProfile(user.id);
          console.log("Fetched User Data:", userData);

          setProfileData({
            id: user.id,
            updated_at: userData.updated_at || null,
            username: userData.username || null,
            avatar_url: userData.avatar_url || null,
            website: userData.website || null,
            first_name: userData.first_name || null,
            last_name: userData.last_name || null,
            name: userData.name || null,
            defaultprovider: userData.defaultprovider || null,
            defaulttemperature: userData.defaulttemperature || null,
            createdat: userData.createdat || null,
            lastlogin: userData.lastlogin || null,
            favoriteprompts: userData.favoriteprompts || null,
            customcategories: userData.customcategories || null,
            bio: userData.bio || null,
          });

          // Subscribe to Realtime updates
          if (!realtimeSubscription.current) {
            realtimeSubscription.current = supabase
              .channel('any') // you can use any string
              .on(
                'postgres_changes',
                { event: 'UPDATE', schema: 'public', table: 'profiles', filter: `id=eq.${user.id}` },
                (payload) => {
                  console.log('Realtime update received!', payload)
                  // Update the profile data with the new data from the payload
                  setProfileData((prevProfileData: ProfileData | null) => {
                    if (prevProfileData && prevProfileData.id === payload.new.id) {
                      return {
                        ...prevProfileData,
                        ...payload.new,
                      };
                    }
                    return prevProfileData;
                  });
                }
              )
              .subscribe();
          }
        } catch (error) {
          console.error("Error fetching profile:", error);
          toast({
            variant: "destructive",
            title: "Error fetching profile",
            description:
              error instanceof Error
                ? error.message
                : "An unknown error occurred.",
          });
        }
      }
    };
    fetchUserData();

    // Unsubscribe from Realtime when the component unmounts
    return () => {
      if (realtimeSubscription.current) {
        supabase.removeChannel(realtimeSubscription.current)
      }
    };
  }, [user, getProfile]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
  
    console.log(`Input changed: Name - ${name}, Value - ${value}`);
  
    setProfileData((prev) => {
      if (prev) {
        return { ...prev, [name]: value };
      }
      return prev;
    });
  
    console.log("Updated profileData:", { ...profileData, [name]: value });
  };

  const updateProfile = async () => {
    if (!user || !profileData) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "You must be logged in to update your profile.",
      });
      return;
    }

    if (profileData.username && profileData.username.length < 3) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Username must be at least 3 characters long.",
      });
      return;
    }

    try {
      console.log("Updating profile with data:", profileData); // Debugging log

      const { error } = await supabase
        .from("profiles")
        .update({
          updated_at: new Date().toISOString(), // Update with current timestamp
          username: profileData.username,
          avatar_url: profileData.avatar_url,
          website: profileData.website,
          first_name: profileData.first_name,
          last_name: profileData.last_name,
          name: profileData.name,
          defaultprovider: profileData.defaultprovider,
          defaulttemperature: profileData.defaulttemperature,
          createdat: profileData.createdat,
          lastlogin: profileData.lastlogin,
          favoriteprompts: profileData.favoriteprompts
            ? JSON.stringify(profileData.favoriteprompts)
            : null,
          customcategories: profileData.customcategories
            ? JSON.stringify(profileData.customcategories)
            : null,
          bio: profileData.bio,
        })
        .eq("id", user.id);

      if (error) {
        console.error("Supabase update error:", error);
        if (error.code === "23505") {
          toast({
            variant: "destructive",
            title: "Error",
            description: "This username is already taken. Please choose another username.",
          });
        } else {
          throw error;
        }
        return;
      }

      console.log("Profile updated successfully"); // Debugging log

      // Fetch the latest profile data after update
      const updatedUserData = await getProfile(user.id);
      console.log("Updated User Data:", updatedUserData);
      setProfileData(updatedUserData);

      toast({
        title: "Profile updated!",
        description: "Profile update successful.",
      });
      setIsEditing(false);

    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        variant: "destructive",
        title: "Error updating profile",
        description:
          error instanceof Error
            ? error.message
            : "An unknown error occurred.",
      });
    }
  };

  if (isLoading || !user) {
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

  if (!profileData) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center p-4">
          <p>No profile data found.</p>
        </main>
        <Footer />
      </div>
    );
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
            {isEditing ? (
              <>
                <div className="grid gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      name="name"
                      value={profileData.name || ""}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <Input
                      id="username"
                      name="username"
                      value={profileData.username || ""}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="avatar_url">Avatar URL</Label>
                    <Input
                      id="avatar_url"
                      name="avatar_url"
                      value={profileData.avatar_url || ""}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="website">Website</Label>
                    <Input
                      id="website"
                      name="website"
                      value={profileData.website || ""}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="first_name">First Name</Label>
                    <Input
                      id="first_name"
                      name="first_name"
                      value={profileData.first_name || ""}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="last_name">Last Name</Label>
                    <Input
                      id="last_name"
                      name="last_name"
                      value={profileData.last_name || ""}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="defaultprovider">Default Provider</Label>
                    <Input
                      id="defaultprovider"
                      name="defaultprovider"
                      value={profileData.defaultprovider || ""}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="defaulttemperature">
                      Default Temperature
                    </Label>
                    <Input
                      id="defaulttemperature"
                      name="defaulttemperature"
                      type="number"
                      value={profileData.defaulttemperature?.toString() || ""}
                      onChange={(e) => {
                        const value = e.target.value;
                        const parsedValue = value === "" ? null : Number(value);
                        handleInputChange({
                          target: { name: "defaulttemperature", value: parsedValue },
                        } as any);
                      }}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="createdat">Created At</Label>
                    <Input
                      id="createdat"
                      name="createdat"
                      value={profileData.createdat || ""}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastlogin">Last Login</Label>
                    <Input
                      id="lastlogin"
                      name="lastlogin"
                      value={profileData.lastlogin || ""}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="favoriteprompts">Favorite Prompts</Label>
                    <Input
                      id="favoriteprompts"
                      name="favoriteprompts"
                      value={profileData.favoriteprompts ? JSON.stringify(profileData.favoriteprompts) : ""}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="customcategories">Custom Categories</Label>
                    <Input
                      id="customcategories"
                      name="customcategories"
                      value={profileData.customcategories ? JSON.stringify(profileData.customcategories) : ""}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Input
                      id="bio"
                      name="bio"
                      value={profileData.bio || ""}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </>
            ) : (
              <>
                {/* Display the profile data */}
                <p>
                  <strong>Name:</strong> {profileData.name}
                </p>
                <p>
                  <strong>Username:</strong> {profileData.username}
                </p>
                <p>
                  <strong>Avatar URL:</strong> {profileData.avatar_url}
                </p>
                <p>
                  <strong>Website:</strong> {profileData.website}
                </p>
                <p>
                  <strong>First Name:</strong> {profileData.first_name}
                </p>
                <p>
                  <strong>Last Name:</strong> {profileData.last_name}
                </p>
                <p>
                  <strong>Default Provider:</strong> {profileData.defaultprovider}
                </p>
                <p>
                  <strong>Default Temperature:</strong>{" "}
                  {profileData.defaulttemperature}
                </p>
                <p>
                  <strong>Created At:</strong> {profileData.createdat}
                </p>
                <p>
                  <strong>Last Login:</strong> {profileData.lastlogin}
                </p>
                <p>
                  <strong>Favorite Prompts:</strong> {profileData.favoriteprompts ? JSON.stringify(profileData.favoriteprompts) : ""}
                </p>
                <p>
                  <strong>Custom Categories:</strong> {profileData.customcategories ? JSON.stringify(profileData.customcategories) : ""}
                </p>
                <p>
                  <strong>Bio:</strong> {profileData.bio}
                </p>
              </>
            )}
          </CardContent>
          <CardFooter>
            {isEditing ? (
              <div className="space-x-2">
                <Button onClick={updateProfile}>Save</Button>
                <Button variant="secondary" onClick={() => setIsEditing(false)}>
                  Cancel
                </Button>
              </div>
            ) : (
              <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
            )}
          </CardFooter>
        </Card>
      </main>
      <Footer />
    </div>
  );
};

export default ProfilePage;