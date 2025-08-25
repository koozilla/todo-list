'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { User } from '@/types'
import { AuthService } from '@/lib/auth'

interface AuthContextType {
  user: User | null
  loading: boolean
  signOut: () => Promise<void>
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [mounted, setMounted] = useState(false)

  const refreshUser = async () => {
    try {
      console.log('AuthContext: Refreshing user...')
      const currentUser = await AuthService.getCurrentUser()
      console.log('AuthContext: User refresh result:', currentUser)
      setUser(currentUser)
    } catch (error) {
      console.error('AuthContext: Error refreshing user:', error)
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  const signOut = async () => {
    try {
      const result = await AuthService.signOut()
      if (result.success) {
        setUser(null)
        window.location.href = '/'
      } else {
        console.error('Sign out error:', result.error)
      }
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  useEffect(() => {
    setMounted(true)
    // Check authentication status on mount
    refreshUser()

    // Set up auth state change listener
    const setupAuthListener = async () => {
      try {
        // Use a simple approach without complex auth state listening for now
        // The middleware will handle routing protection
        console.log('AuthContext: Auth listener setup complete')
      } catch (error) {
        console.error('Error setting up auth listener:', error)
      }
    }

    setupAuthListener()
  }, [])

  // Provide safe default values during SSR
  const contextValue: AuthContextType = {
    user: mounted ? user : null,
    loading: mounted ? loading : true,
    signOut,
    refreshUser
  }

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within a AuthProvider')
  }
  return context
}
