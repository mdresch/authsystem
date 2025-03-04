import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"

export default function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 mx-auto">
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <h1 className="text-3xl font-bold mb-6 text-center">About</h1>
            <div className="prose dark:prose-invert max-w-none">
              <p className="mb-4">
                This is a comprehensive authentication system built with Next.js and shadcn/ui. It includes all the
                essential authentication features:
              </p>
              <ul className="list-disc list-inside space-y-2 mt-4">
                <li>User registration with validation</li>
                <li>Login with email and password</li>
                <li>Password reset functionality</li>
                <li>Email verification (simulated)</li>
                <li>User profile management</li>
                <li>Password change with current password verification</li>
                <li>Protected routes for authenticated users</li>
                <li>Responsive design with dark mode support</li>
              </ul>
              <p className="mb-4 mt-4">
                This system now uses the Supabase authentication service for demonstration purposes. You will require a Supabase account and update your .env with a Supabase URL and Supabase Key. 
                In a real application, you would connect this to a backend service and use the requirements and settings for authorization with Supabase.
              </p>
              <h2 className="text-2xl font-bold mt-6 mb-4">Technologies Used</h2>
              <ul className="list-disc list-inside space-y-2 mt-4">
                <li>Next.js App Router</li>
                <li>React</li>
                <li>TypeScript</li>
                <li>Tailwind CSS</li>
                <li>shadcn/ui Components</li>
                <li>Zod for form validation</li>
                <li>Lucide Icons</li>
                <li>NextAuth.js or Supabase</li>
              </ul>

              <h2 className="text-2xl font-bold mt-6 mb-4">File Structure</h2>
              <pre className="bg-gray-100 p-4 rounded-md overflow-auto">
                <code>
                  {`auth-system/
├── app/
│   ├── about/
│   │   └── page.tsx
│   ├── auth/
│   │   ├── forgot-password/
│   │   │   └── page.tsx
│   │   └── verify/
│   │       └── page.tsx
│   ├── dashboard/
│   │   └── page.tsx
│   ├── profile/
│   │   └── page.tsx
│   ├── chat/
│   │   └── page.tsx
│   ├── page.tsx
│   └── layout.tsx
├── components/
│   ├── chat/
│   │   ├── chat-input.tsx
│   │   ├── chat-message.tsx
│   │   ├── message-history-sidebar.tsx
│   │   └── model-details-sidebar.tsx
│   ├── layout/
│   │   ├── header.tsx
│   │   └── footer.tsx
│   └── ui/
│       ├── button.tsx
│       ├── dropdown-menu.tsx
│       └── scroll-area.tsx
├── lib/
│   ├── auth-context.tsx
│   └── supabaseClient.ts
├── styles/
│   └── globals.css
├── public/
│   └── (any static assets, if applicable)
└── package.json`}
                </code>
              </pre>

              <h2 className="text-2xl font-bold mt-6 mb-4">Authentication Best Practices</h2>
              <p className="mb-4">
                Here are some best practices for authentication to ensure your system is secure and user-friendly:
              </p>
              <ul className="list-disc list-inside space-y-2 mt-4">
                <li>
                  <strong>Use Strong Password Policies:</strong>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Enforce minimum password lengths (e.g., at least 12 characters).</li>
                    <li>Require a mix of uppercase, lowercase, numbers, and special characters.</li>
                    <li>Avoid common passwords and encourage passphrases.</li>
                  </ul>
                </li>
                <li>
                  <strong>Hash and Salt Passwords:</strong>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Store passwords using strong hashing algorithms like Argon2id or bcrypt.</li>
                    <li>Always use a unique salt for each password to prevent rainbow table attacks.</li>
                  </ul>
                </li>
                <li>
                  <strong>Implement Multi-Factor Authentication (MFA):</strong>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Add an extra layer of security by requiring users to provide two or more verification methods (e.g., password and a one-time code sent to their phone).</li>
                  </ul>
                </li>
                <li>
                  <strong>Use Secure Session Management:</strong>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Ensure session tokens are unique, securely stored, and have an expiration time.</li>
                    <li>Implement secure cookies with attributes like HttpOnly and Secure.</li>
                  </ul>
                </li>
                <li>
                  <strong>Protect Against Automated Attacks:</strong>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Implement rate limiting and account lockout mechanisms to prevent brute force attacks.</li>
                    <li>Use CAPTCHA or similar technologies to distinguish between human users and bots.</li>
                  </ul>
                </li>
                <li>
                  <strong>Regularly Update and Patch Systems:</strong>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Keep your authentication libraries and dependencies up to date to protect against known vulnerabilities.</li>
                  </ul>
                </li>
                <li>
                  <strong>Educate Users:</strong>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Encourage users to use password managers within the browser.</li>
                    <li>Provide guidance on recognizing phishing attempts and other common attacks.</li>
                  </ul>
                </li>
                <li>
                  <strong>Monitor and Audit:</strong>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Regularly review authentication logs for suspicious activity.</li>
                    <li>Implement alerts for unusual login patterns.</li>
                  </ul>
                </li>
              </ul>
              <p className="mt-4">
                By following these best practices, you can significantly enhance the security of your authentication system.
              </p>

              <h2 className="text-2xl font-bold mt-6 mb-4">Project Overview</h2>
              <p>This project is a comprehensive authentication system built with Next.js and Supabase, aimed at providing secure and user-friendly authentication features.</p>

              <h2 className="text-2xl font-bold mt-6 mb-4">Installation Instructions</h2>
              <pre>
                <code>
                  {`1. Clone the repository:
                     git clone <repository-url>

                  2. Navigate to the project directory:
                     cd <project-directory>

                  3. Install dependencies:
                     npm install

                  4. Create a .env file and add the required environment variables.

                  5. Run the development server:
                     npm run dev`}
                </code>
              </pre>

              <h2 className="text-2xl font-bold mt-6 mb-4">Environment Variables</h2>
              <ul>
                <li><strong>NEXT_PUBLIC_SUPABASE_URL</strong>: Your Supabase project URL.</li>
                <li><strong>NEXT_PUBLIC_SUPABASE_ANON_KEY</strong>: Your Supabase anonymous key.</li>
              </ul>

              <h2 className="text-2xl font-bold mt-6 mb-4">Dependencies</h2>
              <ul>
                <li><strong>Next.js</strong>: Framework for server-rendered React applications.</li>
                <li><strong>Supabase</strong>: Backend as a service for authentication and database management.</li>
                <li><strong>Tailwind CSS</strong>: Utility-first CSS framework for styling.</li>
                <li><strong>Lucide Icons</strong>: Icon library used for UI elements.</li>
              </ul>

              <h2 className="text-2xl font-bold mt-6 mb-4">Usage</h2>
              <p>Once the application is running, users can register, log in, and access various features...</p>

              <h2 className="text-2xl font-bold mt-6 mb-4">Contributing</h2>
              <p>To contribute to this project, please follow the guidelines outlined in the CONTRIBUTING.md file.</p>

              <h2 className="text-2xl font-bold mt-6 mb-4">License</h2>
              <p>This project is licensed under the MIT License.</p>

              <h2 className="text-2xl font-bold mt-6 mb-4">Contact</h2>
              <p>For questions or support, please reach out to menno.drescher@gmail.com.</p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}

