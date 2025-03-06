// app/actions.ts (CORRECT - Calling createSupabaseServerClient correctly)
"use server";

import { createSupabaseServerClient } from "@/lib/supabase-server";
import { headers } from "next/headers";
// import { redirect } from 'next/navigation'; // Only if you use redirect
// import { cookies } from "next/headers";     // No need to import here

export async function requestPasswordReset(email: string): Promise<string> {
  const supabase = await createSupabaseServerClient(); // Await the client creation
  
  // Await the headers to get the actual headers object
  const origin = (await headers()).get("origin");
  const callbackURL = `${origin}/auth/callback?redirect_to=/auth/reset-password`;

  const { error } = await supabase.auth.resetPasswordForEmail(
    email,
    {
      redirectTo: callbackURL,
    }
  );

  if (error) {
    console.error("requestPasswordReset error:", error);
    throw error; // Re-throw to be handled by the client
    // Or, redirect for error handling:
    // redirect(`/error?message=${encodeURIComponent(error.message)}`);
  }
  return "Password reset email sent";
}