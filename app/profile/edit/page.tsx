"use client"

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { z } from "zod";
import { Loader2 } from "lucide-react";

const profileSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters"),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  bio: z.string().optional(),
  website: z.string().url("Please enter a valid URL").or(z.string().length(0)).optional(),
  avatarUrl: z.string().url("Please enter a valid URL").or(z.string().length(0)).optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

export default function EditProfilePage() {
  const { user, isLoading: authLoading, getProfile, updateProfile } = useAuth();
  const [formData, setFormData] = useState<ProfileFormData>({
    fullName: "",
    firstName: "",
    lastName: "",
    bio: "",
    website: "",
    avatarUrl: "",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState<Partial<ProfileFormData>>({});
  const router = useRouter();

  useEffect(() => {
    const loadProfileData = async () => {
      try {
        if (!user) {
          router.push("/auth/login");
          return;
        }

        setIsLoading(true);
        const profile = await getProfile(user.id);
        
        setFormData({
          fullName: profile?.name || "",
          firstName: profile?.first_name || "",
          lastName: profile?.last_name || "",
          bio: profile?.bio || "",
          website: profile?.website || "",
          avatarUrl: profile?.avatar_url || "",
        });
      } catch (error) {
        console.error("Error loading profile:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load profile data. Please try again.",
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (!authLoading) {
      loadProfileData();
    }
  }, [user, authLoading, getProfile, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setIsSaving(true);
      setErrors({});
      
      // Validate form
      profileSchema.parse(formData);
      
      if (!user) {
        throw new Error("User not authenticated");
      }
      
      // Update profile
      await updateProfile(user.id, {
        fullName: formData.fullName,
        firstName: formData.firstName,
        lastName: formData.lastName,
        bio: formData.bio,
        website: formData.website,
        avatarUrl: formData.avatarUrl,
      });
      
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      });
      
      router.push("/profile");
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Partial<ProfileFormData> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            newErrors[err.path[0] as keyof ProfileFormData] = err.message;
          }
        });
        setErrors(newErrors);
      } else {
        console.error("Profile update error:", error);
        toast({
          variant: "destructive",
          title: "Update failed",
          description: error instanceof Error ? error.message : "Failed to update profile",
        });
      }
    } finally {
      setIsSaving(false);
    }
  };

  if (authLoading || isLoading) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-8 flex items-center justify-center">
          <div className="flex items-center space-x-2">
            <Loader2 className="h-6 w-6 animate-spin" />
            <p>Loading profile...</p>
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

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Edit Profile</h1>
          
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>Update your personal information</CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="Your full name"
                  />
                  {errors.fullName && <p className="text-sm text-destructive">{errors.fullName}</p>}
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      placeholder="First name"
                    />
                    {errors.firstName && <p className="text-sm text-destructive">{errors.firstName}</p>}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      placeholder="Last name"
                    />
                    {errors.lastName && <p className="text-sm text-destructive">{errors.lastName}</p>}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    placeholder="Tell us about yourself"
                    className="min-h-[100px]"
                  />
                  {errors.bio && <p className="text-sm text-destructive">{errors.bio}</p>}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    name="website"
                    value={formData.website}
                    onChange={handleChange}
                    placeholder="https://example.com"
                  />
                  {errors.website && <p className="text-sm text-destructive">{errors.website}</p>}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="avatarUrl">Avatar URL</Label>
                  <Input
                    id="avatarUrl"
                    name="avatarUrl"
                    value={formData.avatarUrl}
                    onChange={handleChange}
                    placeholder="https://example.com/avatar.jpg"
                  />
                  {errors.avatarUrl && <p className="text-sm text-destructive">{errors.avatarUrl}</p>}
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button type="button" variant="outline" onClick={() => router.push("/profile")}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isSaving}>
                  {isSaving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
