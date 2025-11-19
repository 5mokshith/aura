# 🚀 Quick Start - Supabase Integration

Get AURA running with Supabase in 10 minutes!

## ✅ Prerequisites

- [ ] Node.js installed
- [ ] Google OAuth credentials ready
- [ ] Supabase account created

## 📝 Step-by-Step

### 1. Create Supabase Project (3 min)
```
1. Go to https://app.supabase.com
2. Click "New Project"
3. Name: aura-app
4. Generate strong password
5. Choose region
6. Click "Create"
```

### 2. Get API Keys (1 min)
```
1. Go to Settings → API
2. Copy:
   - Project URL
   - anon public key
   - service_role key
```

### 3. Update .env.local (1 min)
```bash
# Copy from .env.local.example
cp .env.local.example .env.local

# Edit .env.local and add:
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=REDACTED
SUPABASE_SERVICE_ROLE_KEY=REDACTED
```

### 4. Run Database Migrations (2 min)
```
1. Go to Supabase → SQL Editor
2. Click "New Query"
3. Copy content from: supabase/migrations/001_initial_schema.sql
4. Paste and click "Run"
5. Click "New Query" again
6. Copy content from: supabase/migrations/002_add_google_oauth_tokens.sql
7. Paste and click "Run"
```

### 5. Configure Google OAuth (2 min)
```
1. Supabase → Authentication → Providers
2. Enable Google
3. Add your Google OAuth credentials:
   Client ID: 
   Client Secret: 
4. Click "Save"
```

### 6. Add Redirect URLs (1 min)
```
Google Cloud Console:
1. Go to APIs & Services → Credentials
2. Add redirect URI: http://localhost:3000/auth/callback
3. Add redirect URI: https://your-project.supabase.co/auth/v1/callback

Supabase:
1. Authentication → URL Configuration
2. Add: http://localhost:3000/auth/callback
3. Site URL: http://localhost:3000
```

### 7. Start Development Server (1 min)
```bash
npm install
npm run dev
```

### 8. Test Authentication (1 min)
```
1. Visit http://localhost:3000
2. Click "Sign in with Google"
3. Grant permissions
4. Should redirect to dashboard
```

## ✅ Verification Checklist

After setup, verify:

- [ ] Can sign in with Google
- [ ] User info displays correctly
- [ ] Can sign out
- [ ] Tokens stored in database (check Supabase → Table Editor → oauth_tokens)
- [ ] No console errors

## 🐛 Quick Troubleshooting

**"Invalid API key"**
```bash
# Restart dev server
npm run dev
```

**"Redirect URI mismatch"**
```
Check both:
- Google Cloud Console redirect URIs
- Supabase Authentication → URL Configuration
```

**"Failed to fetch"**
```
- Check Supabase project is active
- Verify .env.local has correct values
- Check browser console for errors
```

## 📚 Next Steps

1. **Read full guide**: `docs/COMPLETE_SETUP_GUIDE.md`
2. **Migrate components**: `docs/MIGRATION_CHECKLIST.md`
3. **Review architecture**: `docs/SUPABASE_ARCHITECTURE.md`

## 🎯 What You Get

✅ Google OAuth authentication
✅ Secure token storage
✅ Automatic token refresh
✅ Database with RLS
✅ Type-safe queries
✅ Ready for Google Workspace APIs

## 💡 Quick Tips

- **Development**: Use http://localhost:3000
- **Tokens**: Auto-refresh before expiry
- **Database**: All queries are type-safe
- **Security**: RLS protects user data
- **Debugging**: Check Supabase logs

## 🔗 Useful Commands

```bash
# Start dev server
npm run dev

# Check for errors
npm run build

# Generate types (after schema changes)
npx supabase gen types typescript --project-id YOUR_PROJECT_ID > lib/supabase/database.types.ts
```

## 📞 Need Help?

- **Setup issues**: Check `docs/COMPLETE_SETUP_GUIDE.md`
- **Migration help**: Check `docs/MIGRATION_CHECKLIST.md`
- **Supabase docs**: https://supabase.com/docs
- **Discord**: https://discord.supabase.com

---

**Ready?** Start with Step 1! 🚀

