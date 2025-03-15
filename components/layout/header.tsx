"use client";
import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "./mode-toggle";
import { useAuth } from "@/lib/auth-context";
import {
  NeumorphicDropdownMenu,
  NeumorphicDropdownMenuTrigger,
  NeumorphicDropdownMenuContent,
  NeumorphicDropdownMenuItem,
  NeumorphicDropdownMenuSeparator,
} from "@/components/layout/neumorphicdropdownmenu";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuContent,
  NavigationMenuLink,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "../ui/navigation-menu";
import {
  Menu,
  Database,
  Wand2,
  Workflow,
  BarChart4,
  BookOpen,
  User,
  LogOut,
  Settings,
  MessageSquare,
} from "lucide-react";

interface ListItemProps {
  href: string;
  title: string;
  children?: React.ReactNode;
}

const components: { title: string; href: string; description: string }[] = [
  {
    title: "AI Agent Builder",
    href: "/ai-tools/ai-agent-builder",
    description:
      "A page where users can create and customize their own AI agents with specific instructions and capabilities.",
  },
  {
    title: "AI Learning Center",
    href: "/ai-tools/ai-learning-center",
    description:
      "A page with tutorials, guides, and best practices for using AI effectively.",
  },
  {
    title: "AI Model Comparison",
    href: "/ai-tools/ai-model-comparison",
    description:
      "A page that allows users to compare responses from different AI models for the same prompt.",
  },
  {
    title: "AI Playground",
    href: "/ai-tools/ai-playground",
    description:
      "A sandbox environment where users can experiment with different AI models, parameters, and prompts.",
  },
  {
    title: "AI Workflows Builder",
    href: "/ai-tools/ai-workflows-builder",
    description:
      "A page where users can create automated workflows that combine AI with other actions.",
  },
  {
    title: "Chat",
    href: "/chat",
    description:
      "A message interface that allows users to interact with the AI agent.",
  },
  {
    title: "Conversation Analysis",
    href: "/ai-tools/ai-conversation-analitics",
    description:
      "A page that provides insights into user-AI interactions, showing patterns, common topics, and usage statistics.",
  },
  {
    title: "Dashboard",
    href: "/ai-tools/dashboard",
    description:
      "A page that displays an overview of AI performance, usage statistics, and other relevant data.",
  },
  {
    title: "Knowledge Base",
    href: "/ai-tools/ai-knowledge-base",
    description:
      "A page that allows users to connect and manage external knowledge sources for the AI to reference.",
  },
  {
    title: "Prompt Library",
    href: "/ai-tools/ai-prompt-library",
    description:
      "A page where users can browse, save, and create prompts for different use cases.",
  },
  {
    title: "Settings",
    href: "/ai-tools/settings",
    description: "Settings with more AI-specific configurations",
  },
];

function ListItem({ href, title, children }: ListItemProps) {
  return (
    <li>
      <NavigationMenuLink asChild>
        <Link
          href={href}
          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </Link>
      </NavigationMenuLink>
    </li>
  );
}

export function Header() {
  const { user, signOut } = useAuth();
  const pathname = usePathname();

  return (
    <header className="border-b">
      <div className="container flex h-16 items-center justify-between mx-auto">
        <div className="flex items-center gap-6">
          <Link href="/" className="text-xl font-bold">
            Auth System
          </Link>
          <nav className="hidden md:flex gap-6">
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger>Getting started</NavigationMenuTrigger>

                  <NavigationMenuContent>
                    <ul className="grid gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                      <li>
                        <NavigationMenuLink asChild>
                          <a
                            className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                            href="/"
                          >
                            <div className="mb-2 mt-4 text-lg font-medium">
                              Auth/System
                            </div>
                            <p className="text-sm leading-tight text-muted-foreground">
                              Beautifully designed components built for Auth
                              System UI.
                            </p>
                          </a>
                        </NavigationMenuLink>
                      </li>
                      <ListItem href="/" title="Home">
                        Re-usable components built these pages.
                      </ListItem>
                      <ListItem
                        href="https://cba-auth.hashnode.space/introduction-auth-system/getting-started"
                        title="Installation"
                      >
                        How to install dependencies and structure your app.
                      </ListItem>
                      <ListItem href="/about" title="About">
                        This is a comprehensive authentication system built with
                        Next.js and shadcn/ui.
                      </ListItem>
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
                
                {user && (
                  <>
                    <NavigationMenuItem>
                      <NavigationMenuTrigger>AI</NavigationMenuTrigger>
                      <NavigationMenuContent>
                        <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
                          {components.map((component) => (
                            <ListItem
                              key={component.title}
                              title={component.title}
                              href={component.href}
                            >
                              {component.description}
                            </ListItem>
                          ))}
                        </ul>
                      </NavigationMenuContent>
                    </NavigationMenuItem>
                    <NavigationMenuItem>
                      <Link
                        href="https://cba-auth.hashnode.space/"
                        legacyBehavior
                        passHref
                      >
                        <NavigationMenuLink
                          className={navigationMenuTriggerStyle()}
                        >
                          Documentation
                        </NavigationMenuLink>
                      </Link>
                    </NavigationMenuItem>
                  </>
                )}
              </NavigationMenuList>
            </NavigationMenu>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <ModeToggle />
          {user ? (
            <NeumorphicDropdownMenu>
              <NeumorphicDropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                  <User className="h-4 w-4" />
                  {user?.email}
                </Button>
              </NeumorphicDropdownMenuTrigger>
              <NeumorphicDropdownMenuContent align="end">
                <NeumorphicDropdownMenuItem asChild>
                  <Link
                    href="/profile"
                    className="cursor-pointer flex items-center gap-2"
                  >
                    <Settings className="h-4 w-4" />
                    <span>Profile</span>
                  </Link>
                </NeumorphicDropdownMenuItem>
                <NeumorphicDropdownMenuItem asChild>
                  <Link
                    href="/chat"
                    className="cursor-pointer flex items-center gap-2"
                  >
                    <MessageSquare className="h-4 w-4" />
                    <span>AI Chat</span>
                  </Link>
                </NeumorphicDropdownMenuItem>
                <NeumorphicDropdownMenuSeparator />
                <NeumorphicDropdownMenuItem
                  onClick={() => signOut()}
                  className="cursor-pointer flex items-center gap-2"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Log out</span>
                </NeumorphicDropdownMenuItem>
              </NeumorphicDropdownMenuContent>
            </NeumorphicDropdownMenu>
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
  );
}



