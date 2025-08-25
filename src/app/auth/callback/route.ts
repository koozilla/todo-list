import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const requestUrl = new URL(request.url)
    const code = requestUrl.searchParams.get("code")
    const error = requestUrl.searchParams.get("error")
    const state = requestUrl.searchParams.get("state")

    console.log('OAuth callback received:', {
      url: request.url,
      code: code ? 'present' : 'missing',
      error: error || 'none',
      state: state ? 'present' : 'missing',
      origin: requestUrl.origin,
      searchParams: Object.fromEntries(requestUrl.searchParams.entries()),
      env: {
        supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL ? 'set' : 'missing',
        supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'set' : 'missing'
      }
    })

    // Check for OAuth errors
    if (error) {
      console.error('OAuth error received:', error)
      return NextResponse.redirect(requestUrl.origin + `/auth/login?error=oauth_${error}`)
    }

    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      console.error('Missing Supabase environment variables')
      return NextResponse.redirect(requestUrl.origin + "/auth/login?error=env_missing")
    }

    if (code) {
      const cookieStore = await cookies()
      
      const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        {
          cookies: {
            getAll() {
              return cookieStore.getAll()
            },
            setAll(cookiesToSet) {
              try {
                cookiesToSet.forEach(({ name, value, options }) =>
                  cookieStore.set(name, value, options)
                )
              } catch (error) {
                console.error('Error setting cookies:', error)
              }
            },
          },
        }
      )

      console.log('Attempting to exchange code for session...')
      const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)
      
      if (exchangeError) {
        console.error('OAuth callback error:', exchangeError)
        return NextResponse.redirect(requestUrl.origin + `/auth/login?error=exchange_failed&details=${encodeURIComponent(exchangeError.message)}`)
      }
      
      console.log('OAuth callback: Session established successfully', { user: data.user?.id })
    } else {
      console.error('No code received in OAuth callback. Full URL:', request.url)
      console.error('Search params:', Object.fromEntries(requestUrl.searchParams.entries()))
      return NextResponse.redirect(requestUrl.origin + "/auth/login?error=no_code")
    }

    console.log('Redirecting to dashboard...')
    return NextResponse.redirect(requestUrl.origin + "/dashboard")
  } catch (error) {
    console.error('Unexpected error in OAuth callback:', error)
    const origin = new URL(request.url).origin
    return NextResponse.redirect(origin + "/auth/login?error=unexpected")
  }
}
