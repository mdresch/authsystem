"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "./mode-toggle"
import { useAuth } from "@/lib/auth-context"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { User, LogOut, Settings, MessageSquare } from "lucide-react"

export function Header() {
  const { user, signOut } = useAuth()
  const pathname = usePathname()

  return (
    <header className="w-full border-b">
      <div className="container flex h-16 items-center justify-between mx-auto">
        <div className="flex items-center gap-6">
          <Link href="/" className="text-xl font-bold">
            Auth System
          </Link>
          <nav className="hidden md:flex gap-6">
            <Link href="/" className={`text-sm ${pathname === "/" ? "font-medium" : "text-muted-foreground"}`}>
              Home
            </Link>
            {user && (
              <>
                <Link
                  href="/dashboard"
                  className={`text-sm ${pathname === "/dashboard" ? "font-medium" : "text-muted-foreground"}`}
                >
                  Dashboard
                </Link>
                <Link
                  href="/chat"
                  className={`text-sm ${pathname === "/chat" ? "font-medium" : "text-muted-foreground"}`}
                >
                  AI Chat
                </Link>
              </>
            )}
            <Link
              href="/about"
              className={`text-sm ${pathname === "/about" ? "font-medium" : "text-muted-foreground"}`}
            >
              About
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <ModeToggle />
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                  <User className="h-4 w-4" />
                  {user.email}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link href="/profile" className="cursor-pointer flex items-center gap-2">
                    <Settings className="h-4 w-4" />
                    <span>Profile</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/chat" className="cursor-pointer flex items-center gap-2">
                    <MessageSquare className="h-4 w-4" />
                    <span>AI Chat</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={async () => await signOut()}
                  className="cursor-pointer flex items-center gap-2"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/auth/login">Sign in</Link>
              </Button>
              <Button size="sm" asChild>
                <Link href="/auth/register">Sign up</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

