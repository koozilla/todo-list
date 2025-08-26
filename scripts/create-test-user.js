#!/usr/bin/env node

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

async function createTestUser() {
  console.log('🔧 Creating test user...');
  
  // Parse command line arguments
  const args = process.argv.slice(2);
  const testEmail = args[0] || 'test@example.com';
  const testPassword = args[1] || 'test-password';
  
  console.log('📧 Email:', testEmail);
  console.log('🔑 Password:', testPassword);
  
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
    
    console.log('\n🔐 Attempting to create test user...');
    console.log('📧 Email:', testEmail);
    console.log('🔑 Password:', testPassword);
    
    // Try to sign up the test user
    const { data, error } = await supabase.auth.signUp({
      email: testEmail,
      password: testPassword,
    });
    
    if (error) {
      if (error.message.includes('already registered')) {
        console.log('✅ Test user already exists!');
        console.log('🔍 Attempting to sign in...');
        
        // Try to sign in
        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
          email: testEmail,
          password: testPassword,
        });
        
        if (signInError) {
          console.error('❌ Sign in failed:', signInError.message);
        } else {
          console.log('✅ Sign in successful!');
          console.log('👤 User ID:', signInData.user?.id);
          console.log('📧 Email:', signInData.user?.email);
        }
      } else {
        console.error('❌ Registration failed:', error.message);
      }
    } else {
      console.log('✅ Test user created successfully!');
      console.log('👤 User ID:', data.user?.id);
      console.log('📧 Email:', data.user?.email);
      
      if (data.user && !data.user.email_confirmed_at) {
        console.log('⚠️  Note: Email confirmation may be required');
        console.log('   Check your Supabase dashboard for email confirmation settings');
      }
    }
    
  } catch (err) {
    console.error('❌ Error:', err.message);
  }
}

// Run the script
createTestUser().catch(console.error);
