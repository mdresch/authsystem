// This is a mock authentication service
// In a real application, this would connect to a backend service

import { z } from "zod"

// User schema
export const userSchema = z.object({
  id: z.string(),
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  createdAt: z.date(),
  emailVerified: z.boolean().default(false),
})

export type User = z.infer<typeof userSchema>

// User without sensitive data
export type SafeUser = Omit<User, "password">

// Mock database
const users: User[] = []
const resetTokens: Record<string, { email: string; expires: Date }> = {}

// Helper to create a safe user object (without password)
const createSafeUser = (user: User): SafeUser => {
  const { password, ...safeUser } = user
  return safeUser
}

export const auth = {
  // Register a new user
  async register(name: string, email: string, password: string): Promise<SafeUser> {
    // Check if user already exists
    const existingUser = users.find((user) => user.email === email)
    if (existingUser) {
      throw new Error("User with this email already exists")
    }

    // Create new user
    const newUser: User = {
      id: Math.random().toString(36).substring(2, 15),
      name,
      email,
      password, // In a real app, this would be hashed
      createdAt: new Date(),
      emailVerified: false,
    }

    users.push(newUser)
    return createSafeUser(newUser)
  },

  // Login user
  async login(email: string, password: string): Promise<SafeUser> {
    // Find user
    const user = users.find((user) => user.email === email)
    if (!user) {
      throw new Error("Invalid email or password")
    }

    // Check password
    if (user.password !== password) {
      throw new Error("Invalid email or password")
    }

    return createSafeUser(user)
  },

  // Get user by email
  async getUserByEmail(email: string): Promise<SafeUser | null> {
    const user = users.find((user) => user.email === email)
    if (!user) return null
    return createSafeUser(user)
  },

  // Update user profile
  async updateProfile(userId: string, data: { name?: string }): Promise<SafeUser> {
    const userIndex = users.findIndex((user) => user.id === userId)
    if (userIndex === -1) {
      throw new Error("User not found")
    }

    // Update user data
    users[userIndex] = {
      ...users[userIndex],
      ...data,
    }

    return createSafeUser(users[userIndex])
  },

  // Change password
  async changePassword(userId: string, currentPassword: string, newPassword: string): Promise<void> {
    const userIndex = users.findIndex((user) => user.id === userId)
    if (userIndex === -1) {
      throw new Error("User not found")
    }

    // Verify current password
    if (users[userIndex].password !== currentPassword) {
      throw new Error("Current password is incorrect")
    }

    // Update password
    users[userIndex].password = newPassword
  },

  // Request password reset
  async requestPasswordReset(email: string): Promise<string> {
    const user = users.find((user) => user.email === email)
    if (!user) {
      throw new Error("User with this email does not exist")
    }

    // Generate token
    const token = Math.random().toString(36).substring(2, 15)

    // Store token with expiration (24 hours)
    const expires = new Date()
    expires.setHours(expires.getHours() + 24)

    resetTokens[token] = {
      email,
      expires,
    }

    return token
  },

  // Reset password with token
  async resetPassword(token: string, newPassword: string): Promise<void> {
    // Check if token exists and is valid
    const resetData = resetTokens[token]
    if (!resetData) {
      throw new Error("Invalid or expired reset token")
    }

    // Check if token is expired
    if (new Date() > resetData.expires) {
      delete resetTokens[token]
      throw new Error("Reset token has expired")
    }

    // Find user and update password
    const userIndex = users.findIndex((user) => user.email === resetData.email)
    if (userIndex === -1) {
      throw new Error("User not found")
    }

    // Update password
    users[userIndex].password = newPassword

    // Remove used token
    delete resetTokens[token]
  },

  // Verify email
  async verifyEmail(userId: string): Promise<void> {
    const userIndex = users.findIndex((user) => user.id === userId)
    if (userIndex === -1) {
      throw new Error("User not found")
    }

    users[userIndex].emailVerified = true
  },
}

