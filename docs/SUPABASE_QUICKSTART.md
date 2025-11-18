#***REMOVED***Supabase***REMOVED***Quick***REMOVED***Start

Get***REMOVED***up***REMOVED***and***REMOVED***running***REMOVED***with***REMOVED***Supabase***REMOVED***in***REMOVED***5***REMOVED***minutes.

##***REMOVED***Step***REMOVED***1:***REMOVED***Create***REMOVED***Supabase***REMOVED***Project***REMOVED***(2***REMOVED***min)

1.***REMOVED***Go***REMOVED***to***REMOVED***[supabase.com](https://supabase.com)***REMOVED***and***REMOVED***sign***REMOVED***up
2.***REMOVED***Click***REMOVED***"New***REMOVED***Project"
3.***REMOVED***Enter***REMOVED***project***REMOVED***name:***REMOVED***`aura-app`
4.***REMOVED***Generate***REMOVED***and***REMOVED***save***REMOVED***a***REMOVED***strong***REMOVED***database***REMOVED***password
5.***REMOVED***Select***REMOVED***region***REMOVED***closest***REMOVED***to***REMOVED***you
6.***REMOVED***Click***REMOVED***"Create***REMOVED***new***REMOVED***project"

##***REMOVED***Step***REMOVED***2:***REMOVED***Get***REMOVED***API***REMOVED***Keys***REMOVED***(1***REMOVED***min)

1.***REMOVED***Go***REMOVED***to***REMOVED*****Settings*****REMOVED***→***REMOVED*****API*****REMOVED***in***REMOVED***your***REMOVED***Supabase***REMOVED***dashboard
2.***REMOVED***Copy***REMOVED***these***REMOVED***values:
***REMOVED******REMOVED******REMOVED***-***REMOVED*****Project***REMOVED***URL**:***REMOVED***`https://xxxxx.supabase.co`
***REMOVED******REMOVED******REMOVED***-***REMOVED*****anon***REMOVED***public**:***REMOVED***The***REMOVED***long***REMOVED***key***REMOVED***starting***REMOVED***with***REMOVED***`eyJhbGc...`
***REMOVED******REMOVED******REMOVED***-***REMOVED*****service_role**:***REMOVED***The***REMOVED***other***REMOVED***long***REMOVED***key***REMOVED***(keep***REMOVED***this***REMOVED***secret!)

##***REMOVED***Step***REMOVED***3:***REMOVED***Update***REMOVED***Environment***REMOVED***Variables***REMOVED***(1***REMOVED***min)

Edit***REMOVED***`.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=REDACTED
SUPABASE_SERVICE_ROLE_KEY=REDACTED
```

##***REMOVED***Step***REMOVED***4:***REMOVED***Set***REMOVED***Up***REMOVED***Database***REMOVED***(1***REMOVED***min)

1.***REMOVED***Go***REMOVED***to***REMOVED*****SQL***REMOVED***Editor*****REMOVED***in***REMOVED***Supabase***REMOVED***dashboard
2.***REMOVED***Click***REMOVED***"New***REMOVED***Query"
3.***REMOVED***Copy***REMOVED***all***REMOVED***content***REMOVED***from***REMOVED***`supabase/migrations/001_initial_schema.sql`
4.***REMOVED***Paste***REMOVED***and***REMOVED***click***REMOVED***"Run"
5.***REMOVED***You***REMOVED***should***REMOVED***see***REMOVED***"Success.***REMOVED***No***REMOVED***rows***REMOVED***returned"

##***REMOVED***Step***REMOVED***5:***REMOVED***Configure***REMOVED***Google***REMOVED***OAuth***REMOVED***(2***REMOVED***min)

1.***REMOVED***Go***REMOVED***to***REMOVED*****Authentication*****REMOVED***→***REMOVED*****Providers**
2.***REMOVED***Find***REMOVED***and***REMOVED***enable***REMOVED*****Google**
3.***REMOVED***Enter***REMOVED***your***REMOVED***Google***REMOVED***OAuth***REMOVED***credentials:
***REMOVED******REMOVED******REMOVED***-***REMOVED***Client***REMOVED***ID:***REMOVED***
***REMOVED******REMOVED******REMOVED***-***REMOVED***Client***REMOVED***Secret:***REMOVED***
4.***REMOVED***Click***REMOVED***"Save"

##***REMOVED***Step***REMOVED***6:***REMOVED***Test***REMOVED***It!***REMOVED***(1***REMOVED***min)

```bash
npm***REMOVED***run***REMOVED***dev
```

Visit***REMOVED***`http://localhost:3000`***REMOVED***and***REMOVED***try***REMOVED***signing***REMOVED***in***REMOVED***with***REMOVED***Google!

##***REMOVED***What's***REMOVED***Next?

-***REMOVED***Read***REMOVED***the***REMOVED***full***REMOVED***[Supabase***REMOVED***Setup***REMOVED***Guide](./SUPABASE_SETUP.md)
-***REMOVED***Explore***REMOVED***the***REMOVED***[database***REMOVED***queries](../lib/supabase/queries.ts)
-***REMOVED***Check***REMOVED***out***REMOVED***the***REMOVED***[API***REMOVED***routes](../app/api/)

##***REMOVED***Troubleshooting

**"Invalid***REMOVED***API***REMOVED***key"**
-***REMOVED***Double-check***REMOVED***your***REMOVED***`.env.local`***REMOVED***file
-***REMOVED***Make***REMOVED***sure***REMOVED***there***REMOVED***are***REMOVED***no***REMOVED***extra***REMOVED***spaces***REMOVED***or***REMOVED***quotes
-***REMOVED***Restart***REMOVED***your***REMOVED***dev***REMOVED***server

**"Failed***REMOVED***to***REMOVED***fetch"**
-***REMOVED***Check***REMOVED***your***REMOVED***internet***REMOVED***connection
-***REMOVED***Verify***REMOVED***the***REMOVED***Supabase***REMOVED***project***REMOVED***URL***REMOVED***is***REMOVED***correct
-***REMOVED***Make***REMOVED***sure***REMOVED***your***REMOVED***Supabase***REMOVED***project***REMOVED***is***REMOVED***active

**Google***REMOVED***OAuth***REMOVED***not***REMOVED***working**
-***REMOVED***Verify***REMOVED***redirect***REMOVED***URL:***REMOVED***`http://localhost:3000/auth/callback`
-***REMOVED***Check***REMOVED***that***REMOVED***Google***REMOVED***provider***REMOVED***is***REMOVED***enabled***REMOVED***in***REMOVED***Supabase
-***REMOVED***Ensure***REMOVED***your***REMOVED***Google***REMOVED***OAuth***REMOVED***credentials***REMOVED***are***REMOVED***correct

##***REMOVED***Need***REMOVED***Help?

-***REMOVED***Check***REMOVED***the***REMOVED***[full***REMOVED***documentation](./SUPABASE_SETUP.md)
-***REMOVED***Visit***REMOVED***[Supabase***REMOVED***Discord](https://discord.supabase.com)
-***REMOVED***Review***REMOVED***[Supabase***REMOVED***Docs](https://supabase.com/docs)
