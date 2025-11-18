#***REMOVED***Quick***REMOVED***Start:***REMOVED***Google***REMOVED***Gemini***REMOVED***2.5***REMOVED***Flash***REMOVED***Setup

This***REMOVED***guide***REMOVED***will***REMOVED***get***REMOVED***you***REMOVED***up***REMOVED***and***REMOVED***running***REMOVED***with***REMOVED***Google***REMOVED***Gemini***REMOVED***2.5***REMOVED***Flash***REMOVED***in***REMOVED***under***REMOVED***5***REMOVED***minutes.

##***REMOVED***Why***REMOVED***Gemini***REMOVED***2.5***REMOVED***Flash?

-***REMOVED***⚡***REMOVED*****133x***REMOVED***cheaper*****REMOVED***than***REMOVED***GPT-4***REMOVED***Turbo
-***REMOVED***🚀***REMOVED*****Extremely***REMOVED***fast*****REMOVED***response***REMOVED***times
-***REMOVED***🎯***REMOVED*****High***REMOVED***quality*****REMOVED***responses
-***REMOVED***📊***REMOVED*****1M***REMOVED***token*****REMOVED***context***REMOVED***window
-***REMOVED***🆓***REMOVED*****Free***REMOVED***tier*****REMOVED***available***REMOVED***(15***REMOVED***req/min)

##***REMOVED***Setup***REMOVED***Steps

###***REMOVED***1.***REMOVED***Get***REMOVED***Your***REMOVED***API***REMOVED***Key***REMOVED***(2***REMOVED***minutes)

1.***REMOVED***Go***REMOVED***to***REMOVED***[Google***REMOVED***AI***REMOVED***Studio](https://aistudio.google.com/app/apikey)
2.***REMOVED***Sign***REMOVED***in***REMOVED***with***REMOVED***your***REMOVED***Google***REMOVED***account
3.***REMOVED***Click***REMOVED*****"Get***REMOVED***API***REMOVED***Key"*****REMOVED***or***REMOVED*****"Create***REMOVED***API***REMOVED***Key"**
4.***REMOVED***Copy***REMOVED***the***REMOVED***API***REMOVED***key***REMOVED***(starts***REMOVED***with***REMOVED***`AIza...`)

###***REMOVED***2.***REMOVED***Configure***REMOVED***Environment***REMOVED***(1***REMOVED***minute)

Open***REMOVED***your***REMOVED***`.env.local`***REMOVED***file***REMOVED***and***REMOVED***add:

```bash
#***REMOVED***Set***REMOVED***Gemini***REMOVED***as***REMOVED***the***REMOVED***provider
LLM_PROVIDER=gemini

#***REMOVED***Add***REMOVED***your***REMOVED***API***REMOVED***key
GOOGLE_GEMINI_API_KEY=AIza...your_key_here

#***REMOVED***Use***REMOVED***the***REMOVED***latest***REMOVED***flash***REMOVED***model
GOOGLE_GEMINI_MODEL=gemini-2.0-flash-exp

#***REMOVED***Set***REMOVED***max***REMOVED***tokens
GEMINI_MAX_TOKENS=8192
```

###***REMOVED***3.***REMOVED***Restart***REMOVED***Server***REMOVED***(30***REMOVED***seconds)

```bash
#***REMOVED***Stop***REMOVED***the***REMOVED***current***REMOVED***server***REMOVED***(Ctrl+C)
#***REMOVED***Start***REMOVED***it***REMOVED***again
npm***REMOVED***run***REMOVED***dev
```

###***REMOVED***4.***REMOVED***Test***REMOVED***It!***REMOVED***(1***REMOVED***minute)

1.***REMOVED***Open***REMOVED***http://localhost:3000
2.***REMOVED***Try***REMOVED***a***REMOVED***command***REMOVED***like:***REMOVED***"Summarize***REMOVED***my***REMOVED***emails***REMOVED***from***REMOVED***today"
3.***REMOVED***Watch***REMOVED***Gemini***REMOVED***work***REMOVED***its***REMOVED***magic!***REMOVED***✨

##***REMOVED***That's***REMOVED***It!

You're***REMOVED***now***REMOVED***using***REMOVED***Google***REMOVED***Gemini***REMOVED***2.5***REMOVED***Flash.***REMOVED***The***REMOVED***application***REMOVED***will***REMOVED***automatically***REMOVED***use***REMOVED***Gemini***REMOVED***for***REMOVED***all***REMOVED***LLM***REMOVED***operations.

##***REMOVED***Verify***REMOVED***It's***REMOVED***Working

Check***REMOVED***the***REMOVED***server***REMOVED***console***REMOVED***logs.***REMOVED***You***REMOVED***should***REMOVED***see:
```
Using***REMOVED***LLM***REMOVED***provider:***REMOVED***gemini
Model:***REMOVED***gemini-2.0-flash-exp
```

##***REMOVED***Cost***REMOVED***Comparison

###***REMOVED***Example:***REMOVED***1000***REMOVED***workflow***REMOVED***executions***REMOVED***per***REMOVED***month

**With***REMOVED***Gemini***REMOVED***2.5***REMOVED***Flash:**
-***REMOVED***Input:***REMOVED***1M***REMOVED***tokens***REMOVED***×***REMOVED***$0.075***REMOVED***=***REMOVED***$0.075
-***REMOVED***Output:***REMOVED***500K***REMOVED***tokens***REMOVED***×***REMOVED***$0.30***REMOVED***=***REMOVED***$0.15
-***REMOVED*****Total:***REMOVED***~$0.23/month*****REMOVED***💰

**With***REMOVED***GPT-4***REMOVED***Turbo:**
-***REMOVED***Input:***REMOVED***1M***REMOVED***tokens***REMOVED***×***REMOVED***$10***REMOVED***=***REMOVED***$10
-***REMOVED***Output:***REMOVED***500K***REMOVED***tokens***REMOVED***×***REMOVED***$30***REMOVED***=***REMOVED***$15
-***REMOVED*****Total:***REMOVED***~$25/month*****REMOVED***💸

**Savings:***REMOVED***$24.77/month***REMOVED***(99%***REMOVED***cheaper!)**

##***REMOVED***Free***REMOVED***Tier***REMOVED***Limits

Gemini***REMOVED***offers***REMOVED***a***REMOVED***generous***REMOVED***free***REMOVED***tier:
-***REMOVED*****15***REMOVED***requests***REMOVED***per***REMOVED***minute**
-***REMOVED*****1,500***REMOVED***requests***REMOVED***per***REMOVED***day**
-***REMOVED*****1M***REMOVED***tokens***REMOVED***per***REMOVED***request**

Perfect***REMOVED***for***REMOVED***development***REMOVED***and***REMOVED***small-scale***REMOVED***production!

##***REMOVED***Troubleshooting

###***REMOVED***"API***REMOVED***key***REMOVED***not***REMOVED***found"
-***REMOVED***Make***REMOVED***sure***REMOVED***you***REMOVED***added***REMOVED***`GOOGLE_GEMINI_API_KEY`***REMOVED***to***REMOVED***`.env.local`
-***REMOVED***Restart***REMOVED***the***REMOVED***dev***REMOVED***server

###***REMOVED***"Rate***REMOVED***limit***REMOVED***exceeded"
-***REMOVED***You***REMOVED***hit***REMOVED***the***REMOVED***free***REMOVED***tier***REMOVED***limit***REMOVED***(15***REMOVED***req/min)
-***REMOVED***Wait***REMOVED***a***REMOVED***minute***REMOVED***or***REMOVED***upgrade***REMOVED***to***REMOVED***paid***REMOVED***tier

###***REMOVED***"Model***REMOVED***not***REMOVED***found"
-***REMOVED***Check***REMOVED***your***REMOVED***model***REMOVED***name:***REMOVED***`gemini-2.0-flash-exp`
-***REMOVED***Try***REMOVED***`gemini-1.5-flash`***REMOVED***if***REMOVED***experimental***REMOVED***model***REMOVED***is***REMOVED***unavailable

##***REMOVED***Next***REMOVED***Steps

-***REMOVED***Read***REMOVED***the***REMOVED***full***REMOVED***[LLM***REMOVED***Configuration***REMOVED***Guide](./LLM_CONFIGURATION.md)
-***REMOVED***Explore***REMOVED***[Performance***REMOVED***Optimizations](./PERFORMANCE_OPTIMIZATIONS.md)
-***REMOVED***Check***REMOVED***out***REMOVED***the***REMOVED***[Complete***REMOVED***Setup***REMOVED***Guide](./COMPLETE_SETUP_GUIDE.md)

##***REMOVED***Need***REMOVED***Help?

-***REMOVED***[Google***REMOVED***Gemini***REMOVED***Documentation](https://ai.google.dev/docs)
-***REMOVED***[Gemini***REMOVED***API***REMOVED***Pricing](https://ai.google.dev/pricing)
-***REMOVED***[Google***REMOVED***AI***REMOVED***Studio](https://aistudio.google.com)

---

**Pro***REMOVED***Tip**:***REMOVED***Gemini***REMOVED***2.5***REMOVED***Flash***REMOVED***is***REMOVED***perfect***REMOVED***for***REMOVED***production***REMOVED***use.***REMOVED***It's***REMOVED***fast,***REMOVED***cheap,***REMOVED***and***REMOVED***high-quality.***REMOVED***You***REMOVED***can***REMOVED***always***REMOVED***switch***REMOVED***to***REMOVED***GPT-4***REMOVED***later***REMOVED***if***REMOVED***needed***REMOVED***by***REMOVED***changing***REMOVED***`LLM_PROVIDER=openai`***REMOVED***in***REMOVED***your***REMOVED***`.env.local`***REMOVED***file.
