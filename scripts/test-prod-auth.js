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

async function testProductionAuth() {
  console.log('🔧 Testing production authentication...');
  
  // Read environment variables
  const envPath = path.join(__dirname, '..', '.env.local');
  const env = parseEnvFile(envPath);
  
  const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Missing Supabase environment variables');
    return;
  }
  
  console.log('✅ Environment variables loaded');
  console.log('📋 Supabase URL:', supabaseUrl);
  console.log('📋 Supabase Key:', '***' + supabaseKey.substring(supabaseKey.length - 4));
  
  try {
    // Import Supabase client
    const { createClient } = await import('@supabase/supabase-js');
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Test credentials
    const testEmail = 'test@example.com';
    const testPassword = '123.123';
    
    console.log('\n🔐 Testing login with production credentials...');
    console.log('📧 Email:', testEmail);
    console.log('🔑 Password:', testPassword);
    
    // Test connection first
    console.log('\n🌐 Testing Supabase connection...');
    const { data: healthData, error: healthError } = await supabase
      .from('_supabase_health_check')
      .select('*')
      .limit(1);
    
    if (healthError && !healthError.message.includes('relation "_supabase_health_check" does not exist')) {
      console.log('⚠️  Health check failed (this is normal):', healthError.message);
    } else {
      console.log('✅ Supabase connection is working');
    }
    
    // Try to sign in
    const { data, error } = await supabase.auth.signInWithPassword({
      email: testEmail,
      password: testPassword,
    });
    
    if (error) {
      console.error('❌ Login failed:', error.message);
      
      if (error.message.includes('Invalid login credentials')) {
        console.log('\n💡 Possible solutions:');
        console.log('1. The user might not exist in the production Supabase project');
        console.log('2. The production environment might be using different Supabase credentials');
        console.log('3. Try creating a new user through the registration page');
        
        console.log('\n🔧 Let\'s try to create the user...');
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
          email: testEmail,
          password: testPassword,
        });
        
        if (signUpError) {
          console.error('❌ Registration failed:', signUpError.message);
        } else {
          console.log('✅ User created successfully!');
          console.log('👤 User ID:', signUpData.user?.id);
          console.log('📧 Email:', signUpData.user?.email);
        }
      }
    } else {
      console.log('✅ Login successful!');
      console.log('👤 User ID:', data.user?.id);
      console.log('📧 Email:', data.user?.email);
    }
    
  } catch (err) {
    console.error('❌ Error:', err.message);
  }
}

// Run the script
testProductionAuth().catch(console.error);