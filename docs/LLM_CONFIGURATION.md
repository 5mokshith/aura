# LLM Configuration Guide

This guide explains how to configure and switch between different LLM providers in AURA.

## Supported Providers

AURA supports multiple LLM providers:

1. **Google Gemini** (Recommended) - Fast, cost-effective, and powerful
2. **OpenAI GPT** - Industry standard with excellent performance
3. **Anthropic Claude** - Coming soon

## Current Configuration: Google Gemini 2.5 Flash

The application is currently configured to use **Google Gemini 2.5 Flash**, which offers:

- **Speed**: Extremely fast response times
- **Cost**: Very cost-effective compared to GPT-4
- **Quality**: High-quality responses for most tasks
- **Context**: Large context window (up to 1M tokens)
- **Multimodal**: Supports text, images, and more

## Environment Variables

### Google Gemini Configuration

```bash
# Set the provider
LLM_PROVIDER=gemini

# Gemini API Key (get from: https://aistudio.google.com/app/apikey)
GOOGLE_GEMINI_API_KEY=your_gemini_api_key_here

# Model selection
GOOGLE_GEMINI_MODEL=gemini-2.0-flash-exp

# Max output tokens
GEMINI_MAX_TOKENS=8192
```

### Available Gemini Models

- `gemini-2.0-flash-exp` - Latest experimental flash model (fastest, recommended)
- `gemini-1.5-flash` - Stable flash model
- `gemini-1.5-pro` - More capable but slower
- `gemini-1.0-pro` - Legacy model

##  Configuration (Alternative)

```bash
# Set the provider
LLM_PROVIDER=openai

  API Key
OPENAI_API_KEY=your_openai_api_key_here

# Model selection
OPENAI_MODEL=gpt-4-turbo-preview

# Max output tokens
OPENAI_MAX_TOKENS=4096
```

### Common Settings (All Providers)

```bash
# Temperature (0.0 - 2.0, higher = more creative)
LLM_TEMPERATURE=0.7

# Max retry attempts on failure
LLM_MAX_RETRIES=3

# Request timeout in milliseconds
LLM_TIMEOUT=30000
```

## Getting API Keys

### Google Gemini API Key

1. Go to [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Get API Key" or "Create API Key"
4. Copy the API key
5. Add it to your `.env.local` file:
   ```bash
   GOOGLE_GEMINI_API_KEY=AIza...your_key_here
   ```

##  API Key

1. Go to [OpenAI Platform](https://platform.openai.com/api-keys)
2. Sign in or create an account
3. Click "Create new secret key"
4. Copy the API key
5. Add it to your `.env.local` file:
   ```bash
   OPENAI_API_KEY=sk-...your_key_here
   ```

## Switching Providers

To switch between providers, simply update the `LLM_PROVIDER` environment variable:

```bash
# Use Gemini (current)
LLM_PROVIDER=gemini

# Use OpenAI
LLM_PROVIDER=openai
```

Then restart your development server:

```bash
npm run dev
```

## Implementation Details

The LLM client (`lib/llm/client.ts`) provides a unified interface that works with all providers:

### Chat Completion

```typescript
import { chatCompletion } from "@/lib/llm/client";

const response = await chatCompletion([
  { role: "system", content: "You are a helpful assistant." },
  { role: "user", content: "Hello!" },
]);

console.log(response.content);
```

### Streaming

```typescript
import { streamChatCompletion } from "@/lib/llm/client";

for await (const chunk of streamChatCompletion(messages)) {
  process.stdout.write(chunk);
}
```

### Command Parsing

```typescript
import { parseCommand } from "@/lib/llm/client";

const result = await parseCommand("Send an email to john@example.com");
console.log(result.intent); // "send_email"
console.log(result.parameters); // { to: "john@example.com" }
```

### Workflow Planning

```typescript
import { generateWorkflowPlan } from "@/lib/llm/client";

const plan = await generateWorkflowPlan("Summarize my emails and create a report");
console.log(plan.steps); // Array of workflow steps
```

## Provider Comparison

| Feature | Gemini 2.5 Flash | GPT-4 Turbo | Claude 3 Opus |
|---------|------------------|-------------|---------------|
| Speed | ⚡⚡⚡ Very Fast | ⚡⚡ Fast | ⚡⚡ Fast |
| Cost | 💰 Very Low | 💰💰💰 High | 💰💰 Medium |
| Quality | ⭐⭐⭐⭐ Excellent | ⭐⭐⭐⭐⭐ Best | ⭐⭐⭐⭐⭐ Best |
| Context | 1M tokens | 128K tokens | 200K tokens |
| Multimodal | ✅ Yes | ✅ Yes | ✅ Yes |

## Cost Considerations

### Gemini 2.5 Flash Pricing (as of 2024)

- **Input**: $0.075 per 1M tokens
- **Output**: $0.30 per 1M tokens
- **Free tier**: 15 requests per minute

##  GPT-4 Turbo Pricing

- **Input**: $10 per 1M tokens
- **Output**: $30 per 1M tokens

**Gemini is ~133x cheaper than GPT-4 Turbo!**

## Performance Optimization

### Caching

The application uses SWR for API response caching, which reduces LLM calls:

```typescript
// Cached for 5 minutes
const { data } = useSWR("/api/workflow/plan", fetcher);
```

### Streaming

For long responses, use streaming to improve perceived performance:

```typescript
const stream = streamChatCompletion(messages);
// Display chunks as they arrive
```

### Temperature Tuning

Adjust temperature based on use case:

- **0.0-0.3**: Deterministic, factual responses (data analysis)
- **0.4-0.7**: Balanced creativity and accuracy (general use)
- **0.8-1.0**: Creative, varied responses (content generation)

## Troubleshooting

### "API key not found" Error

Make sure your `.env.local` file has the correct API key:

```bash
# For Gemini
GOOGLE_GEMINI_API_KEY=AIza...

# For OpenAI
OPENAI_API_KEY=sk-...
```

Restart the dev server after updating environment variables.

### Rate Limit Errors

**Gemini Free Tier**: 15 requests per minute

**Solution**: 
- Upgrade to paid tier
- Implement request queuing
- Use caching to reduce calls

### Timeout Errors

Increase the timeout in `.env.local`:

```bash
LLM_TIMEOUT=60000  # 60 seconds
```

### Model Not Found

Ensure you're using a valid model name:

```bash
# Valid Gemini models
GOOGLE_GEMINI_MODEL=gemini-2.0-flash-exp
GOOGLE_GEMINI_MODEL=gemini-1.5-flash
GOOGLE_GEMINI_MODEL=gemini-1.5-pro

# Valid OpenAI models
OPENAI_MODEL=gpt-4-turbo-preview
OPENAI_MODEL=gpt-4
OPENAI_MODEL=gpt-3.5-turbo
```

## Best Practices

1. **Use Gemini for most tasks** - It's fast and cost-effective
2. **Cache responses** - Reduce API calls with SWR
3. **Stream long responses** - Better UX for users
4. **Set appropriate timeouts** - Prevent hanging requests
5. **Monitor usage** - Track API costs in provider dashboard
6. **Handle errors gracefully** - Implement retry logic
7. **Use system prompts** - Guide model behavior consistently

## Migration Guide

### From OpenAI to Gemini

1. Get a Gemini API key from [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Update `.env.local`:
   ```bash
   LLM_PROVIDER=gemini
   GOOGLE_GEMINI_API_KEY=your_key_here
   GOOGLE_GEMINI_MODEL=gemini-2.0-flash-exp
   ```
3. Restart the server: `npm run dev`
4. Test your workflows

No code changes required! The unified client handles the switch automatically.

## Resources

- [Google Gemini Documentation](https://ai.google.dev/docs)
- [OpenAI API Documentation](https://platform.openai.com/docs)
- [Gemini API Pricing](https://ai.google.dev/pricing)
- [OpenAI Pricing](https://openai.com/pricing)

## Support

For issues or questions:
1. Check the troubleshooting section above
2. Review the provider's documentation
3. Check API status pages
4. Contact support if needed

