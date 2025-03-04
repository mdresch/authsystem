"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { z, ZodError } from "zod"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Eye, EyeOff } from "lucide-react"
import { toast } from "@/components/ui/use-toast"

// Form validation schema
const resetPasswordSchema = z
  .object({
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(8, "Password must be at least 8 characters"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })

// Create a type from the schema
type ResetPasswordData = z.infer<typeof resetPasswordSchema>;

export default function ResetPasswordPage() {
  const router = useRouter()
  const { resetPassword } = useAuth()
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const searchParams = useSearchParams()

  useEffect(() => {
    // Check for the 'reset' query parameter
    const shouldReset = searchParams.get('reset');
    if (!shouldReset) {
      // If no reset, redirect to login
      router.push("/auth/login");
      return;
    }

    // Check for error details in the URL
    const urlParams = new URLSearchParams(window.location.hash.slice(1));
    const errorCode = urlParams.get('error_code');
    const errorDescription = urlParams.get('error_description');
    const token = urlParams.get('access_token');

    if (errorCode && errorCode === 'otp_expired') {
      setMessage("The password reset link has expired. Please request a new link.");
      toast({
        variant: "destructive",
        title: "Expired Link",
        description: "The password reset link has expired. Please request a new link.",
      });
      router.push("/auth/forgot-password");

    } else if (!token) {
      setMessage("Invalid or missing token. Please request a new password reset link.");
      toast({
        variant: "destructive",
        title: "Invalid Token",
        description: "Invalid or missing token. Please request a new password reset link.",
      });
      router.push("/auth/forgot-password");
    }
  }, [router, searchParams]);

  // Zod Validation Function
  const validateForm = (data: ResetPasswordData) => {
    try {
      resetPasswordSchema.parse(data);
      return null; // No errors
    } catch (error) {
      if (error instanceof ZodError) {
        return error.errors; // Return array of Zod errors
      }
      return [{ message: "An unexpected validation error occurred." }];
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage("")

    // Use Zod for validation
    const formData = { password: newPassword, confirmPassword: confirmPassword };
    const errors = validateForm(formData);

    if (errors) {
      // Display Zod validation errors
      const errorMessages = errors.map((err) => err.message).join("; ");
      setMessage(errorMessages);
      setIsLoading(false);
      return;
    }

    try {
      // Get token from URL
      const urlParams = new URLSearchParams(window.location.hash.slice(1));
      const token = urlParams.get('access_token');

      if (!token) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Token is missing",
        });
        return;
      }

      await resetPassword(token, newPassword);
      toast({
        title: "Success",
        description: "Password reset successfully! You can now log in.",
      });
      router.push("/auth/login");

    } catch (error: any) { // Type the error
      setMessage(error.message || "Error resetting password.");
      toast({
        variant: "destructive",
        title: "Password reset failed",
        description: error instanceof Error ? error.message : "An unknown error occurred",
      })
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold">Reset password</CardTitle>
            <CardDescription>Enter your new password below</CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <div className="relative">
                  <Input
                    id="newPassword"
                    type={showPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                    <span className="sr-only">{showPassword ? "Hide password" : "Show password"}</span>
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                    <span className="sr-only">{showConfirmPassword ? "Hide password" : "Show password"}</span>
                  </Button>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col">
              <Button className="w-full" type="submit" disabled={isLoading}>
                {isLoading ? "Resetting..." : "Reset Password"}
              </Button>
              {message && <p className="mt-4 text-center text-sm text-muted-foreground">{message}</p>}
              <p className="mt-4 text-center text-sm text-muted-foreground">
                Remember your password?{" "}
                <Link href="/auth/login" className="text-primary underline-offset-4 hover:underline">
                  Sign in
                </Link>
              </p>
            </CardFooter>
          </form>
        </Card>
      </main>
      <Footer />
    </div>
  )
}

