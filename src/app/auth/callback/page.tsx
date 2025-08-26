'use client'

import { useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createBrowserClient } from '@supabase/ssr'

function AuthCallbackContent() {
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const handleAuthCallback = async () => {
      console.log('🔄 Client-side OAuth callback handling')
      
      const code = searchParams.get('code')
      const error = searchParams.get('error')
      
      console.log('🔍 Callback params:', { code: !!code, error })

      if (error) {
        console.log('❌ OAuth error:', error)
        router.push('/auth/login?error=oauth_failed')
        return
      }

      if (code) {
        try {
          // Use browser client for proper cookie handling
          const browserClient = createBrowserClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
          )

          console.log('🔄 Exchanging code for session...')
          const { data, error: exchangeError } = await browserClient.auth.exchangeCodeForSession(code)
          
          console.log('🔍 Exchange result:', {
            hasData: !!data,
            hasSession: !!data?.session,
            hasUser: !!data?.user,
            userEmail: data?.user?.email,
            hasError: !!exchangeError,
            errorMessage: exchangeError?.message
          })
          
          if (!exchangeError && data?.session) {
            console.log('✅ OAuth success, redirecting to dashboard')
            // Successfully authenticated, redirect to dashboard
            router.push('/dashboard')
          } else {
            console.log('❌ OAuth exchange failed:', exchangeError?.message)
            router.push('/auth/login?error=oauth_exchange_failed')
          }
        } catch (err) {
          console.error('❌ OAuth callback error:', err)
          router.push('/auth/login?error=oauth_callback_failed')
        }
      } else {
        console.log('❌ No code provided')
        router.push('/auth/login?error=no_code')
      }
    }

    handleAuthCallback()
  }, [router, searchParams])

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent mx-auto"></div>
        <p className="mt-4 text-gray-600 dark:text-gray-300">Completing sign in...</p>
      </div>
    </div>
  )
}

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-300">Loading...</p>
        </div>
      </div>
    }>
      <AuthCallbackContent />
    </Suspense>
  )
}
