# Quick Start: Google Gemini 2.5 Flash Setup

This guide will get you up and running with Google Gemini 2.5 Flash in under 5 minutes.

## Why Gemini 2.5 Flash?

- ⚡ **133x cheaper** than GPT-4 Turbo
- 🚀 **Extremely fast** response times
- 🎯 **High quality** responses
- 📊 **1M token** context window
- 🆓 **Free tier** available (15 req/min)

## Setup Steps

### 1. Get Your API Key (2 minutes)

1. Go to [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Sign in with your Google account
3. Click **"Get API Key"** or **"Create API Key"**
4. Copy the API key (starts with `AIza...`)

### 2. Configure Environment (1 minute)

Open your `.env.local` file and add:

```bash
# Set Gemini as the provider
LLM_PROVIDER=gemini

# Add your API key
GOOGLE_GEMINI_API_KEY=AIza...your_key_here

# Use the latest flash model
GOOGLE_GEMINI_MODEL=gemini-2.0-flash-exp

# Set max tokens
GEMINI_MAX_TOKENS=8192
```

### 3. Restart Server (30 seconds)

```bash
# Stop the current server (Ctrl+C)
# Start it again
npm run dev
```

### 4. Test It! (1 minute)

1. Open http://localhost:3000
2. Try a command like: "Summarize my emails from today"
3. Watch Gemini work its magic! ✨

## That's It!

You're now using Google Gemini 2.5 Flash. The application will automatically use Gemini for all LLM operations.

## Verify It's Working

Check the server console logs. You should see:
```
Using LLM provider: gemini
Model: gemini-2.0-flash-exp
```

## Cost Comparison

### Example: 1000 workflow executions per month

**With Gemini 2.5 Flash:**
- Input: 1M tokens × $0.075 = $0.075
- Output: 500K tokens × $0.30 = $0.15
- **Total: ~$0.23/month** 💰

**With GPT-4 Turbo:**
- Input: 1M tokens × $10 = $10
- Output: 500K tokens × $30 = $15
- **Total: ~$25/month** 💸

**Savings: $24.77/month (99% cheaper!)**

## Free Tier Limits

Gemini offers a generous free tier:
- **15 requests per minute**
- **1,500 requests per day**
- **1M tokens per request**

Perfect for development and small-scale production!

## Troubleshooting

### "API key not found"
- Make sure you added `GOOGLE_GEMINI_API_KEY` to `.env.local`
- Restart the dev server

### "Rate limit exceeded"
- You hit the free tier limit (15 req/min)
- Wait a minute or upgrade to paid tier

### "Model not found"
- Check your model name: `gemini-2.0-flash-exp`
- Try `gemini-1.5-flash` if experimental model is unavailable

## Next Steps

- Read the full [LLM Configuration Guide](./LLM_CONFIGURATION.md)
- Explore [Performance Optimizations](./PERFORMANCE_OPTIMIZATIONS.md)
- Check out the [Complete Setup Guide](./COMPLETE_SETUP_GUIDE.md)

## Need Help?

- [Google Gemini Documentation](https://ai.google.dev/docs)
- [Gemini API Pricing](https://ai.google.dev/pricing)
- [Google AI Studio](https://aistudio.google.com)

---

**Pro Tip**: Gemini 2.5 Flash is perfect for production use. It's fast, cheap, and high-quality. You can always switch to GPT-4 later if needed by changing `LLM_PROVIDER=openai` in your `.env.local` file.

