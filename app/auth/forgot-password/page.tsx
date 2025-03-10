"use client";

import React, { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { forgotPasswordAction } from "@/app/actions";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const { toast } = useToast();

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        try {
            if (!isValidEmail(email)) {
                toast({
                    variant: "destructive",
                    title: "Error",
                    description: "Please enter a valid email address.",
                });
                return;
            }

            const formData = new FormData();
            formData.append("email", email);

            await forgotPasswordAction(formData);

            toast({
                title: "Success",
                description: "Check your email for a reset link.",
            });
        } catch (error: any) {
            toast({
                variant: "destructive",
                title: "Error",
                description: error.message || "An unexpected error occurred.",
            });
        }
    };

    return (
        <div className="flex min-h-screen flex-col items-center justify-center">
            <Card className="w-full max-w-md">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-bold">Forgot Password</CardTitle>
                    <CardDescription>Enter your email address and we'll send you a link to reset your password.</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid gap-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                name="email"
                                placeholder="Enter your email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                         {/* Place form controls inside of the card content */}
                         <Button>Reset Password</Button>
                    </form>
                </CardContent>
                
            </Card>
        </div>
    );
}

// Helper function for email validation (you can replace this with a Zod schema)
function isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}