import { createBrowserClient } from '@supabase/ssr'
import { User } from '@/types'

// Create a browser client for authentication that properly handles cookies
const getBrowserClient = () => {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

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
      // Check if we're in browser environment
      if (typeof window === 'undefined') {
        throw new Error('This function must be called in the browser')
      }

      // Use browser client for proper cookie handling
      const browserClient = getBrowserClient()

      // Let Supabase handle the OAuth flow completely
      const { error } = await browserClient.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
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

      const browserClient = getBrowserClient()
      const { data, error } = await browserClient.auth.signUp({
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
      // Use browser client for proper cookie handling
      const browserClient = getBrowserClient()
      const { data, error } = await browserClient.auth.signInWithPassword({
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
      // Use browser client for proper cookie handling
      const browserClient = getBrowserClient()
      const { error } = await browserClient.auth.signOut()
      
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
      // Use browser client for proper cookie handling
      const browserClient = getBrowserClient()
      const { data: { user }, error } = await browserClient.auth.getUser()
      
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
      const browserClient = getBrowserClient()
      const { error } = await browserClient.auth.resetPasswordForEmail(email, {
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
