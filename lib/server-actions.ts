"use server";

import { createSupabaseServerClient } from "../supabase-server";
import { cookies } from 'next/headers';
import { createClient } from '@supabase/supabase-js'

// Create a Supabase client with the service role key that bypasses RLS
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!, // You need to add this to your environment variables
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
)

export const getSession = async () => {
  const supabase = createSupabaseServerClient();
  return await supabase.auth.getSession();
};

export const loginUser = async (email: string, password: string) => {
  const supabase = createSupabaseServerClient();
  
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) throw error;
    
    // Return the session and user data
    return {
      success: true,
      session: data.session,
      user: data.user
    };
  } catch (error: any) {
    console.error("Login error:", error);
    return { 
      success: false, 
      error: error.message || "Authentication failed" 
    };
  }
};

export const logoutUser = async () => {
  const supabase = createSupabaseServerClient();
  
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    return { success: true };
  } catch (error: any) {
    console.error("Logout error:", error);
    return { 
      success: false, 
      error: error.message || "Logout failed" 
    };
  }
};

export const createUserProfile = async (userId: string, name: string) => {
  try {
    console.log("Server action: Creating profile for user ID:", userId);
    
    const { error, data } = await supabaseAdmin
      .from("profiles")
      .insert([
        {
          id: userId,
          name: name,
        },
      ]);
      
    console.log("Profile creation response data:", data);
    
    if (error) {
      console.error("Error creating profile:", error);
      throw error;
    }
    
    return { success: true };
  } catch (error: any) {
    console.error("Profile creation failed:", error);
    return { 
      success: false, 
      error: error.message 
    };
  }
};
