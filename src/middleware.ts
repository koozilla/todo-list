import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  console.log('🔍 Middleware executing for:', request.nextUrl.pathname)
  
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
        set(name: string, value: string, options: any) {
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
        remove(name: string, options: any) {
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

  // This will refresh the session cookie on every request, keeping the user logged in
  console.log('🔄 Refreshing session...')
  const { data: { session }, error: sessionError } = await supabase.auth.getSession()
  
  console.log('👤 Session status:', {
    hasSession: !!session,
    hasUser: !!session?.user,
    userEmail: session?.user?.email,
    sessionError: sessionError?.message
  })

  // If user is not authenticated and trying to access protected routes
  if (!session && request.nextUrl.pathname.startsWith('/dashboard')) {
    console.log('🚫 Redirecting unauthenticated user from dashboard to login')
    const redirectUrl = new URL('/auth/login', request.url)
    return NextResponse.redirect(redirectUrl)
  }

  // If user is authenticated and trying to access auth pages, redirect to dashboard
  if (session && (request.nextUrl.pathname.startsWith('/auth/login') || request.nextUrl.pathname.startsWith('/auth/register'))) {
    console.log('🔄 Redirecting authenticated user from auth page to dashboard')
    const redirectUrl = new URL('/dashboard', request.url)
    return NextResponse.redirect(redirectUrl)
  }

  // If user is authenticated and visiting the home page, redirect to dashboard
  if (session && request.nextUrl.pathname === '/') {
    console.log('🔄 Redirecting authenticated user from home to dashboard')
    const redirectUrl = new URL('/dashboard', request.url)
    return NextResponse.redirect(redirectUrl)
  }

  // Allow unauthenticated users to access the home page
  if (!session && request.nextUrl.pathname === '/') {
    console.log('✅ Allowing unauthenticated access to home page')
    return supabaseResponse
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    /*
     * Apply middleware to all routes that need authentication handling
     */
    '/dashboard/:path*',
    '/auth/:path*',
    '/',
  ],
}
