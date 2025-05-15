"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

type AuthContextType = {
  isAdmin: boolean
  login: (password: string) => Promise<boolean>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// In a real app, you would use a secure authentication method
// This is a simplified example for demonstration purposes
const ADMIN_PASSWORD = "admin123"

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAdmin, setIsAdmin] = useState(false)

  // Check if user is already logged in on mount
  useEffect(() => {
    const loggedIn = localStorage.getItem("isAdminLoggedIn") === "true"
    setIsAdmin(loggedIn)
  }, [])

  const login = async (password: string): Promise<boolean> => {
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 500))

    if (password === ADMIN_PASSWORD) {
      setIsAdmin(true)
      localStorage.setItem("isAdminLoggedIn", "true")
      return true
    }
    return false
  }

  const logout = () => {
    setIsAdmin(false)
    localStorage.removeItem("isAdminLoggedIn")
  }

  return <AuthContext.Provider value={{ isAdmin, login, logout }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
