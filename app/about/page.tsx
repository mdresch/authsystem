// app/about/page.tsx
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import Link from "next/link"

export default function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="container flex-1 mx-auto py-12 md:py-24 lg:py-32 px-4 md:px-6">
        <h1 className="text-3xl font-bold mb-6 text-center">About This Project</h1>
        <p className="text-center text-gray-500 mb-6">
          A complete authentication system built with Next.js, Supabase, and shadcn/ui.
        </p>
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
            <Link href="https://cba-auth.hashnode.space">
              View Documentation
            </Link>
          </p>
          <p>
            Key technologies used include: Next.js (App Router), React, TypeScript,
            Tailwind CSS, shadcn/ui, Zod, Lucide Icons, and Supabase.
          </p>
          <p>
            Our documentation site provides a comprehensive guide to help you get started with the project. 
            It covers everything from installation to advanced features, ensuring you have all the information 
            you need to effectively use and extend the authentication system.
          </p>
          <p>
            The documentation page is an essential resource for developers and users of the Auth System. 
            It offers detailed instructions on setting up and configuring the system, as well as in-depth 
            explanations of the various features and functionalities. By providing clear and concise 
            documentation, we aim to make it easier for you to integrate and customize the authentication 
            system to meet your specific needs. Whether you are a beginner or an experienced developer, 
            our documentation will guide you through every step of the process, ensuring a smooth and 
            efficient implementation.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}