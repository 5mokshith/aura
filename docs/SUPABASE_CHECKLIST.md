#***REMOVED***Supabase***REMOVED***Setup***REMOVED***Checklist

Use***REMOVED***this***REMOVED***checklist***REMOVED***to***REMOVED***ensure***REMOVED***your***REMOVED***Supabase***REMOVED***integration***REMOVED***is***REMOVED***properly***REMOVED***configured.

##***REMOVED***Initial***REMOVED***Setup

-***REMOVED***[***REMOVED***]***REMOVED***Create***REMOVED***Supabase***REMOVED***account***REMOVED***at***REMOVED***[supabase.com](https://supabase.com)
-***REMOVED***[***REMOVED***]***REMOVED***Create***REMOVED***new***REMOVED***project***REMOVED***in***REMOVED***Supabase***REMOVED***dashboard
-***REMOVED***[***REMOVED***]***REMOVED***Save***REMOVED***database***REMOVED***password***REMOVED***securely
-***REMOVED***[***REMOVED***]***REMOVED***Note***REMOVED***project***REMOVED***URL***REMOVED***and***REMOVED***API***REMOVED***keys

##***REMOVED***Environment***REMOVED***Configuration

-***REMOVED***[***REMOVED***]***REMOVED***Copy***REMOVED***Project***REMOVED***URL***REMOVED***to***REMOVED***`.env.local`***REMOVED***as***REMOVED***`NEXT_PUBLIC_SUPABASE_URL`
-***REMOVED***[***REMOVED***]***REMOVED***Copy***REMOVED***anon***REMOVED***key***REMOVED***to***REMOVED***`.env.local`***REMOVED***as***REMOVED***`NEXT_PUBLIC_SUPABASE_ANON_KEY`
-***REMOVED***[***REMOVED***]***REMOVED***Copy***REMOVED***service_role***REMOVED***key***REMOVED***to***REMOVED***`.env.local`***REMOVED***as***REMOVED***`SUPABASE_SERVICE_ROLE_KEY`
-***REMOVED***[***REMOVED***]***REMOVED***Restart***REMOVED***development***REMOVED***server***REMOVED***after***REMOVED***updating***REMOVED***env***REMOVED***vars

##***REMOVED***Database***REMOVED***Setup

-***REMOVED***[***REMOVED***]***REMOVED***Open***REMOVED***SQL***REMOVED***Editor***REMOVED***in***REMOVED***Supabase***REMOVED***dashboard
-***REMOVED***[***REMOVED***]***REMOVED***Run***REMOVED***migration***REMOVED***from***REMOVED***`supabase/migrations/001_initial_schema.sql`
-***REMOVED***[***REMOVED***]***REMOVED***Verify***REMOVED***tables***REMOVED***created:***REMOVED***`profiles`,***REMOVED***`workflows`,***REMOVED***`workflow_history`
-***REMOVED***[***REMOVED***]***REMOVED***Check***REMOVED***that***REMOVED***RLS***REMOVED***policies***REMOVED***are***REMOVED***enabled
-***REMOVED***[***REMOVED***]***REMOVED***Verify***REMOVED***triggers***REMOVED***are***REMOVED***created

##***REMOVED***Authentication***REMOVED***Setup

-***REMOVED***[***REMOVED***]***REMOVED***Enable***REMOVED***Google***REMOVED***provider***REMOVED***in***REMOVED***Authentication***REMOVED***→***REMOVED***Providers
-***REMOVED***[***REMOVED***]***REMOVED***Add***REMOVED***Google***REMOVED***Client***REMOVED***ID
-***REMOVED***[***REMOVED***]***REMOVED***Add***REMOVED***Google***REMOVED***Client***REMOVED***Secret
-***REMOVED***[***REMOVED***]***REMOVED***Configure***REMOVED***redirect***REMOVED***URLs:
***REMOVED******REMOVED***-***REMOVED***[***REMOVED***]***REMOVED***Development:***REMOVED***`http://localhost:3000/auth/callback`
***REMOVED******REMOVED***-***REMOVED***[***REMOVED***]***REMOVED***Production:***REMOVED***`https://yourdomain.com/auth/callback`
-***REMOVED***[***REMOVED***]***REMOVED***Save***REMOVED***provider***REMOVED***configuration

##***REMOVED***OAuth***REMOVED***Scopes***REMOVED***(Optional)

Configure***REMOVED***additional***REMOVED***Google***REMOVED***OAuth***REMOVED***scopes***REMOVED***if***REMOVED***needed:
-***REMOVED***[***REMOVED***]***REMOVED***`https://www.googleapis.com/auth/gmail.modify`
-***REMOVED***[***REMOVED***]***REMOVED***`https://www.googleapis.com/auth/drive.file`
-***REMOVED***[***REMOVED***]***REMOVED***`https://www.googleapis.com/auth/documents`
-***REMOVED***[***REMOVED***]***REMOVED***`https://www.googleapis.com/auth/spreadsheets`
-***REMOVED***[***REMOVED***]***REMOVED***`https://www.googleapis.com/auth/calendar`

##***REMOVED***Code***REMOVED***Integration

-***REMOVED***[***REMOVED***]***REMOVED***Supabase***REMOVED***packages***REMOVED***installed***REMOVED***(`@supabase/supabase-js`,***REMOVED***`@supabase/ssr`)
-***REMOVED***[***REMOVED***]***REMOVED***Client***REMOVED***utility***REMOVED***created***REMOVED***(`lib/supabase/client.ts`)
-***REMOVED***[***REMOVED***]***REMOVED***Server***REMOVED***utility***REMOVED***created***REMOVED***(`lib/supabase/server.ts`)
-***REMOVED***[***REMOVED***]***REMOVED***Middleware***REMOVED***utility***REMOVED***created***REMOVED***(`lib/supabase/middleware.ts`)
-***REMOVED***[***REMOVED***]***REMOVED***Middleware***REMOVED***configured***REMOVED***(`middleware.ts`)
-***REMOVED***[***REMOVED***]***REMOVED***Auth***REMOVED***context***REMOVED***created***REMOVED***(`contexts/SupabaseAuthContext.tsx`)
-***REMOVED***[***REMOVED***]***REMOVED***Database***REMOVED***types***REMOVED***defined***REMOVED***(`lib/supabase/database.types.ts`)
-***REMOVED***[***REMOVED***]***REMOVED***Query***REMOVED***helpers***REMOVED***created***REMOVED***(`lib/supabase/queries.ts`)

##***REMOVED***Testing

###***REMOVED***Authentication***REMOVED***Flow
-***REMOVED***[***REMOVED***]***REMOVED***Sign***REMOVED***in***REMOVED***with***REMOVED***Google***REMOVED***works
-***REMOVED***[***REMOVED***]***REMOVED***User***REMOVED***redirected***REMOVED***to***REMOVED***dashboard***REMOVED***after***REMOVED***sign***REMOVED***in
-***REMOVED***[***REMOVED***]***REMOVED***User***REMOVED***profile***REMOVED***created***REMOVED***automatically
-***REMOVED***[***REMOVED***]***REMOVED***Sign***REMOVED***out***REMOVED***works***REMOVED***correctly
-***REMOVED***[***REMOVED***]***REMOVED***Protected***REMOVED***routes***REMOVED***redirect***REMOVED***to***REMOVED***login***REMOVED***when***REMOVED***not***REMOVED***authenticated
-***REMOVED***[***REMOVED***]***REMOVED***Authenticated***REMOVED***users***REMOVED***can***REMOVED***access***REMOVED***protected***REMOVED***routes

###***REMOVED***Database***REMOVED***Operations
-***REMOVED***[***REMOVED***]***REMOVED***Can***REMOVED***create***REMOVED***workflow
-***REMOVED***[***REMOVED***]***REMOVED***Can***REMOVED***fetch***REMOVED***workflows
-***REMOVED***[***REMOVED***]***REMOVED***Can***REMOVED***update***REMOVED***workflow
-***REMOVED***[***REMOVED***]***REMOVED***Can***REMOVED***delete***REMOVED***workflow***REMOVED***history
-***REMOVED***[***REMOVED***]***REMOVED***RLS***REMOVED***policies***REMOVED***prevent***REMOVED***unauthorized***REMOVED***access

###***REMOVED***API***REMOVED***Routes
-***REMOVED***[***REMOVED***]***REMOVED***`/api/profile`***REMOVED***GET***REMOVED***returns***REMOVED***user***REMOVED***profile
-***REMOVED***[***REMOVED***]***REMOVED***`/api/profile`***REMOVED***PATCH***REMOVED***updates***REMOVED***profile
-***REMOVED***[***REMOVED***]***REMOVED***`/api/workflows`***REMOVED***GET***REMOVED***returns***REMOVED***user***REMOVED***workflows
-***REMOVED***[***REMOVED***]***REMOVED***`/api/workflows`***REMOVED***POST***REMOVED***creates***REMOVED***workflow
-***REMOVED***[***REMOVED***]***REMOVED***All***REMOVED***routes***REMOVED***check***REMOVED***authentication

###***REMOVED***Error***REMOVED***Handling
-***REMOVED***[***REMOVED***]***REMOVED***Invalid***REMOVED***credentials***REMOVED***show***REMOVED***error
-***REMOVED***[***REMOVED***]***REMOVED***Network***REMOVED***errors***REMOVED***handled***REMOVED***gracefully
-***REMOVED***[***REMOVED***]***REMOVED***Session***REMOVED***expiration***REMOVED***handled
-***REMOVED***[***REMOVED***]***REMOVED***Database***REMOVED***errors***REMOVED***logged***REMOVED***properly

##***REMOVED***Security***REMOVED***Verification

-***REMOVED***[***REMOVED***]***REMOVED***RLS***REMOVED***enabled***REMOVED***on***REMOVED***all***REMOVED***tables
-***REMOVED***[***REMOVED***]***REMOVED***Service***REMOVED***role***REMOVED***key***REMOVED***not***REMOVED***exposed***REMOVED***in***REMOVED***client***REMOVED***code
-***REMOVED***[***REMOVED***]***REMOVED***Auth***REMOVED***checks***REMOVED***in***REMOVED***all***REMOVED***API***REMOVED***routes
-***REMOVED***[***REMOVED***]***REMOVED***User***REMOVED***can***REMOVED***only***REMOVED***access***REMOVED***their***REMOVED***own***REMOVED***data
-***REMOVED***[***REMOVED***]***REMOVED***CORS***REMOVED***configured***REMOVED***correctly
-***REMOVED***[***REMOVED***]***REMOVED***Environment***REMOVED***variables***REMOVED***not***REMOVED***committed***REMOVED***to***REMOVED***git

##***REMOVED***Production***REMOVED***Preparation

-***REMOVED***[***REMOVED***]***REMOVED***Update***REMOVED***`NEXT_PUBLIC_SUPABASE_URL`***REMOVED***for***REMOVED***production
-***REMOVED***[***REMOVED***]***REMOVED***Add***REMOVED***production***REMOVED***redirect***REMOVED***URL***REMOVED***to***REMOVED***Supabase
-***REMOVED***[***REMOVED***]***REMOVED***Configure***REMOVED***custom***REMOVED***domain***REMOVED***(optional)
-***REMOVED***[***REMOVED***]***REMOVED***Set***REMOVED***up***REMOVED***database***REMOVED***backups
-***REMOVED***[***REMOVED***]***REMOVED***Enable***REMOVED***MFA***REMOVED***for***REMOVED***admin***REMOVED***accounts
-***REMOVED***[***REMOVED***]***REMOVED***Configure***REMOVED***email***REMOVED***templates
-***REMOVED***[***REMOVED***]***REMOVED***Set***REMOVED***up***REMOVED***monitoring***REMOVED***and***REMOVED***alerts
-***REMOVED***[***REMOVED***]***REMOVED***Test***REMOVED***complete***REMOVED***flow***REMOVED***in***REMOVED***production

##***REMOVED***Optional***REMOVED***Enhancements

-***REMOVED***[***REMOVED***]***REMOVED***Set***REMOVED***up***REMOVED***real-time***REMOVED***subscriptions
-***REMOVED***[***REMOVED***]***REMOVED***Configure***REMOVED***storage***REMOVED***buckets
-***REMOVED***[***REMOVED***]***REMOVED***Add***REMOVED***database***REMOVED***indexes***REMOVED***for***REMOVED***performance
-***REMOVED***[***REMOVED***]***REMOVED***Set***REMOVED***up***REMOVED***Edge***REMOVED***Functions
-***REMOVED***[***REMOVED***]***REMOVED***Configure***REMOVED***rate***REMOVED***limiting
-***REMOVED***[***REMOVED***]***REMOVED***Add***REMOVED***custom***REMOVED***email***REMOVED***templates
-***REMOVED***[***REMOVED***]***REMOVED***Enable***REMOVED***database***REMOVED***webhooks
-***REMOVED***[***REMOVED***]***REMOVED***Set***REMOVED***up***REMOVED***CI/CD***REMOVED***for***REMOVED***migrations

##***REMOVED***Documentation

-***REMOVED***[***REMOVED***]***REMOVED***Team***REMOVED***members***REMOVED***have***REMOVED***access***REMOVED***to***REMOVED***Supabase***REMOVED***project
-***REMOVED***[***REMOVED***]***REMOVED***Environment***REMOVED***variables***REMOVED***documented
-***REMOVED***[***REMOVED***]***REMOVED***Database***REMOVED***schema***REMOVED***documented
-***REMOVED***[***REMOVED***]***REMOVED***API***REMOVED***routes***REMOVED***documented
-***REMOVED***[***REMOVED***]***REMOVED***Migration***REMOVED***process***REMOVED***documented

##***REMOVED***Monitoring

-***REMOVED***[***REMOVED***]***REMOVED***Check***REMOVED***auth***REMOVED***logs***REMOVED***in***REMOVED***Supabase***REMOVED***dashboard
-***REMOVED***[***REMOVED***]***REMOVED***Monitor***REMOVED***database***REMOVED***performance
-***REMOVED***[***REMOVED***]***REMOVED***Review***REMOVED***API***REMOVED***usage
-***REMOVED***[***REMOVED***]***REMOVED***Check***REMOVED***error***REMOVED***logs
-***REMOVED***[***REMOVED***]***REMOVED***Monitor***REMOVED***storage***REMOVED***usage

##***REMOVED***Troubleshooting***REMOVED***Checklist

If***REMOVED***something***REMOVED***isn't***REMOVED***working:

-***REMOVED***[***REMOVED***]***REMOVED***Check***REMOVED***environment***REMOVED***variables***REMOVED***are***REMOVED***correct
-***REMOVED***[***REMOVED***]***REMOVED***Verify***REMOVED***dev***REMOVED***server***REMOVED***was***REMOVED***restarted
-***REMOVED***[***REMOVED***]***REMOVED***Confirm***REMOVED***database***REMOVED***migration***REMOVED***ran***REMOVED***successfully
-***REMOVED***[***REMOVED***]***REMOVED***Check***REMOVED***RLS***REMOVED***policies***REMOVED***are***REMOVED***set***REMOVED***up
-***REMOVED***[***REMOVED***]***REMOVED***Verify***REMOVED***Google***REMOVED***OAuth***REMOVED***credentials
-***REMOVED***[***REMOVED***]***REMOVED***Check***REMOVED***redirect***REMOVED***URLs***REMOVED***match***REMOVED***exactly
-***REMOVED***[***REMOVED***]***REMOVED***Review***REMOVED***browser***REMOVED***console***REMOVED***for***REMOVED***errors
-***REMOVED***[***REMOVED***]***REMOVED***Check***REMOVED***Supabase***REMOVED***logs***REMOVED***for***REMOVED***errors
-***REMOVED***[***REMOVED***]***REMOVED***Verify***REMOVED***network***REMOVED***connectivity
-***REMOVED***[***REMOVED***]***REMOVED***Clear***REMOVED***browser***REMOVED***cookies***REMOVED***and***REMOVED***cache

##***REMOVED***Resources

-***REMOVED***[***REMOVED***]***REMOVED***Bookmarked***REMOVED***[Supabase***REMOVED***Documentation](https://supabase.com/docs)
-***REMOVED***[***REMOVED***]***REMOVED***Joined***REMOVED***[Supabase***REMOVED***Discord](https://discord.supabase.com)
-***REMOVED***[***REMOVED***]***REMOVED***Reviewed***REMOVED***[Auth***REMOVED***Helpers***REMOVED***Guide](https://supabase.com/docs/guides/auth/auth-helpers/nextjs)
-***REMOVED***[***REMOVED***]***REMOVED***Read***REMOVED***[RLS***REMOVED***Guide](https://supabase.com/docs/guides/auth/row-level-security)

##***REMOVED***Next***REMOVED***Steps

After***REMOVED***completing***REMOVED***this***REMOVED***checklist:

1.***REMOVED***Review***REMOVED***[MIGRATION_TO_SUPABASE.md](./MIGRATION_TO_SUPABASE.md)***REMOVED***if***REMOVED***migrating***REMOVED***from***REMOVED***old***REMOVED***auth
2.***REMOVED***Explore***REMOVED***[SUPABASE_SETUP.md](./SUPABASE_SETUP.md)***REMOVED***for***REMOVED***detailed***REMOVED***documentation
3.***REMOVED***Check***REMOVED***[lib/supabase/README.md](../lib/supabase/README.md)***REMOVED***for***REMOVED***usage***REMOVED***patterns
4.***REMOVED***Start***REMOVED***building***REMOVED***features***REMOVED***with***REMOVED***Supabase!

---

**Last***REMOVED***Updated:*****REMOVED***Check***REMOVED***this***REMOVED***date***REMOVED***when***REMOVED***reviewing
**Completed***REMOVED***By:*****REMOVED***_________________
**Date***REMOVED***Completed:*****REMOVED***_________________
