"use client"

import type React from "react"

import { createContext, useContext, useState, useEffect } from "react"
import { supabase } from "./supabaseClient"
import { useToast } from "@/components/ui/use-toast"

type AuthContextType = {
  user: any | null
  loading: boolean
  register: (name: string, email: string, password: string) => Promise<void>
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  requestPasswordReset: (email: string) => Promise<string>
  resetPassword: (token: string, newPassword: string) => Promise<void>
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>
  getUser: (userId: string) => Promise<any>
  createProfile: (userId: string, fullName: string) => Promise<void>
  updateProfile: (userId: string, data: { fullName?: string; bio?: string; avatarUrl?: string | null; website?: string; firstName?: string; lastName?: string }) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any | null>(null)
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  // Check for saved user on mount
  useEffect(() => {
    const savedUser = localStorage.getItem("user")
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser))
      } catch (error) {
        console.error("Failed to parse saved user", error)
        localStorage.removeItem("user")
      }
    }
    setLoading(false)
  }, [])

  // Save user to localStorage when it changes
  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user))
    } else {
      localStorage.removeItem("user")
    }
  }, [user])

  const register = async (name: string, email: string, password: string) => {
    try {
      setLoading(true)
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      })

      if (error) throw error

      const user = data.user

      if (!user) {
        throw new Error("User creation failed, user is null.")
      }

      // Optionally, store additional user information in your database
      const { data: insertData, error: insertError } = await supabase
        .from('users') // Ensure this table exists in your Supabase project
        .insert([{ id: user.id, name }]) // Adjust according to your user structure

      if (insertError) throw insertError

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
      setLoading(false)
    }
  }

  const login = async (email: string, password: string) => {
    try {
      setLoading(true)
      const { data: { user: loggedInUser }, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error

      setUser(loggedInUser)
      toast({
        title: "Login successful",
        description: "Welcome back!",
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Login failed",
        description: error instanceof Error ? error.message : "An unknown error occurred",
      })
      throw error
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    setUser(null)
    toast({
      title: "Logged out",
      description: "You have been logged out successfully.",
    })
  }

  const requestPasswordReset = async (email: string): Promise<string> => {
    try {
      setLoading(true)
      const { error } = await supabase.auth.resetPasswordForEmail(email)

      if (error) throw error

      toast({
        title: "Password reset email sent",
        description: "Check your email for the reset link.",
      })

      return "Password reset email sent"
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Password reset failed",
        description: error instanceof Error ? error.message : "An unknown error occurred",
      })
      throw error
    } finally {
      setLoading(false)
    }
  }

  const resetPassword = async (token: string, newPassword: string) => {
    try {
      setLoading(true)
      const { error } = await supabase.auth.updateUser({ password: newPassword })

      if (error) throw error

      toast({
        title: "Password reset successful",
        description: "You can now log in with your new password.",
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Password reset failed",
        description: error instanceof Error ? error.message : "An unknown error occurred",
      })
      throw error
    } finally {
      setLoading(false)
    }
  }

  interface UpdateProfileData {
    fullName?: string;
    bio?: string;
    avatarUrl?: string | null;
    website?: string;
    firstName?: string;
    lastName?: string;
  }

  const updateProfile = async (userId: string, data: UpdateProfileData) => {
    const { error } = await supabase
      .from("profiles")
      .update({
        full_name: data.fullName,
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
      setLoading(true)
      const { error } = await supabase.auth.updateUser({ password: newPassword })

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
      setLoading(false)
    }
  }

  const getUser = async (userId: string): Promise<any> => {
    // Get the authenticated user
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error) {
      throw new Error(error.message);
    }

    // If you need to fetch additional profile data, do so from the profiles table
    const { data: profileData, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();

    if (profileError) {
      throw new Error(profileError.message);
    }

    return { ...user, profile: profileData }; // Return both user and profile data
  }

  const createProfile = async (userId: string, fullName: string) => {
    const { error } = await supabase
      .from("profiles")
      .insert([{ id: userId, full_name: fullName }]);

    if (error) {
      throw new Error(error.message);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        register,
        login,
        logout,
        requestPasswordReset,
        resetPassword,
        updateProfile,
        changePassword,
        getUser,
        createProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

