# Scripts Directory

This directory contains utility scripts for development and testing.

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

🎉 All tests passed! Your Supabase configuration is working correctly.
```

**When to use:**
- After updating `.env.local` file
- To verify Supabase connection
- Before testing Google OAuth
- Troubleshooting authentication issues

## Adding New Scripts

When adding new scripts to this directory:

1. Make them executable: `chmod +x scripts/script-name.js`
2. Document them in this README
3. Test them thoroughly
4. Keep them focused on a single purpose

## Note

Scripts in this directory are excluded from git commits (see `.gitignore`).
This keeps your repository clean while providing useful development tools.
