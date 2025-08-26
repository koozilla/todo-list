import { supabase } from './supabase'
import { User } from '@/types'

export interface AuthResponse {
  success: boolean
  user?: User | null
  error?: string
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterCredentials {
  email: string
  password: string
  confirmPassword: string
}

export class AuthService {
  // Google OAuth login
  static async signInWithGoogle(): Promise<AuthResponse> {
    try {
      console.log('🔍 [AUTH] signInWithGoogle called')
      
      // Check if we're in browser environment
      if (typeof window === 'undefined') {
        throw new Error('This function must be called in the browser')
      }
      
      // Check if supabase is available
      if (typeof supabase === 'undefined') {
        throw new Error('Supabase client is not available')
      }
      
      console.log('🔍 [AUTH] Supabase client available:', !!supabase)
      console.log('🔍 [AUTH] Supabase auth available:', !!supabase.auth)
      
      // Use Supabase's default OAuth redirect handling
      // This will redirect to Supabase's OAuth endpoint, not our custom callback
      console.log('🔍 [AUTH] Starting Google OAuth flow...')
      console.log('🔍 [AUTH] Current origin:', window.location.origin)
      console.log('🔍 [AUTH] Supabase client config:', {
        url: process.env.NEXT_PUBLIC_SUPABASE_URL?.substring(0, 20) + '...',
        hasKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      })

      // Let Supabase handle the OAuth flow completely
      console.log('🔍 [AUTH] Calling Supabase signInWithOAuth...')
      
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          // Don't specify redirectTo - let Supabase use its default
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        }
      })
      
      console.log('🔍 [AUTH] Supabase OAuth response:', { error: error?.message || 'No error' })

      if (error) {
        return {
          success: false,
          error: error.message
        }
      }

      // For OAuth, we don't get the user immediately
      // The user will be redirected to Supabase's OAuth endpoint
      return {
        success: true
      }
    } catch (err) {
      return {
        success: false,
        error: err instanceof Error ? err.message : 'An unexpected error occurred'
      }
    }
  }

  // Register new user with email and password
  static async register(credentials: RegisterCredentials): Promise<AuthResponse> {
    try {
      // Validate passwords match
      if (credentials.password !== credentials.confirmPassword) {
        return {
          success: false,
          error: 'Passwords do not match'
        }
      }

      // Validate password strength
      if (credentials.password.length < 6) {
        return {
          success: false,
          error: 'Password must be at least 6 characters long'
        }
      }

      const { data, error } = await supabase.auth.signUp({
        email: credentials.email,
        password: credentials.password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`
        }
      })

      if (error) {
        return {
          success: false,
          error: error.message
        }
      }

      if (data.user) {
        const user: User = {
          id: data.user.id,
          email: data.user.email!,
          created_at: data.user.created_at
        }

        return {
          success: true,
          user
        }
      }

      return {
        success: false,
        error: 'Registration failed'
      }
    } catch (err) {
      return {
        success: false,
        error: err instanceof Error ? err.message : 'An unexpected error occurred'
      }
    }
  }

  // Login with email and password
  static async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password
      })

      if (error) {
        return {
          success: false,
          error: error.message
        }
      }

      if (data.user) {
        const user: User = {
          id: data.user.id,
          email: data.user.email!,
          created_at: data.user.created_at
        }

        return {
          success: true,
          user
        }
      }

      return {
        success: false,
        error: 'Login failed'
      }
    } catch (err) {
      return {
        success: false,
        error: err instanceof Error ? err.message : 'An unexpected error occurred'
      }
    }
  }

  // Sign out current user
  static async signOut(): Promise<AuthResponse> {
    try {
      const { error } = await supabase.auth.signOut()
      
      if (error) {
        return {
          success: false,
          error: error.message
        }
      }

      return {
        success: true
      }
    } catch (err) {
      return {
        success: false,
        error: err instanceof Error ? err.message : 'An unexpected error occurred'
      }
    }
  }

  // Get current authenticated user
  static async getCurrentUser(): Promise<User | null> {
    try {
      const { data: { user }, error } = await supabase.auth.getUser()
      
      if (error || !user) {
        return null
      }

      return {
        id: user.id,
        email: user.email!,
        created_at: user.created_at
      }
    } catch (err) {
      console.error('Error getting current user:', err)
      return null
    }
  }

  // Check if user is authenticated
  static async isAuthenticated(): Promise<boolean> {
    const user = await this.getCurrentUser()
    return !!user
  }

  // Reset password
  static async resetPassword(email: string): Promise<AuthResponse> {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`
      })

      if (error) {
        return {
          success: false,
          error: error.message
        }
      }

      return {
        success: true
      }
    } catch (err) {
      return {
        success: false,
        error: err instanceof Error ? err.message : 'An unexpected error occurred'
      }
    }
  }
}
