"use client"

import type React from "react"

import { createContext, useContext, useState, useEffect } from "react"
import { supabaseClient } from "./supabase-client"
import { useToast } from "@/components/ui/use-toast"
import { User } from '@supabase/supabase-js'

interface AuthContextProps {
  user: User | null
  isLoading: boolean
  signInWithEmail: (email: string, password: string) => Promise<void>
  signUpWithEmail: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
  register: (name: string, email: string, password: string) => Promise<void>
  requestPasswordReset: (email: string) => Promise<string>
  resetPassword: (token: string, newPassword: string) => Promise<void>
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>
  getProfile: (userId: string) => Promise<any>
  createProfile: (userId: string, name: string) => Promise<void> // Changed parameter name
  updateProfile: (userId: string, data: { fullName?: string; bio?: string; avatarUrl?: string | null; website?: string; firstName?: string; lastName?: string }) => Promise<void>
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    const { data: authListener } = supabaseClient.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null)
      setIsLoading(false)
    })

    return () => {
      authListener?.subscription.unsubscribe()
    }
  }, [])

  const register = async (name: string, email: string, password: string) => {
    try {
      setIsLoading(true)
      const { data, error } = await supabaseClient.auth.signUp({
        email,
        password,
      })

      if (error) throw error

      const user = data.user

      if (!user) {
        throw new Error("User creation failed, user is null.")
      }

      // Create the user's profile!
      await createProfile(user.id, name)

      setUser(user)
      toast({
        title: "Registration successful",
        description: "Please verify your email to continue.",
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Registration failed",
        description: error instanceof Error ? error.message : "An unknown error occurred",
      })
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const signInWithEmail = async (email: string, password: string) => {
    const { error } = await supabaseClient.auth.signInWithPassword({ email, password })
    if (error) {
      throw error
    }
  }

  const signUpWithEmail = async (email: string, password: string) => {
    const { error } = await supabaseClient.auth.signUp({ email, password })
    if (error) {
      throw error
    }
  }

  const signOut = async () => {
    await supabaseClient.auth.signOut()
  }
    const requestPasswordReset = async (email: string): Promise<string> => {
    try {
        setIsLoading(true);
        const redirectURL = `${window.location.origin}/auth/reset-password?reset=true`;
        console.log("Constructed redirectURL:", redirectURL); // Keep for debugging

        const { error } = await supabaseClient.auth.resetPasswordForEmail(
        email,
        {
            redirectTo: redirectURL,
        }
        );
        console.log("Supabase response error:", error); // Log any Supabase error

        if (error) throw error;

        toast({
        title: "Password reset email sent",
        description: "Check your email for the reset link.",
        });

        return "Password reset email sent";
    } catch (error) {
        console.error("requestPasswordReset error:", error); // Log full error
        toast({
        variant: "destructive",
        title: "Password reset failed",
        description:
            error instanceof Error ? error.message : "An unknown error occurred",
        });
        throw error;
    } finally {
        setIsLoading(false);
    }
    };

  const resetPassword = async (token: string, newPassword: string) => {
    const { error } = await supabaseClient.auth.updateUser({
      password: newPassword,
    });
    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Error resetting password.",
      });
      throw error;
    }
  }
    interface UpdateProfileData {
        fullName?: string; // Keep this as fullName
        bio?: string;
        avatarUrl?: string | null;
        website?: string;
        firstName?: string;
        lastName?: string;
    }

  const updateProfile = async (userId: string, data: UpdateProfileData) => {
    const { error } = await supabaseClient
      .from("profiles")
      .update({
        name: data.fullName, // Use 'name' here too
        bio: data.bio,
        avatar_url: data.avatarUrl || null,
        website: data.website,
        first_name: data.firstName,
        last_name: data.lastName,
      })
      .eq("id", userId);

    if (error) {
      throw new Error(error.message);
    }
  }


  const changePassword = async (currentPassword: string, newPassword: string) => {
    if (!user) throw new Error("Not authenticated")

    try {
      setIsLoading(true)
      const { error } = await supabaseClient.auth.updateUser({ password: newPassword })

      if (error) throw error

      toast({
        title: "Password changed",
        description: "Your password has been changed successfully.",
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Password change failed",
        description: error instanceof Error ? error.message : "An unknown error occurred",
      })
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const getProfile = async (userId: string): Promise<any> => {
    const { data: profileData, error: profileError } = await supabaseClient
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();

    if (profileError) {
      throw new Error(profileError.message);
    }
    return profileData; // Return only the profile data
  };

    const createProfile = async (userId: string, name: string) => { // Changed parameter name
    console.log("createProfile - userId:", userId);
    console.log("createProfile - name:", name); // Changed log
    const { error, data } = await supabaseClient
        .from("profiles")
        .insert([
        {
            id: userId,
            name: name, // Corrected: Use 'name'
        },
        ]);
    console.log("createProfile - Supabase response data:", data);
    console.log("createProfile - Supabase response error:", error);


    if (error) {
        throw new Error(error.message);
    }
    };

  const value = {
    user,
    isLoading,
    signInWithEmail,
    signUpWithEmail,
    signOut,
    register,
    requestPasswordReset,
    resetPassword,
    updateProfile,
    changePassword,
    getProfile,
    createProfile,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}