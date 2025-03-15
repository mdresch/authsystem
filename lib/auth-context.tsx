"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { supabaseClient } from "./supabase-client"
import { User } from '@supabase/supabase-js'
import { useToast } from "@/components/ui/use-toast"
import { getSession, createUserProfile } from "./server-actions"

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
  createProfile: (userId: string, name: string) => Promise<void>
  updateProfile: (userId: string, data: { fullName?: string; bio?: string; avatarUrl?: string | null; website?: string; firstName?: string; lastName?: string }) => Promise<void>
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const loadUser = async () => {
      setIsLoading(true);
      try {
        const sessionData = await getSession();
        if (sessionData?.data?.session?.user) {
          setUser(sessionData.data.session.user);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("Error loading user:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();

    const { data: authListener } = supabaseClient.auth.onAuthStateChange(async (_event, session) => {
      setUser(session?.user || null)
      setIsLoading(false)
    })

    return () => {
      authListener?.subscription.unsubscribe()
    }
  }, [])

  const register = async (name: string, email: string, password: string) => {
    try {
      setIsLoading(true);
      console.log("Registering user with email:", email);
      
      const { data, error } = await supabaseClient.auth.signUp({
        email,
        password,
      });
      
      if (error) {
        console.error("Supabase signup error:", error);
        throw error;
      }
      
      const user = data.user;
      
      if (!user) {
        console.error("User creation failed, user is null.");
        throw new Error("User creation failed, user is null.");
      }
      
      // Create the user's profile using server action with admin privileges
      console.log("Creating profile for user ID:", user.id);
      const profileResult = await createUserProfile(user.id, name);
      
      if (!profileResult.success) {
        console.error("Profile creation failed:", profileResult.error);
        throw new Error(profileResult.error || "Failed to create profile");
      }
      
      setUser(user);
      toast({
        title: "Registration successful",
        description: "Please verify your email to continue.",
      });
    } catch (error) {
      console.error("Registration failed:", error);
      toast({
        variant: "destructive",
        title: "Registration failed",
        description: error instanceof Error ? error.message : "An unknown error occurred",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signInWithEmail = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      console.log("Attempting to sign in with email:", email);
      
      const { error } = await supabaseClient.auth.signInWithPassword({ 
        email, 
        password 
      });
      
      if (error) {
        console.error("Sign-in error:", error);
        throw error;
      }
      
      console.log("Sign-in successful");
    } catch (error) {
      console.error("Sign-in failed:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signUpWithEmail = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const { error } = await supabaseClient.auth.signUp({ email, password });
      if (error) {
        throw error;
      }
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setIsLoading(true);
      await supabaseClient.auth.signOut();
      setUser(null);
    } catch (error) {
      console.error("Error signing out:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const resetPassword = async (token: string, newPassword: string) => {
    try {
      setIsLoading(true);
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
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  interface UpdateProfileData {
    fullName?: string;
    bio?: string;
    avatarUrl?: string | null;
    website?: string;
    firstName?: string;
    lastName?: string;
  }

  const updateProfile = async (userId: string, data: UpdateProfileData) => {
    try {
      setIsLoading(true);
      const { error } = await supabaseClient
        .from("profiles")
        .update({
          name: data.fullName,
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
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const changePassword = async (currentPassword: string, newPassword: string) => {
    if (!user) throw new Error("Not authenticated");

    try {
      setIsLoading(true);
      const { error } = await supabaseClient.auth.updateUser({ password: newPassword });

      if (error) throw error;

      toast({
        title: "Password changed",
        description: "Your password has been changed successfully.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Password change failed",
        description: error instanceof Error ? error.message : "An unknown error occurred",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const requestPasswordReset = async (email: string): Promise<string> => {
    try {
      const { data, error } = await supabaseClient.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/update-password`,
      });

      if (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: error.message || "Could not reset password.",
        });
        throw error;
      }

      toast({
        title: "Password reset email sent",
        description: "Please check your email to reset your password.",
      });

      return "Password reset email sent successfully.";
    } catch (error) {
      console.error("Password reset error:", error);
      throw error;
    }
  };

  const getProfile = async (userId: string): Promise<any> => {
    try {
      const { data: profileData, error: profileError } = await supabaseClient
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (profileError) {
        throw new Error(profileError.message);
      }
      return profileData;
    } catch (error) {
      throw error;
    }
  };

  const createProfile = async (userId: string, name: string) => {
    console.log("createProfile - userId:", userId);
    console.log("createProfile - name:", name);
    
    try {
      const { error, data } = await supabaseClient
        .from("profiles")
        .insert([
          {
            id: userId,
            name: name,
          },
        ]);
        
      console.log("createProfile - Supabase response data:", data);
      console.log("createProfile - Supabase response error:", error);

      if (error) {
        throw new Error(error.message);
      }
    } catch (error) {
      console.error("Error creating profile:", error);
      throw error;
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
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
