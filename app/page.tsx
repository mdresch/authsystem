"use client";

import { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button"; // Import the Button component
import { Header } from "@/components/layout/header"; // Import the Header component
import { Footer } from "@/components/layout/footer"; // Import the Footer component

export default function HomePage() {
  const [supabaseKeysExist, setSupabaseKeysExist] = useState(true); // Assume keys exist initially

  useEffect(() => {
    // Check if environment variables are defined
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      setSupabaseKeysExist(false); // Set to false if either key is missing
    }
  }, []);

  return ( 
    <div className="flex flex-col min-h-screen">
      <Header /> {/* Include the Header component */}
      <main className="container mx-auto py-10 flex-1">
        {supabaseKeysExist ? (
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">CBA-Auth: Effortless Authentication</h1>
            <p className="text-gray-700 mb-6">Simplify user management and security for modern applications.</p>
            <div className="flex justify-center mb-6">
              <Button> <a href="https://cba-auth.hashnode.space/">View Documentation</a></Button>
            </div>
            <section className="mt-10">
              <h2 className="text-2xl font-semibold mb-4">Features</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray p-6 rounded-lg shadow-md">
                  <h3 className="text-xl font-semibold mb-2">Easy integration with Next.js</h3>
                  <p>Integrate seamlessly with Next.js for a smooth development experience.</p>
                </div>
                <div className="bg-gray p-6 rounded-lg shadow-md">
                  <h3 className="text-xl font-semibold mb-2">Secure authentication and user management</h3>
                  <p>Ensure secure authentication and manage users effortlessly.</p>
                </div>
                <div className="bg-gray p-6 rounded-lg shadow-md">
                  <h3 className="text-xl font-semibold mb-2">Real-time data synchronization</h3>
                  <p>Keep your data in sync in real-time across all clients.</p>
                </div>
                <div className="bg-gray p-6 rounded-lg shadow-md">
                  <h3 className="text-xl font-semibold mb-2">Scalable and performant</h3>
                  <p>Build scalable and high-performance applications with ease.</p>
                </div>
              </div>
            </section>
          </div>
        ) : (
          <div className="bg-gray-100 p-6 rounded-md">
            <h2 className="text-2xl font-semibold mb-4">Welcome to CBA-Auth!</h2>
            <p className="mb-4">To get started, you need to set up a Supabase project and obtain your Supabase URL and API key.</p>

            <h3 className="text-lg font-semibold mt-4 mb-2">Step 1: Create a Supabase Account</h3>
            <p className="mb-2">Go to <a href="https://supabase.com/" target="_blank" rel="noopener noreferrer" className="text-blue-500">supabase.com</a> and create a free account.</p>

            <h3 className="text-lg font-semibold mt-4 mb-2">Step 2: Create a New Project</h3>
            <p className="mb-2">Once you're logged in, create a new Supabase project. Choose a unique name and a secure password.</p>

            <h3 className="text-lg font-semibold mt-4 mb-2">Step 3: Obtain Your Supabase URL and API Key</h3>
            <p className="mb-2">After your project is created, go to the "Settings" section and find your project URL and API key.</p>
            <ul className="list-disc pl-5 mb-4">
              <li>The URL will look like: <code>https://your-project-id.supabase.co</code></li>
              <li>The API key will be labeled as "anon key" and will start with <code>eyJ</code></li>
            </ul>

            <h3 className="text-lg font-semibold mt-4 mb-2">Step 4: Create a .env.local File</h3>
            <p className="mb-2">In the root of your Next.js project, create a file named <code>.env.local</code>.</p>

            <h3 className="text-lg font-semibold mt-4 mb-2">Step 5: Add Your Supabase Credentials to .env.local</h3>
            <p className="mb-2">Add the following lines to your <code>.env.local</code> file, replacing the placeholders with your actual values:</p>
            <pre className="bg-gray-200 p-2 rounded-md mb-4">
              <code>
                NEXT_PUBLIC_SUPABASE_URL=YOUR_SUPABASE_URL<br/>
                NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY<br/>
                # Never expose your service role key on the client. Only use it server-side.
              </code>
            </pre>

            <h3 className="text-lg font-semibold mt-4 mb-2">Step 6: Secure Your Credentials</h3>
            <p className="mb-2">Add <code>.env.local</code> to your <code>.gitignore</code> file to prevent your credentials from being committed to your Git repository:</p>
            <pre className="bg-gray-200 p-2 rounded-md mb-4">
              <code>
                .env.local
              </code>
            </pre>
            <p className="mt-4 font-semibold">Important Security Note:</p>
            <p className="mb-4">Never commit your <code>.env.local</code> file to your Git repository. This file contains sensitive information that should be kept secret.</p>
          </div>
        )}
      </main>
      <Footer /> {/* Include the Footer component */}
    </div>
  );
}