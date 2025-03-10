// app/actions.ts (CORRECT - Calling createSupabaseServerClient correctly)
"use server";

import { createSupabaseServerClient } from "@/lib/supabase-server";
import { headers } from "next/headers";
// import { redirect } from 'next/navigation'; // Only if you use redirect
// import { cookies } from "next/headers";     // No need to import here
import { revalidatePath } from 'next/cache';
import { AuthError } from '@supabase/supabase-js'; // Import AuthError type
import { z } from "zod";

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

// app/actions.ts

// Define a schema for validation
const forgotPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

// Derive the type from the Zod schema
type ForgotPasswordData = z.infer<typeof forgotPasswordSchema>;

// Server Action for Forgot Password
export async function forgotPasswordAction(
  formData: FormData,
): Promise<{ message?: string; error?: string }> {
  try {
    // 1. Validate the form data
    const email = formData.get("email") as string;
    const result = forgotPasswordSchema.safeParse({ email });

    if (!result.success) {
      // Validation failed; return Zod errors
      const errorMessages = result.error.errors
        .map((err) => err.message)
        .join("; ");
      return { error: errorMessages };
    }

    // 2. Get the email from the validated data
    const { email: validatedEmail } = result.data;

    // 3. Create the Supabase client
    const supabase = await createSupabaseServerClient();

    // 4. Get the origin from the request headers
    const origin = (await headers()).get("origin");

    // 5. Send the password reset email
    const { error: passwordlessError } = await supabase.auth.resetPasswordForEmail(
      validatedEmail,
      {
        redirectTo: `${origin}/auth/callback?redirect_to=/auth/reset-password`,
      },
    );

    if (passwordlessError) {
      console.error("Password reset error:", passwordlessError);

      if (passwordlessError instanceof AuthError) {
        return { error: passwordlessError.message }; // Specific error message
      } else {
        return { error: "An unexpected error occurred." }; // Generic error
      }
    }

    // 6. Revalidate the cache (not strictly necessary here)
    revalidatePath("/auth/login");
    revalidatePath("/auth/reset-password");

    // 7. Return a success message
    return { message: "Check your email for the reset link." };
  } catch (error: any) {
    // Generic Error to catch (AuthError doesn't have all possibilities)
    console.error("General error resetting password:", error);
    return { error: "Failed to initiate password reset." };
  }
}

// app/actions.ts

// Server Action for Update Password
//Update
export async function updatePasswordAction(formData: FormData) {
const currentPassword = formData.get("currentPassword") as string
const newPassword = formData.get("newPassword") as string
const confirmNewPassword = formData.get("confirmNewPassword") as string

if (newPassword !== confirmNewPassword) {
    return {
        error: "New password and confirmation password do not match.",
    }
}

if (!newPassword || !confirmNewPassword) {
    return { error: "Please fill up all values to continue." }
}

const supabase = await createSupabaseServerClient()
try {
    const { data: { user }, error } = await supabase.auth.getUser()

    if (error) {
        console.log('Error getting user in actions', error);
        return { error: error.message }
    }
        //update function
    const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword,
    })

        if (updateError) {
            console.log('Error Update Pass', updateError);

            if (updateError instanceof AuthError) {
                return { error: updateError.message }; // Specific error message
            } else {
                return { error: "An unexpected error occurred. " }; // Generic error
            }
        }

    // revalidate the cache for the protected routes
    revalidatePath('/profile');

    //success
    return { message: "Password updated successfully!." }

} catch (error: any) {
    console.log("General error resetting password:", error)
    return { error: error.message || "Something went wrong during password update. " }
};
}
// app/actions.ts