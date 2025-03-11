// app/profile/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updatePasswordAction } from "@/app/actions"; // Import the new server action
import { useToast } from "@/components/ui/use-toast";
import { Eye, EyeOff } from "lucide-react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { supabaseClient } from "@/lib/supabase-client"; // Ensure Supabase client is imported

export default function ProfilePage() {
  const { user } = useAuth();

  // Define a type for the profile
  type Profile = {
    name?: string;
    username?: string;
    avatar_url?: string;
    website?: string;
    first_name?: string;
    last_name?: string;
    defaultprovider?: string;
    defaulttemperature?: string;
    bio?: string;
    // Add other profile properties here
  };

  const [profile, setProfile] = useState<Profile | null>(null);
  const [activeTab, setActiveTab] = useState('profile');
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: profileData, error: profileError } = await supabaseClient
        .from('profiles')
        .select('*')
        .eq('id', user?.id)
        .single();

      if (profileError) {
        console.error('Error fetching profile:', profileError);
      } else {
        setProfile(profileData);
      }
    };

    if (user) {
      fetchProfile();
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");

    try {
      const formData = new FormData(e.currentTarget as HTMLFormElement);
      formData.append("currentPassword", currentPassword);
      formData.append("newPassword", newPassword);
      formData.append("confirmNewPassword", confirmNewPassword);

      const result = await updatePasswordAction(formData);

      if (result?.error) {
        setMessage(result.error);
        toast({
          variant: "destructive",
          title: "Error",
          description: result.error,
        });
      }
      if (result?.message) {
        setMessage(result.message);
        toast({
          variant: "default",
          title: "Success",
          description: result.message,
        });
      }
    } catch (error: any) {
      setMessage(error.message || "An error occurred");
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "An unexpected error occurred",
      });
    } finally {
      setIsLoading(false);
      // Reset all values back to "".
      setNewPassword("");
      setConfirmNewPassword("");
      setCurrentPassword("");
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="container flex-1 mx-auto py-12 md:py-24 lg:py-32 px-4 md:px-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex justify-between mb-4">
            <button
              className={`px-4 py-2 ${activeTab === 'profile' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
              onClick={() => setActiveTab('profile')}
            >
              Profile Information
            </button>
            <button
              className={`px-4 py-2 ${activeTab === 'password' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
              onClick={() => setActiveTab('password')}
            >
              Change Password
            </button>
          </div>
          {activeTab === 'profile' && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Profile Information</h2>
              <table className="table-auto w-full">
                <tbody>
                  <tr>
                    <td className="border px-4 py-2 font-semibold">Name</td>
                    <td className="border px-4 py-2">{profile?.name || 'N/A'}</td>
                  </tr>
                  <tr>
                    <td className="border px-4 py-2 font-semibold">Email</td>
                    <td className="border px-4 py-2">{user?.email || 'N/A'}</td>
                  </tr>
                  <tr>
                    <td className="border px-4 py-2 font-semibold">Username</td>
                    <td className="border px-4 py-2">{profile?.username || 'N/A'}</td>
                  </tr>
                  <tr>
                    <td className="border px-4 py-2 font-semibold">Avatar URL</td>
                    <td className="border px-4 py-2">{profile?.avatar_url || 'N/A'}</td>
                  </tr>
                  <tr>
                    <td className="border px-4 py-2 font-semibold">Website</td>
                    <td className="border px-4 py-2">{profile?.website || 'N/A'}</td>
                  </tr>
                  <tr>
                    <td className="border px-4 py-2 font-semibold">First Name</td>
                    <td className="border px-4 py-2">{profile?.first_name || 'N/A'}</td>
                  </tr>
                  <tr>
                    <td className="border px-4 py-2 font-semibold">Last Name</td>
                    <td className="border px-4 py-2">{profile?.last_name || 'N/A'}</td>
                  </tr>
                  <tr>
                    <td className="border px-4 py-2 font-semibold">Default Provider</td>
                    <td className="border px-4 py-2">{profile?.defaultprovider || 'N/A'}</td>
                  </tr>
                  <tr>
                    <td className="border px-4 py-2 font-semibold">Default Temperature</td>
                    <td className="border px-4 py-2">{profile?.defaulttemperature || 'N/A'}</td>
                  </tr>
                  <tr>
                    <td className="border px-4 py-2 font-semibold">Bio</td>
                    <td className="border px-4 py-2">{profile?.bio || 'N/A'}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}
          {activeTab === 'password' && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Change Password</h2>
              <form onSubmit={handleSubmit}>
                <div className="mb-4 relative">
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <Input
                    id="currentPassword"
                    type={showCurrentPassword ? "text" : "password"}
                    placeholder="Current password"
                    required
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                  />
                  <div
                    className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  >
                    {showCurrentPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </div>
                </div>
                <div className="mb-4 relative">
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input
                    id="newPassword"
                    type={showNewPassword ? "text" : "password"}
                    placeholder="New password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                  <div
                    className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                  >
                    {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </div>
                </div>
                <div className="mb-4 relative">
                  <Label htmlFor="confirmNewPassword">Confirm New Password</Label>
                  <Input
                    id="confirmNewPassword"
                    type={showConfirmNewPassword ? "text" : "password"}
                    placeholder="Confirm new password"
                    required
                    value={confirmNewPassword}
                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                  />
                  <div
                    className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                    onClick={() => setShowConfirmNewPassword(!showConfirmNewPassword)}
                  >
                    {showConfirmNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </div>
                </div>
                <Button className="w-full" type="submit" disabled={isLoading}>
                  {isLoading ? "Changing password..." : "Change Password"}
                </Button>
                {message && <p className="mt-4 text-center text-sm text-muted-foreground">{message}</p>}
              </form>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}