#!/usr/bin/env node

/**
 * Simple script to test Supabase environment variables
 * Run with: node scripts/test-supabase-env.js
 */

const fs = require('fs')
const path = require('path')

// Simple .env file parser
function parseEnvFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8')
    const env = {}
    
    content.split('\n').forEach(line => {
      const trimmed = line.trim()
      if (trimmed && !trimmed.startsWith('#')) {
        const [key, ...valueParts] = trimmed.split('=')
        if (key && valueParts.length > 0) {
          env[key] = valueParts.join('=').trim()
        }
      }
    })
    
    return env
  } catch (error) {
    console.error('❌ Error reading .env.local file:', error.message)
    return {}
  }
}

async function testSupabaseEnv() {
  console.log('🔍 Testing Supabase Environment Variables...\n')
  
  // Load environment variables from .env.local (go up one directory from scripts/)
  const envPath = path.join(__dirname, '..', '.env.local')
  const env = parseEnvFile(envPath)
  
  // Check environment variables
  const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  
  console.log('📋 Environment Variables:')
  console.log('✅ Supabase URL:', supabaseUrl || '❌ MISSING')
  console.log('✅ Supabase Key:', supabaseKey ? `${supabaseKey.substring(0, 20)}...` : '❌ MISSING')
  console.log('✅ Key Length:', supabaseKey ? supabaseKey.length : 'N/A')
  
  if (!supabaseUrl || !supabaseKey) {
    console.log('\n❌ Missing required environment variables!')
    console.log('Make sure your .env.local file contains:')
    console.log('NEXT_PUBLIC_SUPABASE_URL=your_url')
    console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key')
    process.exit(1)
  }
  
  // Validate URL format
  if (!supabaseUrl.match(/^https:\/\/.*\.supabase\.co$/)) {
    console.log('\n❌ Invalid Supabase URL format!')
    console.log('Expected: https://project-id.supabase.co')
    console.log('Got:', supabaseUrl)
    process.exit(1)
  }
  
  // Validate JWT format
  const jwtParts = supabaseKey.split('.')
  if (jwtParts.length !== 3) {
    console.log('\n❌ Invalid JWT format!')
    console.log('Expected 3 parts separated by dots')
    console.log('Got:', jwtParts.length, 'parts')
    process.exit(1)
  }
  
  console.log('\n✅ Environment variables look good!')
  
  // Test API connection
  console.log('\n🌐 Testing API Connection...')
  
  try {
    const response = await fetch(`${supabaseUrl}/auth/v1/settings`, {
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`
      }
    })
    
    if (response.ok) {
      const data = await response.json()
      console.log('✅ API Connection Successful!')
      console.log('Status:', response.status)
      console.log('Response:', JSON.stringify(data, null, 2))
    } else {
      const errorText = await response.text()
      console.log('❌ API Connection Failed!')
      console.log('Status:', response.status)
      console.log('Error:', errorText)
      
      if (response.status === 401) {
        console.log('\n🔑 This usually means:')
        console.log('1. Your API key is incorrect')
        console.log('2. Your API key has expired')
        console.log('3. You copied the wrong key from Supabase')
        console.log('\n💡 Go to Supabase Dashboard → Settings → API')
        console.log('   Copy the "anon public" key (not service role)')
      }
      
      process.exit(1)
    }
    
  } catch (error) {
    console.log('❌ Network Error:', error.message)
    console.log('\n💡 Check your internet connection and try again')
    process.exit(1)
  }
  
  console.log('\n🎉 All tests passed! Your Supabase configuration is working correctly.')
}

// Run the test
testSupabaseEnv().catch(error => {
  console.error('❌ Test failed with error:', error)
  process.exit(1)
})
