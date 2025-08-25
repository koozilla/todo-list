'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function TestPage() {
  const [status, setStatus] = useState<string>('Testing connection...')
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    async function testConnection() {
      try {
        // Test basic connection
        const { data, error } = await supabase.from('tasks').select('count').limit(1)
        
        if (error) {
          setStatus(`❌ Connection failed: ${error.message}`)
          return
        }
        
        setStatus('✅ Supabase connection successful!')
        
        // Test auth
        const { data: { user: currentUser } } = await supabase.auth.getUser()
        setUser(currentUser)
        
      } catch (err) {
        setStatus(`❌ Error: ${err}`)
      }
    }

    testConnection()
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Supabase Connection Test</h1>
        
        <div className="space-y-4">
          <div className="p-3 bg-gray-100 rounded">
            <p className="text-sm text-gray-700">{status}</p>
          </div>
          
          {user && (
            <div className="p-3 bg-green-50 border border-green-200 rounded">
              <p className="text-sm text-green-800">
                <strong>User ID:</strong> {user.id}
              </p>
              <p className="text-sm text-green-800">
                <strong>Email:</strong> {user.email}
              </p>
            </div>
          )}
          
          <div className="text-xs text-gray-500">
            <p>• If connection fails, check your .env.local file</p>
            <p>• Make sure you've run the database setup SQL</p>
            <p>• Verify your Supabase project is active</p>
          </div>
        </div>
      </div>
    </div>
  )
}
