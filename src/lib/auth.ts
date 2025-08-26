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
      // Get the correct URL for the current environment
      const getRedirectURL = () => {
        // Always use window.location.origin for local development
        // This ensures we use the correct localhost port
        return `${window.location.origin}/auth/callback`
      }

      const redirectURL = getRedirectURL()
      console.log('OAuth redirect URL:', redirectURL)

      // Force the redirect URL by using the full URL
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectURL,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        }
      })

      if (error) {
        return {
          success: false,
          error: error.message
        }
      }

      // For OAuth, we don't get the user immediately
      // The user will be redirected to the callback URL
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
