"use client"

import Link from "next/link"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { CheckCircle2 } from "lucide-react"

export default function VerifyPage() {
  const { user } = useAuth()

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold">Verify your email</CardTitle>
            <CardDescription>We've sent a verification link to your email address</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col items-center justify-center space-y-3 text-center">
              <div className="rounded-full bg-primary/10 p-3">
                <CheckCircle2 className="h-6 w-6 text-primary" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium">{user ? user.email : "your email address"}</p>
                <p className="text-sm text-muted-foreground">
                  Please check your email and click on the verification link to continue
                </p>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col">
            <Button asChild className="w-full">
              <Link href="/dashboard">Continue to dashboard</Link>
            </Button>
            <p className="mt-4 text-center text-sm text-muted-foreground">
              Didn't receive an email?{" "}
              <Link href="#" className="text-primary underline-offset-4 hover:underline">
                Resend verification email
              </Link>
            </p>
          </CardFooter>
        </Card>
      </main>
      <Footer />
    </div>
  )
}

