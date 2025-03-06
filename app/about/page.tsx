import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import Link from "next/link"

export default function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="container flex-1 mx-auto py-12 md:py-24 lg:py-32 px-4 md:px-6">
        <h1 className="text-3xl font-bold mb-6 text-center">About This Project</h1>
        <div className="prose dark:prose-invert">
          <p>
            This project is a demonstration of a complete authentication system built with
            Next.js, Supabase, and shadcn/ui. It includes features such as user registration,
            login, password reset, and protected routes.
          </p>
          <p>
            For detailed documentation, including installation instructions, API references,
            and best practices, please visit our documentation site:
          </p>
          <p className="text-center">
            <Link
              href="http://localhost:3000" // Use this during development
              // In production, you'd use:
              // href="/"  // If Docusaurus is at the root
              // href="/docs" // If Docusaurus is in a /docs subdirectory
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline"
            >
              View Documentation
            </Link>
          </p>
          <p>
            Key technologies used include: Next.js (App Router), React, TypeScript,
            Tailwind CSS, shadcn/ui, Zod, Lucide Icons, and Supabase.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  )
}