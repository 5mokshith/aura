# 🚀 AURA Setup Checklist

Use this checklist to get AURA up and running quickly.

## ✅ Prerequisites

- [ ] Node.js 20+ installed
- [ ] npm installed
- [ ] Google account (for Gemini API)
- [ ] Supabase account (optional for local dev)

## ✅ Installation

- [ ] Clone the repository
- [ ] Run `npm install`
- [ ] Copy `.env.example` to `.env.local`

## ✅ LLM Configuration (Gemini - Recommended)

- [ ] Visit [Google AI Studio](https://aistudio.google.com/app/apikey)
- [ ] Sign in and create API key
- [ ] Copy API key (starts with `AIza...`)
- [ ] Add to `.env.local`:
  ```bash
  LLM_PROVIDER=gemini
  GOOGLE_GEMINI_API_KEY=AIza...your_key_here
  GOOGLE_GEMINI_MODEL=gemini-2.0-flash-exp
  ```

**📖 Detailed Guide**: [Gemini Setup](./docs/GEMINI_SETUP.md)

## ✅ Supabase Configuration

- [ ] Create Supabase project at [supabase.com](https://supabase.com)
- [ ] Get project URL and keys from Settings > API
- [ ] Add to `.env.local`:
  ```bash
  NEXT_PUBLIC_SUPABASE_URL=your_project_url
  NEXT_PUBLIC_SUPABASE_ANON_KEY=REDACTED
  SUPABASE_SERVICE_ROLE_KEY=REDACTED
  ```

**📖 Detailed Guide**: [Supabase Quickstart](./docs/SUPABASE_QUICKSTART.md)

## ✅ Google OAuth Configuration

- [ ] Create Google Cloud Project
- [ ] Enable Google Workspace APIs
- [ ] Create OAuth 2.0 credentials
- [ ] Add to `.env.local`:
  ```bash
  GOOGLE_CLIENT_ID=your_client_id
  GOOGLE_CLIENT_SECRET=REDACTED
  ```
- [ ] Configure in Supabase: Authentication > Providers > Google

**📖 Detailed Guide**: [Complete Setup Guide](./docs/COMPLETE_SETUP_GUIDE.md)

## ✅ Start Development Server

- [ ] Run `npm run dev`
- [ ] Open http://localhost:3000
- [ ] Verify no errors in console

## ✅ Test Basic Functionality

- [ ] Can access the homepage
- [ ] Can see the UI components
- [ ] No console errors

## ✅ Test LLM Integration (Optional)

- [ ] Try a simple workflow command
- [ ] Verify Gemini is responding
- [ ] Check console logs for "Using LLM provider: gemini"

## 🎯 Quick Start Paths

### Path 1: Just Want to See the UI (5 minutes)
1. ✅ Install dependencies
2. ✅ Copy `.env.example` to `.env.local`
3. ✅ Run `npm run dev`
4. ✅ Open http://localhost:3000

**Note**: Some features won't work without API keys, but you can explore the UI.

### Path 2: Full Setup with Gemini (15 minutes)
1. ✅ Install dependencies
2. ✅ Get Gemini API key
3. ✅ Configure `.env.local`
4. ✅ Run `npm run dev`
5. ✅ Test workflows

**Guide**: [Gemini Setup](./docs/GEMINI_SETUP.md)

### Path 3: Production Setup (30-60 minutes)
1. ✅ Install dependencies
2. ✅ Get Gemini API key
3. ✅ Set up Supabase
4. ✅ Configure Google OAuth
5. ✅ Configure all environment variables
6. ✅ Run `npm run dev`
7. ✅ Test all features

**Guide**: [Complete Setup Guide](./docs/COMPLETE_SETUP_GUIDE.md)

## 📚 Documentation

### Quick Start
- [Gemini Setup (5 min)](./docs/GEMINI_SETUP.md)
- [Supabase Quickstart](./docs/SUPABASE_QUICKSTART.md)

### Detailed Guides
- [Complete Setup Guide](./docs/COMPLETE_SETUP_GUIDE.md)
- [LLM Configuration](./docs/LLM_CONFIGURATION.md)
- [Performance Optimizations](./docs/PERFORMANCE_OPTIMIZATIONS.md)

### Reference
- [Environment Variables](./.env.example)
- [README](./README.md)

## 🆘 Troubleshooting

### Server won't start
- Check Node.js version: `node --version` (should be 20+)
- Delete `node_modules` and run `npm install` again
- Check for port conflicts (default: 3000)

### "API key not found" errors
- Verify `.env.local` exists
- Check API key format (Gemini keys start with `AIza...`)
- Restart the dev server after changing `.env.local`

### Supabase connection errors
- Verify Supabase URL and keys
- Check Supabase project is active
- Verify network connectivity

### Google OAuth not working
- Check OAuth credentials in Google Cloud Console
- Verify redirect URIs are configured
- Check Supabase Google provider settings

## 💡 Pro Tips

1. **Start Simple**: Get Gemini working first, then add other features
2. **Use Free Tiers**: Gemini and Supabase both have generous free tiers
3. **Check Logs**: Console logs are your friend for debugging
4. **Read Docs**: We have detailed guides for everything
5. **Ask for Help**: Check documentation or reach out if stuck

## 🎉 Success Criteria

You're ready to go when:

- ✅ Server starts without errors
- ✅ Can access http://localhost:3000
- ✅ UI loads correctly
- ✅ Gemini API is responding (if configured)
- ✅ No console errors

## 🚀 Next Steps

Once setup is complete:

1. Explore the UI and features
2. Try some workflow commands
3. Read the [Performance Optimizations](./docs/PERFORMANCE_OPTIMIZATIONS.md) guide
4. Customize for your needs
5. Deploy to production (when ready)

---

**Need Help?**
- 📖 Check the [documentation](./docs/)
- 🔍 Search for error messages
- 💬 Review troubleshooting section above

**Happy Building! 🎉**

