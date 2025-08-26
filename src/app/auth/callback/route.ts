import { createServerClient } from '@supabase/ssr'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  console.log('🔄 OAuth callback received')
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/dashboard'

  console.log('🔍 Callback params:', { code: !!code, next, origin })

  if (code) {
    let supabaseResponse = NextResponse.next({
      request,
    })

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return request.cookies.get(name)?.value
          },
          set(name: string, value: string, options: Record<string, unknown>) {
            request.cookies.set({
              name,
              value,
              ...options,
            })
            supabaseResponse = NextResponse.next({
              request,
            })
            supabaseResponse.cookies.set({
              name,
              value,
              ...options,
            })
          },
          remove(name: string, options: Record<string, unknown>) {
            request.cookies.set({
              name,
              value: '',
              ...options,
            })
            supabaseResponse = NextResponse.next({
              request,
            })
            supabaseResponse.cookies.set({
              name,
              value: '',
              ...options,
            })
          },
        },
      }
    )

    // Exchange the code for a session
    console.log('🔄 Exchanging code for session...')
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)
    
    console.log('🔍 Exchange result:', {
      hasData: !!data,
      hasSession: !!data?.session,
      hasUser: !!data?.user,
      userEmail: data?.user?.email,
      hasError: !!error,
      errorMessage: error?.message
    })
    
    if (!error && data?.session) {
      console.log('✅ OAuth success, redirecting to dashboard')
      // Successfully authenticated, redirect to dashboard
      return NextResponse.redirect(`${origin}${next}`)
    } else {
      console.log('❌ OAuth failed:', error?.message)
    }
  }

  // If there's an error or no code, redirect to login
  console.log('❌ Redirecting to login with error')
  return NextResponse.redirect(`${origin}/auth/login?error=auth_callback_failed`)
}
