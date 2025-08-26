#!/usr/bin/env node

/**
 * Script to test Google OAuth configuration and functionality
 * Run with: node scripts/test-oauth.js
 */

const fs = require('fs');
const path = require('path');

// Parse .env.local file
function parseEnvFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const env = {};
    
    content.split('\n').forEach(line => {
      const trimmedLine = line.trim();
      if (trimmedLine && !trimmedLine.startsWith('#')) {
        const [key, ...valueParts] = trimmedLine.split('=');
        if (key && valueParts.length > 0) {
          env[key.trim()] = valueParts.join('=').trim();
        }
      }
    });
    
    return env;
  } catch (error) {
    console.error('Error reading .env.local file:', error.message);
    return {};
  }
}

async function testOAuth() {
  console.log('🔍 Testing Google OAuth Configuration...\n');
  
  // Read environment variables
  const envPath = path.join(__dirname, '..', '.env.local');
  const env = parseEnvFile(envPath);
  
  const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Missing Supabase environment variables');
    console.log('Make sure .env.local contains:');
    console.log('- NEXT_PUBLIC_SUPABASE_URL');
    console.log('- NEXT_PUBLIC_SUPABASE_ANON_KEY');
    return;
  }
  
  console.log('✅ Environment variables loaded');
  console.log('📋 Supabase URL:', supabaseUrl);
  console.log('📋 Supabase Key:', '***' + supabaseKey.substring(supabaseKey.length - 4));
  
  try {
    // Import Supabase client
    const { createClient } = await import('@supabase/supabase-js');
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    console.log('\n🌐 Testing Supabase Auth Settings...');
    
    // Test auth settings endpoint
    const response = await fetch(`${supabaseUrl}/auth/v1/settings`, {
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`
      }
    });
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Auth settings retrieved successfully');
      
      // Check OAuth providers
      const external = data.external || {};
      console.log('\n📋 OAuth Provider Status:');
      console.log('🔵 Google OAuth:', external.google ? '✅ Enabled' : '❌ Disabled');
      console.log('🔵 Email Auth:', external.email ? '✅ Enabled' : '❌ Disabled');
      console.log('🔵 Apple:', external.apple ? '✅ Enabled' : '❌ Disabled');
      console.log('🔵 GitHub:', external.github ? '✅ Enabled' : '❌ Disabled');
      console.log('🔵 Facebook:', external.facebook ? '✅ Enabled' : '❌ Disabled');
      
      if (external.google) {
        console.log('\n✅ Google OAuth is properly configured!');
        console.log('🎯 You can test OAuth by:');
        console.log('1. Visit: https://simply-todo-prod.vercel.app/auth/login');
        console.log('2. Click "Continue with Google"');
        console.log('3. Complete the OAuth flow');
      } else {
        console.log('\n❌ Google OAuth is not enabled');
        console.log('💡 To enable Google OAuth:');
        console.log('1. Go to Supabase Dashboard → Authentication → Providers');
        console.log('2. Enable Google provider');
        console.log('3. Add your Google OAuth credentials');
      }
      
      // Check signup settings
      console.log('\n📋 Authentication Settings:');
      console.log('🔵 Signup Disabled:', data.disable_signup ? '❌ Yes' : '✅ No');
      console.log('🔵 Email Auto-confirm:', data.mailer_autoconfirm ? '✅ Yes' : '❌ No');
      
    } else {
      const errorText = await response.text();
      console.log('❌ Failed to retrieve auth settings');
      console.log('Status:', response.status);
      console.log('Error:', errorText);
    }
    
    console.log('\n🔗 OAuth Testing URLs:');
    console.log('🌐 Production App: https://simply-todo-prod.vercel.app/auth/login');
    console.log('🏠 Local Development: http://localhost:3000/auth/login');
    console.log('📱 OAuth Callback: https://simply-todo-prod.vercel.app/auth/callback');
    
  } catch (err) {
    console.error('❌ Error:', err.message);
  }
}

// Run the script
testOAuth().catch(console.error);
