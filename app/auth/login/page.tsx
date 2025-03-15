"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Link from "next/link"
import { redirect, useRouter } from "next/navigation"
import { z } from "zod"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Eye, EyeOff } from "lucide-react"
import { FaGithub } from 'react-icons/fa';
import { toast } from "@/components/ui/use-toast"
import { supabaseClient } from "@/lib/supabase-client" // Use client-side Supabase client
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"

// Form validation schema
const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
})

type LoginData = z.infer<typeof loginSchema>

async function signInWithGithub() {
  const { data, error } = await supabaseClient.auth.signInWithOAuth({
    provider: "github",
  })

  if (data.url) {
    redirect(data.url) // use the redirect API for your server framework
  } else if (error) {
    toast({
      variant: "destructive",
      title: "Error",
      description: error.message || "An error occurred during GitHub sign-in",
    })
  }
}

export default function LoginPage() {
  const router = useRouter()
  const { signInWithEmail } = useAuth()
  const [formData, setFormData] = useState<LoginData>({ email: "", password: "" })
  const [errors, setErrors] = useState<Partial<LoginData>>({})
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showSuccessDialog, setShowSuccessDialog] = useState(false)

  useEffect(() => {
    // Parse the URL hash for error details
    const params = new URLSearchParams(window.location.hash.slice(1));
    const errorCode = params.get('error_code');
    const errorDescription = params.get('error_description');

    if (errorCode && errorCode.startsWith('4')) {
      toast({
        variant: "destructive",
        title: "Error",
        description: errorDescription || 'An error occurred',
      });
    }
  }, [router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    // Clear error when user types
    setErrors((prev) => ({ ...prev, [name]: undefined }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setErrors({}) // Clear previous errors

    try {
      // Validate form data
      loginSchema.parse(formData)

      console.log("Form validation passed, attempting login");
      
      // Attempt login
      await signInWithEmail(formData.email, formData.password)
      console.log("Login successful, showing success dialog");

      // Show success dialog
      setShowSuccessDialog(true)
    } catch (error: any) {
      console.error("Login error:", error);
      
      if (error instanceof z.ZodError) {
        // Handle validation errors (simplified)
        const newErrors: Partial<LoginData> = {}
        error.errors.forEach((err) => {
          if (err.path[0]) {
            newErrors[err.path[0] as keyof LoginData] = err.message
          }
        })
        setErrors(newErrors)
      } else {
        // Handle API errors (e.g., incorrect credentials)
        toast({
          variant: "destructive",
          title: "Login Failed",
          description: error.message || "Invalid email or password.",
        })
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleDialogConfirm = () => {
    setShowSuccessDialog(false)
    router.push("/dashboard")
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold">Sign in</CardTitle>
            <CardDescription>Enter your email and password to sign in to your account</CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="m@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={isLoading}
                  required
                  autoComplete="username"
                  className="truncate"
                />
                {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Link
                    href="/auth/forgot-password"
                    className="text-sm text-primary underline-offset-4 hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={handleChange}
                    disabled={isLoading}
                    required
                    autoComplete="current-password"
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
                {errors.password && <p className="text-sm text-destructive">{errors.password}</p>}
              </div>
            </CardContent>
            <CardFooter className="flex flex-col">
              <Button className="w-full" type="submit" disabled={isLoading}>
                {isLoading ? "Signing in..." : "Sign in"}
              </Button>
              <Button className="w-full mt-2 flex items-center justify-center" type="button" onClick={signInWithGithub} disabled={isLoading}>
                <FaGithub className="mr-2 h-4 w-4" />
                {isLoading ? "Signing in with GitHub..." : "Sign in with GitHub"}
              </Button>
              <p className="mt-4 text-center text-sm text-muted-foreground">
                Don&apos;t have an account?{" "}
                <Link href="/auth/register" className="text-primary underline-offset-4 hover:underline">
                  Sign up
                </Link>
              </p>
            </CardFooter>
          </form>
        </Card>
      </main>
      <Footer />

      {showSuccessDialog && (
        <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Login Successful</DialogTitle>
            </DialogHeader>
            <p>You have successfully logged in.</p>
            <DialogFooter>
              <Button onClick={handleDialogConfirm}>OK</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}

