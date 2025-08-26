import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  console.log('🔍 Middleware executing for:', request.nextUrl.pathname)
  
  // Debug cookies
  const cookies = request.cookies.getAll()
  console.log('🍪 Cookies received:', cookies.map(c => ({ name: c.name, hasValue: !!c.value, valueLength: c.value?.length || 0 })))
  
  // Check for Supabase session cookie specifically
  const sessionCookie = request.cookies.get('session')
  if (sessionCookie) {
    console.log('🔐 Session cookie found:', {
      name: sessionCookie.name,
      hasValue: !!sessionCookie.value,
      valueLength: sessionCookie.value?.length || 0,
      valuePreview: sessionCookie.value?.substring(0, 50) + '...'
    })
  } else {
    console.log('❌ No session cookie found')
  }
  
  let supabaseResponse = NextResponse.next({
    request,
  })

  console.log('🔧 Supabase config:', {
    hasUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
    hasAnonKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    urlLength: process.env.NEXT_PUBLIC_SUPABASE_URL?.length || 0,
    keyLength: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.length || 0
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          console.log('🍪 Supabase setting cookies:', cookiesToSet.map(c => ({ name: c.name, hasValue: !!c.value, valueLength: c.value?.length || 0 })))
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set(name, value)
            if (supabaseResponse) {
              supabaseResponse.cookies.set(name, value, options)
            }
          })
          supabaseResponse = NextResponse.next({
            request,
          })
        },
      },
    }
  )

  // Refresh session if expired - required for Server Components
  console.log('🔍 Attempting to get user from Supabase...')
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  console.log('👤 User authenticated:', !!user, user?.email || 'No email')
  console.log('👤 User details:', {
    hasUser: !!user,
    userId: user?.id,
    userEmail: user?.email,
    userCreatedAt: user?.created_at
  })
  if (userError) {
    console.log('❌ Error getting user:', userError.message)
  }

  // If we have a session cookie but no user, or if there's an auth session error, clear it
  if (sessionCookie && (!user || userError)) {
    console.log('🧹 Clearing invalid session cookie (Auth session missing or corrupted)')
    const response = NextResponse.next({ request })
    response.cookies.delete('session')
    return response
  }

  // If user is not authenticated and trying to access protected routes
  if (!user && request.nextUrl.pathname.startsWith('/dashboard')) {
    const redirectUrl = new URL('/auth/login', request.url)
    return NextResponse.redirect(redirectUrl)
  }

  // If user is authenticated and trying to access auth pages, redirect to dashboard
  if (user && (request.nextUrl.pathname.startsWith('/auth/login') || request.nextUrl.pathname.startsWith('/auth/register'))) {
    console.log('🔄 Redirecting authenticated user from auth page to dashboard')
    const redirectUrl = new URL('/dashboard', request.url)
    return NextResponse.redirect(redirectUrl)
  }

  // If user is authenticated and visiting the home page, redirect to dashboard
  if (user && request.nextUrl.pathname === '/') {
    const redirectUrl = new URL('/dashboard', request.url)
    return NextResponse.redirect(redirectUrl)
  }

  // Allow unauthenticated users to access the home page
  if (!user && request.nextUrl.pathname === '/') {
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
