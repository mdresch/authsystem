"use client"

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { User, UserRound, Mail, Calendar, MapPin, Link as LinkIcon, Edit } from "lucide-react";

interface ProfileData {
  id: string;
  name?: string;
  email?: string;
  avatar_url?: string | null;
  bio?: string | null;
  website?: string | null;
  created_at?: string;
  first_name?: string;
  last_name?: string;
}

export default function ProfilePage() {
  const { user, isLoading: authLoading, getProfile } = useAuth();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        if (!user) {
          router.push("/auth/login");
          return;
        }

        setIsLoading(true);
        const profileData = await getProfile(user.id);
        console.log("Fetched profile data:", profileData);
        setProfile(profileData);
      } catch (error) {
        console.error("Error fetching profile:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load profile data. Please try again later.",
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (!authLoading) {
      fetchProfileData();
    }
  }, [user, authLoading, getProfile, router]);

  if (authLoading || isLoading) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-8">
          <div className="max-w-3xl mx-auto">
            <Skeleton className="h-12 w-1/3 mb-4" />
            <div className="flex items-center space-x-4 mb-6">
              <Skeleton className="h-20 w-20 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-6 w-40" />
                <Skeleton className="h-4 w-60" />
              </div>
            </div>
            <Skeleton className="h-32 mb-4" />
            <div className="space-y-2">
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-2/3" />
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!user) {
    router.push("/auth/login");
    return null;
  }

  const fullName = profile?.name || "User";
  const initials = fullName.charAt(0).toUpperCase();
  const displayName = profile?.first_name && profile?.last_name 
    ? `${profile.first_name} ${profile.last_name}` 
    : fullName;

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">Profile</h1>
            <Button variant="outline" size="sm" onClick={() => router.push("/profile/edit")}>
              <Edit className="h-4 w-4 mr-2" /> Edit Profile
            </Button>
          </div>

          <Card className="mb-6">
            <CardHeader className="flex flex-row items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={profile?.avatar_url || undefined} alt={fullName} />
                <AvatarFallback>{initials}</AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-2xl">{displayName}</CardTitle>
                <CardDescription>{user.email}</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              {profile?.bio && (
                <div className="mb-4">
                  <p className="text-muted-foreground">{profile.bio}</p>
                </div>
              )}
              
              <div className="space-y-3">
                <div className="flex items-center text-sm">
                  <UserRound className="mr-2 h-4 w-4 opacity-70" />
                  <span className="font-medium">Full name:</span>
                  <span className="ml-2">{displayName}</span>
                </div>
                
                <div className="flex items-center text-sm">
                  <Mail className="mr-2 h-4 w-4 opacity-70" />
                  <span className="font-medium">Email:</span>
                  <span className="ml-2">{user.email}</span>
                </div>
                
                {profile?.created_at && (
                  <div className="flex items-center text-sm">
                    <Calendar className="mr-2 h-4 w-4 opacity-70" />
                    <span className="font-medium">Member since:</span>
                    <span className="ml-2">{new Date(profile.created_at).toLocaleDateString()}</span>
                  </div>
                )}
                
                {profile?.website && (
                  <div className="flex items-center text-sm">
                    <LinkIcon className="mr-2 h-4 w-4 opacity-70" />
                    <span className="font-medium">Website:</span>
                    <a href={profile.website} target="_blank" rel="noopener noreferrer" 
                      className="ml-2 text-primary hover:underline truncate">
                      {profile.website}
                    </a>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}