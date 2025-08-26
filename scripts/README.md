# Scripts Directory

This directory contains utility scripts for development and testing the SimplyTodo application.

## Available Scripts

### `test-supabase-env.js`

Tests your Supabase environment configuration from the `.env.local` file.

**Usage:**
```bash
node scripts/test-supabase-env.js
```

**What it tests:**
- ✅ Environment variables are present
- ✅ Supabase URL format is correct
- ✅ API key is valid JWT format
- ✅ API connection works
- ✅ Google OAuth is enabled
- ✅ Email authentication is enabled

**Example output:**
```
🔍 Testing Supabase Environment Variables...

📋 Environment Variables:
✅ Supabase URL: https://your-project.supabase.co
✅ Supabase Key: ...
✅ Key Length: 208

✅ Environment variables look good!

🌐 Testing API Connection...
✅ API Connection Successful!
Status: 200
Response: {
  "external": {
    "google": true,
    "email": true,
    ...
  }
}

🎉 All tests passed! Your Supabase configuration is working correctly.
```

**When to use:**
- After updating `.env.local` file
- To verify Supabase connection
- Before testing authentication features
- Troubleshooting authentication issues

### `create-test-user.js`

Creates or verifies the test user account for development and testing.

**Usage:**
```bash
# Use default test credentials
node scripts/create-test-user.js

# Use custom credentials
node scripts/create-test-user.js your-email@example.com your-password
```

**What it does:**
- ✅ Creates test user with specified email and password
- ✅ Defaults to email: `test@example.com` and password: `test-password`
- ✅ Handles existing user scenarios
- ✅ Tests sign-in functionality
- ✅ Shows user ID and email confirmation status

**Parameters:**
- **Email** (optional): User email address (default: test@example.com)
- **Password** (optional): User password (default: test-password)

**When to use:**
- Setting up development environment
- Testing authentication flow
- Verifying user creation process
- Before testing the application

### `test-prod-auth.js`

Tests authentication against the production Supabase instance.

**Usage:**
```bash
# Use default test credentials
node scripts/test-prod-auth.js

# Use custom credentials
node scripts/test-prod-auth.js your-email@example.com your-password
```

**What it tests:**
- ✅ Production Supabase connection
- ✅ Test user authentication with specified credentials
- ✅ User creation if needed
- ✅ Login functionality

**Parameters:**
- **Email** (optional): User email address (default: test@example.com)
- **Password** (optional): User password (default: test-password)

**Production URL**: https://simply-todo-prod.vercel.app/

**When to use:**
- Before deploying to production
- Testing production authentication
- Verifying production user accounts
- Troubleshooting production auth issues

### `test-oauth.js`

Tests Google OAuth configuration and provider settings.

**Usage:**
```bash
node scripts/test-oauth.js
```

**What it tests:**
- ✅ Supabase auth settings endpoint
- ✅ Google OAuth provider status
- ✅ Email authentication status
- ✅ Other OAuth providers (Apple, GitHub, Facebook)
- ✅ Signup and email confirmation settings

**Example output:**
```
🔍 Testing Google OAuth Configuration...

✅ Environment variables loaded
📋 Supabase URL: https://your-project.supabase.co
📋 Supabase Key: ***dnMk

🌐 Testing Supabase Auth Settings...
✅ Auth settings retrieved successfully

📋 OAuth Provider Status:
🔵 Google OAuth: ✅ Enabled
🔵 Email Auth: ✅ Enabled
🔵 Apple: ❌ Disabled
🔵 GitHub: ❌ Disabled
🔵 Facebook: ❌ Disabled

✅ Google OAuth is properly configured!
🎯 You can test OAuth by:
1. Visit: https://simply-todo-prod.vercel.app/auth/login
2. Click "Continue with Google"
3. Complete the OAuth flow
```

**When to use:**
- Verifying OAuth provider configuration
- Troubleshooting Google OAuth issues
- Checking authentication settings
- Before testing OAuth functionality

## Adding New Scripts

When adding new scripts to this directory:

1. Make them executable: `chmod +x scripts/script-name.js`
2. Document them in this README
3. Test them thoroughly
4. Keep them focused on a single purpose

## Note

Scripts in this directory are excluded from git commits (see `.gitignore`).
This keeps your repository clean while providing useful development tools.
