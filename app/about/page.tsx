import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"

export default function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 container py-8">
        <h1 className="text-3xl font-bold mb-6">About</h1>

        <div className="prose dark:prose-invert max-w-none">
          <p>
            This is a comprehensive authentication system built with Next.js and shadcn/ui. It includes all the
            essential authentication features:
          </p>

          <ul>
            <li>User registration with validation</li>
            <li>Login with email and password</li>
            <li>Password reset functionality</li>
            <li>Email verification (simulated)</li>
            <li>User profile management</li>
            <li>Password change with current password verification</li>
            <li>Protected routes for authenticated users</li>
            <li>Responsive design with dark mode support</li>
          </ul>

          <p>
            This system uses a mock authentication service for demonstration purposes. In a real application, you would
            connect this to a backend service or use an authentication provider like NextAuth.js, Auth.js, Clerk, or
            Supabase.
          </p>

          <h2>Technologies Used</h2>

          <ul>
            <li>Next.js App Router</li>
            <li>React</li>
            <li>TypeScript</li>
            <li>Tailwind CSS</li>
            <li>shadcn/ui Components</li>
            <li>Zod for form validation</li>
          </ul>
        </div>
      </main>
      <Footer />
    </div>
  )
}

