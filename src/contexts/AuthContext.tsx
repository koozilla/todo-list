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
    // Check authentication status on mount
    refreshUser()

    // Set up auth state change listener
    const { supabase } = require('@/lib/supabase')
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event: string, session: any) => {
        console.log('AuthContext: Auth state change:', event, session?.user?.email)
        
        if (event === 'SIGNED_IN' && session?.user) {
          const user: User = {
            id: session.user.id,
            email: session.user.email,
            created_at: session.user.created_at
          }
          setUser(user)
        } else if (event === 'SIGNED_OUT') {
          setUser(null)
        }
        
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  return (
    <AuthContext.Provider value={{ user, loading, signOut, refreshUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
