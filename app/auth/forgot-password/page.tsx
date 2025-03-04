"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { z } from "zod"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { toast } from "@/components/ui/use-toast"

// Form validation schema
const forgotPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
})

type ForgotPasswordData = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const { requestPasswordReset } = useAuth()
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [message, setMessage] = useState("")

  const validateForm = (data: ForgotPasswordData) => {
    try {
      forgotPasswordSchema.parse(data);
      return null; // No errors
    } catch (error) {
      if (error instanceof z.ZodError) {
        return error.errors; // Array of ZodError issues
      }
      return [{ message: 'An unexpected error occurred.' }];
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");

    const formData = { email: email }
    const errors = validateForm(formData);

    if (errors) {
      // Display Zod validation errors
      const errorMessages = errors.map((err) => err.message).join("; ");
      setMessage(errorMessages);
      setIsLoading(false);
      return;
    }

    try {
      // Request password reset (no second argument!)
      await requestPasswordReset(email);
      setIsSubmitted(true);
      setMessage("Password reset email sent. Please check your inbox.");
      toast({
        title: "Password reset email sent",
        description: "Check your email for the reset link.",
      });
    } catch (error: any) { // Type the error
      setMessage(error.message || "Error sending password reset email."); // Better error message
      toast({
        variant: "destructive",
        title: "Password reset failed",
        description: error instanceof Error ? error.message : "An unknown error occurred",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold">
              Forgot password
            </CardTitle>
            <CardDescription>
              Enter your email address and we'll send you a link to reset your
              password
            </CardDescription>
          </CardHeader>
          {!isSubmitted ? (
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="m@example.com"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setMessage(""); // Clear previous messages
                    }}
                    disabled={isLoading}
                    required
                  />
                  {/* Display specific Zod error message */}
                  {message && (
                    <p className="text-sm text-destructive">{message}</p>
                  )}
                </div>
              </CardContent>
              <CardFooter className="flex flex-col">
                <Button className="w-full" type="submit" disabled={isLoading}>
                  {isLoading ? "Sending reset link..." : "Send reset link"}
                </Button>
                <p className="mt-4 text-center text-sm text-muted-foreground">
                  Remember your password?{" "}
                  <Link
                    href="/auth/login"
                    className="text-primary underline-offset-4 hover:underline"
                  >
                    Sign in
                  </Link>
                </p>
              </CardFooter>
            </form>
          ) : (
            <CardContent className="space-y-4">
              <div className="rounded-md bg-green-50 p-4 dark:bg-green-900/20">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg
                      className="h-5 w-5 text-green-400 dark:text-green-500"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-green-800 dark:text-green-200">
                      Reset link sent
                    </h3>
                    <div className="mt-2 text-sm text-green-700 dark:text-green-300">
                      <p>{message}</p>
                    </div>
                  </div>
                </div>
              </div>
              <Button asChild className="w-full mt-4">
                <Link href="/auth/login">Return to login</Link>
              </Button>
            </CardContent>
          )}
        </Card>
      </main>
      <Footer />
    </div>
  );
}

