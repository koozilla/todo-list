import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get("code")

  console.log('OAuth callback received:', {
    url: request.url,
    code: code ? 'present' : 'missing',
    origin: requestUrl.origin
  })

  if (code) {
    const cookieStore = await cookies()
    
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
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
            } catch {
              // The `setAll` method was called from a Server Component.
              // This can be ignored if you have middleware refreshing
              // user sessions.
            }
          },
        },
      }
    )

    console.log('Attempting to exchange code for session...')
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (error) {
      console.error('OAuth callback error:', error)
      // Redirect to login page if there's an error
      return NextResponse.redirect(requestUrl.origin + "/auth/login?error=oauth_failed")
    }
    
    console.log('OAuth callback: Session established successfully')
  } else {
    console.log('No code received in OAuth callback')
  }

  // URL to redirect to after sign in process completes
  console.log('Redirecting to dashboard...')
  return NextResponse.redirect(requestUrl.origin + "/dashboard")
}
