"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { z } from "zod"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { toast } from "@/components/ui/use-toast"

// Form validation schema
const forgotPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
})

export default function ForgotPasswordPage() {
  const { requestPasswordReset } = useAuth()
  const [email, setEmail] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [resetToken, setResetToken] = useState<string | null>(null)
  const [message, setMessage] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    setMessage("")

    try {
      // Validate email
      const validatedData = forgotPasswordSchema.parse({ email })

      // Request password reset
      await requestPasswordReset(validatedData.email, {
        redirectTo: "http://localhost:3001/auth/reset-password", // Change to your actual URL
      })

      // In a real app, this token would be sent via email
      // For demo purposes, we'll store it to use in the UI
      setResetToken(token)
      setIsSubmitted(true)
      setMessage("Password reset email sent. Please check your inbox.")
      toast({
        title: "Password reset email sent",
        description: "Check your email for the reset link.",
      })
    } catch (error) {
      if (error instanceof z.ZodError) {
        setError(error.errors[0].message)
      }
      setMessage("Error sending password reset email.")
      // API errors are handled by the auth context
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold">Forgot password</CardTitle>
            <CardDescription>Enter your email address and we'll send you a link to reset your password</CardDescription>
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
                      setEmail(e.target.value)
                      setError("")
                    }}
                    disabled={isLoading}
                    required
                  />
                  {error && <p className="text-sm text-destructive">{error}</p>}
                </div>
              </CardContent>
              <CardFooter className="flex flex-col">
                <Button className="w-full" type="submit" disabled={isLoading}>
                  {isLoading ? "Sending reset link..." : "Send reset link"}
                </Button>
                <p className="mt-4 text-center text-sm text-muted-foreground">
                  Remember your password?{" "}
                  <Link href="/auth/login" className="text-primary underline-offset-4 hover:underline">
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
                    <svg className="h-5 w-5 text-green-400 dark:text-green-500" viewBox="0 0 20 20" fill="currentColor">
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-green-800 dark:text-green-200">Reset link sent</h3>
                    <div className="mt-2 text-sm text-green-700 dark:text-green-300">
                      <p>{message}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* For demo purposes only - in a real app this would be sent via email */}
              <div className="rounded-md bg-muted p-4 text-sm">
                <p className="font-medium">Demo Mode:</p>
                <p className="mt-1">
                  In a real application, the reset link would be sent to your email. For this demo, you can use this
                  link:
                </p>
                <Link href={`/auth/reset-password/${resetToken}`} className="mt-2 block text-primary underline">
                  Reset your password
                </Link>
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
  )
}

