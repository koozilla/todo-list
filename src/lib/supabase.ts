import { createClient, SupabaseClient } from '@supabase/supabase-js'

let supabaseClient: SupabaseClient | null = null

const getSupabaseClient = (): SupabaseClient => {
  if (supabaseClient) {
    return supabaseClient
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase environment variables')
  }

  supabaseClient = createClient(supabaseUrl, supabaseAnonKey)
  return supabaseClient
}

// Only create the client when actually used (not during build time)
export const supabase = new Proxy({} as SupabaseClient, {
  get(target, prop) {
    try {
      const client = getSupabaseClient()
      return client[prop as keyof SupabaseClient]
    } catch (error) {
      // During build time, return a mock object
      if (typeof window === 'undefined') {
        return () => Promise.resolve({ data: null, error: null })
      }
      throw error
    }
  }
})

// Helper function to get authenticated user
export const getCurrentUser = async () => {
  try {
    const client = getSupabaseClient()
    const { data: { user }, error } = await client.auth.getUser()
    if (error) {
      console.error('Error getting user:', error.message)
      return null
    }
    return user
  } catch (error) {
    console.error('Error getting current user:', error)
    return null
  }
}

// Helper function to check if user is authenticated
export const isAuthenticated = async () => {
  try {
    const user = await getCurrentUser()
    return !!user
  } catch (error) {
    console.error('Error checking authentication:', error)
    return false
  }
}
