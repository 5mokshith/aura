#***REMOVED***🚀***REMOVED***AURA***REMOVED***Setup***REMOVED***Checklist

Use***REMOVED***this***REMOVED***checklist***REMOVED***to***REMOVED***get***REMOVED***AURA***REMOVED***up***REMOVED***and***REMOVED***running***REMOVED***quickly.

##***REMOVED***✅***REMOVED***Prerequisites

-***REMOVED***[***REMOVED***]***REMOVED***Node.js***REMOVED***20+***REMOVED***installed
-***REMOVED***[***REMOVED***]***REMOVED***npm***REMOVED***installed
-***REMOVED***[***REMOVED***]***REMOVED***Google***REMOVED***account***REMOVED***(for***REMOVED***Gemini***REMOVED***API)
-***REMOVED***[***REMOVED***]***REMOVED***Supabase***REMOVED***account***REMOVED***(optional***REMOVED***for***REMOVED***local***REMOVED***dev)

##***REMOVED***✅***REMOVED***Installation

-***REMOVED***[***REMOVED***]***REMOVED***Clone***REMOVED***the***REMOVED***repository
-***REMOVED***[***REMOVED***]***REMOVED***Run***REMOVED***`npm***REMOVED***install`
-***REMOVED***[***REMOVED***]***REMOVED***Copy***REMOVED***`.env.example`***REMOVED***to***REMOVED***`.env.local`

##***REMOVED***✅***REMOVED***LLM***REMOVED***Configuration***REMOVED***(Gemini***REMOVED***-***REMOVED***Recommended)

-***REMOVED***[***REMOVED***]***REMOVED***Visit***REMOVED***[Google***REMOVED***AI***REMOVED***Studio](https://aistudio.google.com/app/apikey)
-***REMOVED***[***REMOVED***]***REMOVED***Sign***REMOVED***in***REMOVED***and***REMOVED***create***REMOVED***API***REMOVED***key
-***REMOVED***[***REMOVED***]***REMOVED***Copy***REMOVED***API***REMOVED***key***REMOVED***(starts***REMOVED***with***REMOVED***`AIza...`)
-***REMOVED***[***REMOVED***]***REMOVED***Add***REMOVED***to***REMOVED***`.env.local`:
***REMOVED******REMOVED***```bash
***REMOVED******REMOVED***LLM_PROVIDER=gemini
***REMOVED******REMOVED***GOOGLE_GEMINI_API_KEY=AIza...your_key_here
***REMOVED******REMOVED***GOOGLE_GEMINI_MODEL=gemini-2.0-flash-exp
***REMOVED******REMOVED***```

**📖***REMOVED***Detailed***REMOVED***Guide**:***REMOVED***[Gemini***REMOVED***Setup](./docs/GEMINI_SETUP.md)

##***REMOVED***✅***REMOVED***Supabase***REMOVED***Configuration

-***REMOVED***[***REMOVED***]***REMOVED***Create***REMOVED***Supabase***REMOVED***project***REMOVED***at***REMOVED***[supabase.com](https://supabase.com)
-***REMOVED***[***REMOVED***]***REMOVED***Get***REMOVED***project***REMOVED***URL***REMOVED***and***REMOVED***keys***REMOVED***from***REMOVED***Settings***REMOVED***>***REMOVED***API
-***REMOVED***[***REMOVED***]***REMOVED***Add***REMOVED***to***REMOVED***`.env.local`:
***REMOVED******REMOVED***```bash
***REMOVED******REMOVED***NEXT_PUBLIC_SUPABASE_URL=your_project_url
***REMOVED******REMOVED***NEXT_PUBLIC_SUPABASE_ANON_KEY=REDACTED
***REMOVED******REMOVED***SUPABASE_SERVICE_ROLE_KEY=REDACTED
***REMOVED******REMOVED***```

**📖***REMOVED***Detailed***REMOVED***Guide**:***REMOVED***[Supabase***REMOVED***Quickstart](./docs/SUPABASE_QUICKSTART.md)

##***REMOVED***✅***REMOVED***Google***REMOVED***OAuth***REMOVED***Configuration

-***REMOVED***[***REMOVED***]***REMOVED***Create***REMOVED***Google***REMOVED***Cloud***REMOVED***Project
-***REMOVED***[***REMOVED***]***REMOVED***Enable***REMOVED***Google***REMOVED***Workspace***REMOVED***APIs
-***REMOVED***[***REMOVED***]***REMOVED***Create***REMOVED***OAuth***REMOVED***2.0***REMOVED***credentials
-***REMOVED***[***REMOVED***]***REMOVED***Add***REMOVED***to***REMOVED***`.env.local`:
***REMOVED******REMOVED***```bash
***REMOVED******REMOVED***GOOGLE_CLIENT_ID=your_client_id
***REMOVED******REMOVED***GOOGLE_CLIENT_SECRET=REDACTED
***REMOVED******REMOVED***```
-***REMOVED***[***REMOVED***]***REMOVED***Configure***REMOVED***in***REMOVED***Supabase:***REMOVED***Authentication***REMOVED***>***REMOVED***Providers***REMOVED***>***REMOVED***Google

**📖***REMOVED***Detailed***REMOVED***Guide**:***REMOVED***[Complete***REMOVED***Setup***REMOVED***Guide](./docs/COMPLETE_SETUP_GUIDE.md)

##***REMOVED***✅***REMOVED***Start***REMOVED***Development***REMOVED***Server

-***REMOVED***[***REMOVED***]***REMOVED***Run***REMOVED***`npm***REMOVED***run***REMOVED***dev`
-***REMOVED***[***REMOVED***]***REMOVED***Open***REMOVED***http://localhost:3000
-***REMOVED***[***REMOVED***]***REMOVED***Verify***REMOVED***no***REMOVED***errors***REMOVED***in***REMOVED***console

##***REMOVED***✅***REMOVED***Test***REMOVED***Basic***REMOVED***Functionality

-***REMOVED***[***REMOVED***]***REMOVED***Can***REMOVED***access***REMOVED***the***REMOVED***homepage
-***REMOVED***[***REMOVED***]***REMOVED***Can***REMOVED***see***REMOVED***the***REMOVED***UI***REMOVED***components
-***REMOVED***[***REMOVED***]***REMOVED***No***REMOVED***console***REMOVED***errors

##***REMOVED***✅***REMOVED***Test***REMOVED***LLM***REMOVED***Integration***REMOVED***(Optional)

-***REMOVED***[***REMOVED***]***REMOVED***Try***REMOVED***a***REMOVED***simple***REMOVED***workflow***REMOVED***command
-***REMOVED***[***REMOVED***]***REMOVED***Verify***REMOVED***Gemini***REMOVED***is***REMOVED***responding
-***REMOVED***[***REMOVED***]***REMOVED***Check***REMOVED***console***REMOVED***logs***REMOVED***for***REMOVED***"Using***REMOVED***LLM***REMOVED***provider:***REMOVED***gemini"

##***REMOVED***🎯***REMOVED***Quick***REMOVED***Start***REMOVED***Paths

###***REMOVED***Path***REMOVED***1:***REMOVED***Just***REMOVED***Want***REMOVED***to***REMOVED***See***REMOVED***the***REMOVED***UI***REMOVED***(5***REMOVED***minutes)
1.***REMOVED***✅***REMOVED***Install***REMOVED***dependencies
2.***REMOVED***✅***REMOVED***Copy***REMOVED***`.env.example`***REMOVED***to***REMOVED***`.env.local`
3.***REMOVED***✅***REMOVED***Run***REMOVED***`npm***REMOVED***run***REMOVED***dev`
4.***REMOVED***✅***REMOVED***Open***REMOVED***http://localhost:3000

**Note**:***REMOVED***Some***REMOVED***features***REMOVED***won't***REMOVED***work***REMOVED***without***REMOVED***API***REMOVED***keys,***REMOVED***but***REMOVED***you***REMOVED***can***REMOVED***explore***REMOVED***the***REMOVED***UI.

###***REMOVED***Path***REMOVED***2:***REMOVED***Full***REMOVED***Setup***REMOVED***with***REMOVED***Gemini***REMOVED***(15***REMOVED***minutes)
1.***REMOVED***✅***REMOVED***Install***REMOVED***dependencies
2.***REMOVED***✅***REMOVED***Get***REMOVED***Gemini***REMOVED***API***REMOVED***key
3.***REMOVED***✅***REMOVED***Configure***REMOVED***`.env.local`
4.***REMOVED***✅***REMOVED***Run***REMOVED***`npm***REMOVED***run***REMOVED***dev`
5.***REMOVED***✅***REMOVED***Test***REMOVED***workflows

**Guide**:***REMOVED***[Gemini***REMOVED***Setup](./docs/GEMINI_SETUP.md)

###***REMOVED***Path***REMOVED***3:***REMOVED***Production***REMOVED***Setup***REMOVED***(30-60***REMOVED***minutes)
1.***REMOVED***✅***REMOVED***Install***REMOVED***dependencies
2.***REMOVED***✅***REMOVED***Get***REMOVED***Gemini***REMOVED***API***REMOVED***key
3.***REMOVED***✅***REMOVED***Set***REMOVED***up***REMOVED***Supabase
4.***REMOVED***✅***REMOVED***Configure***REMOVED***Google***REMOVED***OAuth
5.***REMOVED***✅***REMOVED***Configure***REMOVED***all***REMOVED***environment***REMOVED***variables
6.***REMOVED***✅***REMOVED***Run***REMOVED***`npm***REMOVED***run***REMOVED***dev`
7.***REMOVED***✅***REMOVED***Test***REMOVED***all***REMOVED***features

**Guide**:***REMOVED***[Complete***REMOVED***Setup***REMOVED***Guide](./docs/COMPLETE_SETUP_GUIDE.md)

##***REMOVED***📚***REMOVED***Documentation

###***REMOVED***Quick***REMOVED***Start
-***REMOVED***[Gemini***REMOVED***Setup***REMOVED***(5***REMOVED***min)](./docs/GEMINI_SETUP.md)
-***REMOVED***[Supabase***REMOVED***Quickstart](./docs/SUPABASE_QUICKSTART.md)

###***REMOVED***Detailed***REMOVED***Guides
-***REMOVED***[Complete***REMOVED***Setup***REMOVED***Guide](./docs/COMPLETE_SETUP_GUIDE.md)
-***REMOVED***[LLM***REMOVED***Configuration](./docs/LLM_CONFIGURATION.md)
-***REMOVED***[Performance***REMOVED***Optimizations](./docs/PERFORMANCE_OPTIMIZATIONS.md)

###***REMOVED***Reference
-***REMOVED***[Environment***REMOVED***Variables](./.env.example)
-***REMOVED***[README](./README.md)

##***REMOVED***🆘***REMOVED***Troubleshooting

###***REMOVED***Server***REMOVED***won't***REMOVED***start
-***REMOVED***Check***REMOVED***Node.js***REMOVED***version:***REMOVED***`node***REMOVED***--version`***REMOVED***(should***REMOVED***be***REMOVED***20+)
-***REMOVED***Delete***REMOVED***`node_modules`***REMOVED***and***REMOVED***run***REMOVED***`npm***REMOVED***install`***REMOVED***again
-***REMOVED***Check***REMOVED***for***REMOVED***port***REMOVED***conflicts***REMOVED***(default:***REMOVED***3000)

###***REMOVED***"API***REMOVED***key***REMOVED***not***REMOVED***found"***REMOVED***errors
-***REMOVED***Verify***REMOVED***`.env.local`***REMOVED***exists
-***REMOVED***Check***REMOVED***API***REMOVED***key***REMOVED***format***REMOVED***(Gemini***REMOVED***keys***REMOVED***start***REMOVED***with***REMOVED***`AIza...`)
-***REMOVED***Restart***REMOVED***the***REMOVED***dev***REMOVED***server***REMOVED***after***REMOVED***changing***REMOVED***`.env.local`

###***REMOVED***Supabase***REMOVED***connection***REMOVED***errors
-***REMOVED***Verify***REMOVED***Supabase***REMOVED***URL***REMOVED***and***REMOVED***keys
-***REMOVED***Check***REMOVED***Supabase***REMOVED***project***REMOVED***is***REMOVED***active
-***REMOVED***Verify***REMOVED***network***REMOVED***connectivity

###***REMOVED***Google***REMOVED***OAuth***REMOVED***not***REMOVED***working
-***REMOVED***Check***REMOVED***OAuth***REMOVED***credentials***REMOVED***in***REMOVED***Google***REMOVED***Cloud***REMOVED***Console
-***REMOVED***Verify***REMOVED***redirect***REMOVED***URIs***REMOVED***are***REMOVED***configured
-***REMOVED***Check***REMOVED***Supabase***REMOVED***Google***REMOVED***provider***REMOVED***settings

##***REMOVED***💡***REMOVED***Pro***REMOVED***Tips

1.***REMOVED*****Start***REMOVED***Simple**:***REMOVED***Get***REMOVED***Gemini***REMOVED***working***REMOVED***first,***REMOVED***then***REMOVED***add***REMOVED***other***REMOVED***features
2.***REMOVED*****Use***REMOVED***Free***REMOVED***Tiers**:***REMOVED***Gemini***REMOVED***and***REMOVED***Supabase***REMOVED***both***REMOVED***have***REMOVED***generous***REMOVED***free***REMOVED***tiers
3.***REMOVED*****Check***REMOVED***Logs**:***REMOVED***Console***REMOVED***logs***REMOVED***are***REMOVED***your***REMOVED***friend***REMOVED***for***REMOVED***debugging
4.***REMOVED*****Read***REMOVED***Docs**:***REMOVED***We***REMOVED***have***REMOVED***detailed***REMOVED***guides***REMOVED***for***REMOVED***everything
5.***REMOVED*****Ask***REMOVED***for***REMOVED***Help**:***REMOVED***Check***REMOVED***documentation***REMOVED***or***REMOVED***reach***REMOVED***out***REMOVED***if***REMOVED***stuck

##***REMOVED***🎉***REMOVED***Success***REMOVED***Criteria

You're***REMOVED***ready***REMOVED***to***REMOVED***go***REMOVED***when:

-***REMOVED***✅***REMOVED***Server***REMOVED***starts***REMOVED***without***REMOVED***errors
-***REMOVED***✅***REMOVED***Can***REMOVED***access***REMOVED***http://localhost:3000
-***REMOVED***✅***REMOVED***UI***REMOVED***loads***REMOVED***correctly
-***REMOVED***✅***REMOVED***Gemini***REMOVED***API***REMOVED***is***REMOVED***responding***REMOVED***(if***REMOVED***configured)
-***REMOVED***✅***REMOVED***No***REMOVED***console***REMOVED***errors

##***REMOVED***🚀***REMOVED***Next***REMOVED***Steps

Once***REMOVED***setup***REMOVED***is***REMOVED***complete:

1.***REMOVED***Explore***REMOVED***the***REMOVED***UI***REMOVED***and***REMOVED***features
2.***REMOVED***Try***REMOVED***some***REMOVED***workflow***REMOVED***commands
3.***REMOVED***Read***REMOVED***the***REMOVED***[Performance***REMOVED***Optimizations](./docs/PERFORMANCE_OPTIMIZATIONS.md)***REMOVED***guide
4.***REMOVED***Customize***REMOVED***for***REMOVED***your***REMOVED***needs
5.***REMOVED***Deploy***REMOVED***to***REMOVED***production***REMOVED***(when***REMOVED***ready)

---

**Need***REMOVED***Help?**
-***REMOVED***📖***REMOVED***Check***REMOVED***the***REMOVED***[documentation](./docs/)
-***REMOVED***🔍***REMOVED***Search***REMOVED***for***REMOVED***error***REMOVED***messages
-***REMOVED***💬***REMOVED***Review***REMOVED***troubleshooting***REMOVED***section***REMOVED***above

**Happy***REMOVED***Building!***REMOVED***🎉**
