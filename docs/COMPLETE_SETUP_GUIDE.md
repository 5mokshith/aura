#***REMOVED***Complete***REMOVED***Supabase***REMOVED***Setup***REMOVED***Guide***REMOVED***for***REMOVED***AURA

This***REMOVED***guide***REMOVED***will***REMOVED***walk***REMOVED***you***REMOVED***through***REMOVED***setting***REMOVED***up***REMOVED***Supabase***REMOVED***with***REMOVED***Google***REMOVED***OAuth***REMOVED***and***REMOVED***token***REMOVED***storage***REMOVED***for***REMOVED***accessing***REMOVED***Google***REMOVED***Workspace***REMOVED***APIs.

##***REMOVED***🎯***REMOVED***What***REMOVED***We've***REMOVED***Built

-***REMOVED***✅***REMOVED***Supabase***REMOVED***authentication***REMOVED***with***REMOVED***Google***REMOVED***OAuth
-***REMOVED***✅***REMOVED***Secure***REMOVED***Google***REMOVED***OAuth***REMOVED***token***REMOVED***storage***REMOVED***(access***REMOVED***&***REMOVED***refresh***REMOVED***tokens)
-***REMOVED***✅***REMOVED***Automatic***REMOVED***token***REMOVED***refresh***REMOVED***mechanism
-***REMOVED***✅***REMOVED***Database***REMOVED***schema***REMOVED***with***REMOVED***Row***REMOVED***Level***REMOVED***Security***REMOVED***(RLS)
-***REMOVED***✅***REMOVED***API***REMOVED***routes***REMOVED***for***REMOVED***auth***REMOVED***management
-***REMOVED***✅***REMOVED***Updated***REMOVED***components***REMOVED***to***REMOVED***use***REMOVED***Supabase

##***REMOVED***📋***REMOVED***Prerequisites

1.***REMOVED***A***REMOVED***Supabase***REMOVED***account***REMOVED***([sign***REMOVED***up***REMOVED***here](https://supabase.com))
2.***REMOVED***Google***REMOVED***Cloud***REMOVED***Console***REMOVED***project***REMOVED***with***REMOVED***OAuth***REMOVED***credentials
3.***REMOVED***Node.js***REMOVED***and***REMOVED***npm***REMOVED***installed

##***REMOVED***🚀***REMOVED***Step-by-Step***REMOVED***Setup

###***REMOVED***Step***REMOVED***1:***REMOVED***Create***REMOVED***Supabase***REMOVED***Project***REMOVED***(5***REMOVED***minutes)

1.***REMOVED***Go***REMOVED***to***REMOVED***[app.supabase.com](https://app.supabase.com)
2.***REMOVED***Click***REMOVED*****"New***REMOVED***Project"**
3.***REMOVED***Fill***REMOVED***in:
***REMOVED******REMOVED******REMOVED***-***REMOVED*****Name**:***REMOVED***`aura-app`
***REMOVED******REMOVED******REMOVED***-***REMOVED*****Database***REMOVED***Password**:***REMOVED***Generate***REMOVED***a***REMOVED***strong***REMOVED***password***REMOVED***(save***REMOVED***it!)
***REMOVED******REMOVED******REMOVED***-***REMOVED*****Region**:***REMOVED***Choose***REMOVED***closest***REMOVED***to***REMOVED***your***REMOVED***users
4.***REMOVED***Click***REMOVED*****"Create***REMOVED***new***REMOVED***project"**
5.***REMOVED***Wait***REMOVED***~2***REMOVED***minutes***REMOVED***for***REMOVED***provisioning

###***REMOVED***Step***REMOVED***2:***REMOVED***Get***REMOVED***Your***REMOVED***Supabase***REMOVED***Credentials***REMOVED***(2***REMOVED***minutes)

1.***REMOVED***In***REMOVED***your***REMOVED***Supabase***REMOVED***dashboard,***REMOVED***go***REMOVED***to***REMOVED*****Settings*****REMOVED***→***REMOVED*****API**
2.***REMOVED***Copy***REMOVED***these***REMOVED***values:
***REMOVED******REMOVED******REMOVED***-***REMOVED*****Project***REMOVED***URL**:***REMOVED***`https://xxxxx.supabase.co`
***REMOVED******REMOVED******REMOVED***-***REMOVED*****anon***REMOVED***public***REMOVED***key**:***REMOVED***Long***REMOVED***key***REMOVED***starting***REMOVED***with***REMOVED***`eyJhbGc...`
***REMOVED******REMOVED******REMOVED***-***REMOVED*****service_role***REMOVED***key**:***REMOVED***Another***REMOVED***long***REMOVED***key***REMOVED***(keep***REMOVED***this***REMOVED***SECRET!)

###***REMOVED***Step***REMOVED***3:***REMOVED***Update***REMOVED***Environment***REMOVED***Variables***REMOVED***(2***REMOVED***minutes)

Edit***REMOVED***your***REMOVED***`.env.local`***REMOVED***file:

```env
#***REMOVED***Supabase***REMOVED***Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=REDACTED
SUPABASE_SERVICE_ROLE_KEY=REDACTED

#***REMOVED***Google***REMOVED***OAuth***REMOVED***(already***REMOVED***configured)
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
```

###***REMOVED***Step***REMOVED***4:***REMOVED***Run***REMOVED***Database***REMOVED***Migrations***REMOVED***(3***REMOVED***minutes)

####***REMOVED***Option***REMOVED***A:***REMOVED***Using***REMOVED***Supabase***REMOVED***Dashboard***REMOVED***(Recommended)

1.***REMOVED***Go***REMOVED***to***REMOVED*****SQL***REMOVED***Editor*****REMOVED***in***REMOVED***your***REMOVED***Supabase***REMOVED***dashboard
2.***REMOVED***Click***REMOVED*****"New***REMOVED***Query"**
3.***REMOVED***Copy***REMOVED***the***REMOVED***entire***REMOVED***content***REMOVED***from***REMOVED***`supabase/migrations/001_initial_schema.sql`
4.***REMOVED***Paste***REMOVED***and***REMOVED***click***REMOVED*****"Run"**
5.***REMOVED***You***REMOVED***should***REMOVED***see***REMOVED***"Success.***REMOVED***No***REMOVED***rows***REMOVED***returned"
6.***REMOVED***Click***REMOVED*****"New***REMOVED***Query"*****REMOVED***again
7.***REMOVED***Copy***REMOVED***the***REMOVED***entire***REMOVED***content***REMOVED***from***REMOVED***`supabase/migrations/002_add_google_oauth_tokens.sql`
8.***REMOVED***Paste***REMOVED***and***REMOVED***click***REMOVED*****"Run"**
9.***REMOVED***You***REMOVED***should***REMOVED***see***REMOVED***"Success.***REMOVED***No***REMOVED***rows***REMOVED***returned"

####***REMOVED***Option***REMOVED***B:***REMOVED***Using***REMOVED***Supabase***REMOVED***CLI

```bash
#***REMOVED***Install***REMOVED***Supabase***REMOVED***CLI
npm***REMOVED***install***REMOVED***-g***REMOVED***supabase

#***REMOVED***Login
supabase***REMOVED***login

#***REMOVED***Link***REMOVED***to***REMOVED***your***REMOVED***project
supabase***REMOVED***link***REMOVED***--project-ref***REMOVED***your-project-ref

#***REMOVED***Run***REMOVED***migrations
supabase***REMOVED***db***REMOVED***push
```

###***REMOVED***Step***REMOVED***5:***REMOVED***Configure***REMOVED***Google***REMOVED***OAuth***REMOVED***in***REMOVED***Supabase***REMOVED***(5***REMOVED***minutes)

1.***REMOVED***In***REMOVED***Supabase***REMOVED***dashboard,***REMOVED***go***REMOVED***to***REMOVED*****Authentication*****REMOVED***→***REMOVED*****Providers**
2.***REMOVED***Find***REMOVED*****Google*****REMOVED***and***REMOVED***click***REMOVED***to***REMOVED***expand
3.***REMOVED***Toggle***REMOVED*****"Enable***REMOVED***Google***REMOVED***provider"*****REMOVED***to***REMOVED***ON
4.***REMOVED***Enter***REMOVED***your***REMOVED***credentials:
***REMOVED******REMOVED******REMOVED***-***REMOVED*****Client***REMOVED***ID**:***REMOVED***`REDACTED_GOOGLE_CLIENT_ID`
***REMOVED******REMOVED******REMOVED***-***REMOVED*****Client***REMOVED***Secret**:***REMOVED***`REDACTED_GOOGLE_CLIENT_SECRET`
5.***REMOVED***In***REMOVED*****"Authorized***REMOVED***Client***REMOVED***IDs"**,***REMOVED***leave***REMOVED***empty***REMOVED***(optional)
6.***REMOVED***Click***REMOVED*****"Save"**

###***REMOVED***Step***REMOVED***6:***REMOVED***Configure***REMOVED***Redirect***REMOVED***URLs***REMOVED***(2***REMOVED***minutes)

1.***REMOVED***Still***REMOVED***in***REMOVED*****Authentication*****REMOVED***→***REMOVED*****URL***REMOVED***Configuration**
2.***REMOVED***Add***REMOVED***these***REMOVED***redirect***REMOVED***URLs:
***REMOVED******REMOVED******REMOVED***-***REMOVED***Development:***REMOVED***`http://localhost:3000/auth/callback`
***REMOVED******REMOVED******REMOVED***-***REMOVED***Production:***REMOVED***`https://yourdomain.com/auth/callback`***REMOVED***(when***REMOVED***you***REMOVED***deploy)
3.***REMOVED***Set***REMOVED*****Site***REMOVED***URL**:***REMOVED***`http://localhost:3000`***REMOVED***(or***REMOVED***your***REMOVED***production***REMOVED***URL)
4.***REMOVED***Click***REMOVED*****"Save"**

###***REMOVED***Step***REMOVED***7:***REMOVED***Configure***REMOVED***Google***REMOVED***Cloud***REMOVED***Console***REMOVED***(5***REMOVED***minutes)

1.***REMOVED***Go***REMOVED***to***REMOVED***[Google***REMOVED***Cloud***REMOVED***Console](https://console.cloud.google.com)
2.***REMOVED***Select***REMOVED***your***REMOVED***project
3.***REMOVED***Go***REMOVED***to***REMOVED*****APIs***REMOVED***&***REMOVED***Services*****REMOVED***→***REMOVED*****Credentials**
4.***REMOVED***Click***REMOVED***on***REMOVED***your***REMOVED***OAuth***REMOVED***2.0***REMOVED***Client***REMOVED***ID
5.***REMOVED***Add***REMOVED*****Authorized***REMOVED***redirect***REMOVED***URIs**:
***REMOVED******REMOVED******REMOVED***-***REMOVED***`http://localhost:3000/auth/callback`
***REMOVED******REMOVED******REMOVED***-***REMOVED***`https://your-project.supabase.co/auth/v1/callback`
6.***REMOVED***Click***REMOVED*****"Save"**

###***REMOVED***Step***REMOVED***8:***REMOVED***Enable***REMOVED***Required***REMOVED***Google***REMOVED***APIs***REMOVED***(3***REMOVED***minutes)

In***REMOVED***Google***REMOVED***Cloud***REMOVED***Console,***REMOVED***go***REMOVED***to***REMOVED*****APIs***REMOVED***&***REMOVED***Services*****REMOVED***→***REMOVED*****Library*****REMOVED***and***REMOVED***enable:

-***REMOVED***✅***REMOVED***Gmail***REMOVED***API
-***REMOVED***✅***REMOVED***Google***REMOVED***Drive***REMOVED***API
-***REMOVED***✅***REMOVED***Google***REMOVED***Docs***REMOVED***API
-***REMOVED***✅***REMOVED***Google***REMOVED***Sheets***REMOVED***API
-***REMOVED***✅***REMOVED***Google***REMOVED***Calendar***REMOVED***API

###***REMOVED***Step***REMOVED***9:***REMOVED***Test***REMOVED***Your***REMOVED***Setup***REMOVED***(2***REMOVED***minutes)

```bash
#***REMOVED***Start***REMOVED***your***REMOVED***development***REMOVED***server
npm***REMOVED***run***REMOVED***dev
```

Visit***REMOVED***`http://localhost:3000`***REMOVED***and***REMOVED***try***REMOVED***signing***REMOVED***in***REMOVED***with***REMOVED***Google!

##***REMOVED***🗄️***REMOVED***Database***REMOVED***Schema

###***REMOVED***Tables***REMOVED***Created

####***REMOVED***1.***REMOVED***`profiles`
Stores***REMOVED***user***REMOVED***profile***REMOVED***information.

```sql
-***REMOVED***id:***REMOVED***UUID***REMOVED***(references***REMOVED***auth.users)
-***REMOVED***email:***REMOVED***TEXT
-***REMOVED***full_name:***REMOVED***TEXT
-***REMOVED***avatar_url:***REMOVED***TEXT
-***REMOVED***preferences:***REMOVED***JSONB
-***REMOVED***google_access_token:***REMOVED***TEXT***REMOVED***(deprecated,***REMOVED***use***REMOVED***oauth_tokens)
-***REMOVED***google_refresh_token:***REMOVED***TEXT***REMOVED***(deprecated,***REMOVED***use***REMOVED***oauth_tokens)
-***REMOVED***google_token_expires_at:***REMOVED***TIMESTAMPTZ***REMOVED***(deprecated)
-***REMOVED***google_scopes:***REMOVED***TEXT[]***REMOVED***(deprecated)
-***REMOVED***created_at:***REMOVED***TIMESTAMPTZ
-***REMOVED***updated_at:***REMOVED***TIMESTAMPTZ
```

####***REMOVED***2.***REMOVED***`oauth_tokens`***REMOVED***(Secure***REMOVED***Token***REMOVED***Storage)
Stores***REMOVED***Google***REMOVED***OAuth***REMOVED***tokens***REMOVED***securely.

```sql
-***REMOVED***id:***REMOVED***UUID
-***REMOVED***user_id:***REMOVED***UUID***REMOVED***(references***REMOVED***profiles)
-***REMOVED***provider:***REMOVED***TEXT***REMOVED***(default:***REMOVED***'google')
-***REMOVED***access_token:***REMOVED***TEXT
-***REMOVED***refresh_token:***REMOVED***TEXT
-***REMOVED***token_type:***REMOVED***TEXT***REMOVED***(default:***REMOVED***'Bearer')
-***REMOVED***expires_at:***REMOVED***TIMESTAMPTZ
-***REMOVED***scopes:***REMOVED***TEXT[]
-***REMOVED***created_at:***REMOVED***TIMESTAMPTZ
-***REMOVED***updated_at:***REMOVED***TIMESTAMPTZ
```

####***REMOVED***3.***REMOVED***`workflows`
Stores***REMOVED***workflow***REMOVED***execution***REMOVED***data.

```sql
-***REMOVED***id:***REMOVED***UUID
-***REMOVED***user_id:***REMOVED***UUID***REMOVED***(references***REMOVED***profiles)
-***REMOVED***command:***REMOVED***TEXT
-***REMOVED***status:***REMOVED***workflow_status***REMOVED***ENUM
-***REMOVED***steps:***REMOVED***JSONB
-***REMOVED***results:***REMOVED***JSONB
-***REMOVED***error:***REMOVED***TEXT
-***REMOVED***start_time:***REMOVED***TIMESTAMPTZ
-***REMOVED***end_time:***REMOVED***TIMESTAMPTZ
-***REMOVED***created_at:***REMOVED***TIMESTAMPTZ
-***REMOVED***updated_at:***REMOVED***TIMESTAMPTZ
```

####***REMOVED***4.***REMOVED***`workflow_history`
Stores***REMOVED***workflow***REMOVED***execution***REMOVED***history.

```sql
-***REMOVED***id:***REMOVED***UUID
-***REMOVED***user_id:***REMOVED***UUID***REMOVED***(references***REMOVED***profiles)
-***REMOVED***workflow_id:***REMOVED***UUID***REMOVED***(references***REMOVED***workflows)
-***REMOVED***command:***REMOVED***TEXT
-***REMOVED***status:***REMOVED***TEXT
-***REMOVED***executed_at:***REMOVED***TIMESTAMPTZ
-***REMOVED***created_at:***REMOVED***TIMESTAMPTZ
```

##***REMOVED***🔐***REMOVED***Security***REMOVED***Features

###***REMOVED***Row***REMOVED***Level***REMOVED***Security***REMOVED***(RLS)
All***REMOVED***tables***REMOVED***have***REMOVED***RLS***REMOVED***enabled.***REMOVED***Users***REMOVED***can***REMOVED***only***REMOVED***access***REMOVED***their***REMOVED***own***REMOVED***data.

###***REMOVED***Token***REMOVED***Storage
-***REMOVED***OAuth***REMOVED***tokens***REMOVED***stored***REMOVED***in***REMOVED***separate***REMOVED***`oauth_tokens`***REMOVED***table
-***REMOVED***Encrypted***REMOVED***at***REMOVED***rest***REMOVED***by***REMOVED***Supabase
-***REMOVED***Only***REMOVED***accessible***REMOVED***by***REMOVED***the***REMOVED***token***REMOVED***owner
-***REMOVED***Automatic***REMOVED***cleanup***REMOVED***on***REMOVED***user***REMOVED***deletion

###***REMOVED***API***REMOVED***Security
-***REMOVED***All***REMOVED***API***REMOVED***routes***REMOVED***verify***REMOVED***authentication
-***REMOVED***Service***REMOVED***role***REMOVED***key***REMOVED***never***REMOVED***exposed***REMOVED***to***REMOVED***client
-***REMOVED***Tokens***REMOVED***refreshed***REMOVED***automatically***REMOVED***before***REMOVED***expiry

##***REMOVED***🔄***REMOVED***How***REMOVED***Token***REMOVED***Management***REMOVED***Works

###***REMOVED***1.***REMOVED***Initial***REMOVED***Sign-In
```
User***REMOVED***clicks***REMOVED***"Sign***REMOVED***in***REMOVED***with***REMOVED***Google"
***REMOVED******REMOVED***↓
Supabase***REMOVED***redirects***REMOVED***to***REMOVED***Google***REMOVED***OAuth
***REMOVED******REMOVED***↓
User***REMOVED***grants***REMOVED***permissions
***REMOVED******REMOVED***↓
Google***REMOVED***redirects***REMOVED***back***REMOVED***with***REMOVED***tokens
***REMOVED******REMOVED***↓
Tokens***REMOVED***stored***REMOVED***in***REMOVED***oauth_tokens***REMOVED***table
***REMOVED******REMOVED***↓
User***REMOVED***redirected***REMOVED***to***REMOVED***dashboard
```

###***REMOVED***2.***REMOVED***Token***REMOVED***Refresh***REMOVED***(Automatic)
```
User***REMOVED***makes***REMOVED***API***REMOVED***call
***REMOVED******REMOVED***↓
Check***REMOVED***if***REMOVED***token***REMOVED***expires***REMOVED***in***REMOVED***<***REMOVED***5***REMOVED***minutes
***REMOVED******REMOVED***↓
If***REMOVED***yes:***REMOVED***Call***REMOVED***refresh***REMOVED***endpoint
***REMOVED******REMOVED***↓
Exchange***REMOVED***refresh_token***REMOVED***for***REMOVED***new***REMOVED***access_token
***REMOVED******REMOVED***↓
Update***REMOVED***oauth_tokens***REMOVED***table
***REMOVED******REMOVED***↓
Return***REMOVED***new***REMOVED***access_token
```

###***REMOVED***3.***REMOVED***Using***REMOVED***Tokens***REMOVED***in***REMOVED***Your***REMOVED***Code

```tsx
import***REMOVED***{***REMOVED***useSupabaseAuth***REMOVED***}***REMOVED***from***REMOVED***"@/contexts/SupabaseAuthContext";

function***REMOVED***MyComponent()***REMOVED***{
***REMOVED******REMOVED***const***REMOVED***{***REMOVED***getGoogleAccessToken***REMOVED***}***REMOVED***=***REMOVED***useSupabaseAuth();
***REMOVED******REMOVED***
***REMOVED******REMOVED***const***REMOVED***callGoogleAPI***REMOVED***=***REMOVED***async***REMOVED***()***REMOVED***=>***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED***//***REMOVED***Automatically***REMOVED***gets***REMOVED***fresh***REMOVED***token***REMOVED***(refreshes***REMOVED***if***REMOVED***needed)
***REMOVED******REMOVED******REMOVED******REMOVED***const***REMOVED***token***REMOVED***=***REMOVED***await***REMOVED***getGoogleAccessToken();
***REMOVED******REMOVED******REMOVED******REMOVED***
***REMOVED******REMOVED******REMOVED******REMOVED***if***REMOVED***(!token)***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***console.error("No***REMOVED***valid***REMOVED***token***REMOVED***available");
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***return;
***REMOVED******REMOVED******REMOVED******REMOVED***}
***REMOVED******REMOVED******REMOVED******REMOVED***
***REMOVED******REMOVED******REMOVED******REMOVED***//***REMOVED***Use***REMOVED***token***REMOVED***to***REMOVED***call***REMOVED***Google***REMOVED***APIs
***REMOVED******REMOVED******REMOVED******REMOVED***const***REMOVED***response***REMOVED***=***REMOVED***await***REMOVED***fetch("https://www.googleapis.com/gmail/v1/users/me/messages",***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***headers:***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***Authorization:***REMOVED***`Bearer***REMOVED***${token}`,
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***},
***REMOVED******REMOVED******REMOVED******REMOVED***});
***REMOVED******REMOVED******REMOVED******REMOVED***
***REMOVED******REMOVED******REMOVED******REMOVED***const***REMOVED***data***REMOVED***=***REMOVED***await***REMOVED***response.json();
***REMOVED******REMOVED******REMOVED******REMOVED***return***REMOVED***data;
***REMOVED******REMOVED***};
***REMOVED******REMOVED***
***REMOVED******REMOVED***return***REMOVED***<button***REMOVED***onClick={callGoogleAPI}>Fetch***REMOVED***Emails</button>;
}
```

##***REMOVED***📝***REMOVED***API***REMOVED***Routes***REMOVED***Created

###***REMOVED***`GET***REMOVED***/api/auth/status`
Check***REMOVED***current***REMOVED***authentication***REMOVED***status***REMOVED***and***REMOVED***Google***REMOVED***OAuth***REMOVED***connection.

**Response:**
```json
{
***REMOVED******REMOVED***"isAuthenticated":***REMOVED***true,
***REMOVED******REMOVED***"session":***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED***"userId":***REMOVED***"uuid",
***REMOVED******REMOVED******REMOVED******REMOVED***"email":***REMOVED***"user@example.com",
***REMOVED******REMOVED******REMOVED******REMOVED***"oauthStatus":***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***"isConnected":***REMOVED***true,
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***"userEmail":***REMOVED***"user@example.com",
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***"scopes":***REMOVED***["gmail.modify",***REMOVED***"drive.file",***REMOVED***...],
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***"expiresAt":***REMOVED***"2024-01-01T12:00:00Z"
***REMOVED******REMOVED******REMOVED******REMOVED***},
***REMOVED******REMOVED******REMOVED******REMOVED***"preferences":***REMOVED***{***REMOVED***...***REMOVED***}
***REMOVED******REMOVED***}
}
```

###***REMOVED***`POST***REMOVED***/api/auth/refresh-google-token`
Refresh***REMOVED***Google***REMOVED***OAuth***REMOVED***access***REMOVED***token.

**Request:**
```json
{
***REMOVED******REMOVED***"refreshToken":***REMOVED***"your_refresh_token"
}
```

**Response:**
```json
{
***REMOVED******REMOVED***"access_token":***REMOVED***"new_access_token",
***REMOVED******REMOVED***"expires_in":***REMOVED***3600,
***REMOVED******REMOVED***"token_type":***REMOVED***"Bearer"
}
```

###***REMOVED***`POST***REMOVED***/api/auth/disconnect`
Disconnect***REMOVED***Google***REMOVED***account***REMOVED***and***REMOVED***revoke***REMOVED***tokens.

**Response:**
```json
{
***REMOVED******REMOVED***"success":***REMOVED***true,
***REMOVED******REMOVED***"message":***REMOVED***"Successfully***REMOVED***disconnected***REMOVED***Google***REMOVED***account"
}
```

###***REMOVED***`GET***REMOVED***/auth/callback`
OAuth***REMOVED***callback***REMOVED***handler***REMOVED***(automatically***REMOVED***called***REMOVED***by***REMOVED***Supabase).

##***REMOVED***🧪***REMOVED***Testing***REMOVED***Your***REMOVED***Setup

###***REMOVED***1.***REMOVED***Test***REMOVED***Authentication
```bash
npm***REMOVED***run***REMOVED***dev
```
-***REMOVED***Visit***REMOVED***`http://localhost:3000`
-***REMOVED***Click***REMOVED***"Sign***REMOVED***in***REMOVED***with***REMOVED***Google"
-***REMOVED***Grant***REMOVED***permissions
-***REMOVED***Should***REMOVED***redirect***REMOVED***to***REMOVED***dashboard

###***REMOVED***2.***REMOVED***Test***REMOVED***Token***REMOVED***Storage
```sql
--***REMOVED***In***REMOVED***Supabase***REMOVED***SQL***REMOVED***Editor
SELECT***REMOVED*******REMOVED***FROM***REMOVED***oauth_tokens***REMOVED***WHERE***REMOVED***user_id***REMOVED***=***REMOVED***'your-user-id';
```

###***REMOVED***3.***REMOVED***Test***REMOVED***Token***REMOVED***Refresh
```tsx
//***REMOVED***In***REMOVED***your***REMOVED***component
const***REMOVED***{***REMOVED***refreshGoogleToken***REMOVED***}***REMOVED***=***REMOVED***useSupabaseAuth();
await***REMOVED***refreshGoogleToken();
```

##***REMOVED***🐛***REMOVED***Troubleshooting

###***REMOVED***"Invalid***REMOVED***API***REMOVED***key"
-***REMOVED***✅***REMOVED***Check***REMOVED***`.env.local`***REMOVED***has***REMOVED***correct***REMOVED***Supabase***REMOVED***credentials
-***REMOVED***✅***REMOVED***Restart***REMOVED***dev***REMOVED***server***REMOVED***after***REMOVED***changing***REMOVED***env***REMOVED***vars
-***REMOVED***✅***REMOVED***Verify***REMOVED***no***REMOVED***extra***REMOVED***spaces***REMOVED***or***REMOVED***quotes***REMOVED***in***REMOVED***env***REMOVED***values

###***REMOVED***"Redirect***REMOVED***URI***REMOVED***mismatch"
-***REMOVED***✅***REMOVED***Check***REMOVED***redirect***REMOVED***URLs***REMOVED***in***REMOVED***Supabase***REMOVED***match***REMOVED***Google***REMOVED***Cloud***REMOVED***Console
-***REMOVED***✅***REMOVED***Ensure***REMOVED***`http://localhost:3000/auth/callback`***REMOVED***is***REMOVED***added***REMOVED***to***REMOVED***both
-***REMOVED***✅***REMOVED***Add***REMOVED***Supabase***REMOVED***callback***REMOVED***URL:***REMOVED***`https://your-project.supabase.co/auth/v1/callback`

###***REMOVED***"Failed***REMOVED***to***REMOVED***fetch"
-***REMOVED***✅***REMOVED***Check***REMOVED***Supabase***REMOVED***project***REMOVED***is***REMOVED***active
-***REMOVED***✅***REMOVED***Verify***REMOVED***network***REMOVED***connectivity
-***REMOVED***✅***REMOVED***Check***REMOVED***browser***REMOVED***console***REMOVED***for***REMOVED***detailed***REMOVED***errors

###***REMOVED***"Token***REMOVED***refresh***REMOVED***failed"
-***REMOVED***✅***REMOVED***Verify***REMOVED***refresh***REMOVED***token***REMOVED***exists***REMOVED***in***REMOVED***database
-***REMOVED***✅***REMOVED***Check***REMOVED***Google***REMOVED***OAuth***REMOVED***credentials***REMOVED***are***REMOVED***correct
-***REMOVED***✅***REMOVED***Ensure***REMOVED***user***REMOVED***hasn't***REMOVED***revoked***REMOVED***access***REMOVED***in***REMOVED***Google***REMOVED***account***REMOVED***settings

###***REMOVED***"RLS***REMOVED***policy***REMOVED***violation"
-***REMOVED***✅***REMOVED***Verify***REMOVED***migrations***REMOVED***ran***REMOVED***successfully
-***REMOVED***✅***REMOVED***Check***REMOVED***user***REMOVED***is***REMOVED***authenticated
-***REMOVED***✅***REMOVED***Ensure***REMOVED***RLS***REMOVED***policies***REMOVED***are***REMOVED***created

##***REMOVED***📚***REMOVED***Next***REMOVED***Steps

1.***REMOVED***✅***REMOVED*****Update***REMOVED***existing***REMOVED***components*****REMOVED***to***REMOVED***use***REMOVED***`useSupabaseAuth()`***REMOVED***instead***REMOVED***of***REMOVED***old***REMOVED***`useAuth()`
2.***REMOVED***✅***REMOVED*****Test***REMOVED***Google***REMOVED***API***REMOVED***calls*****REMOVED***with***REMOVED***stored***REMOVED***tokens
3.***REMOVED***✅***REMOVED*****Implement***REMOVED***workflow***REMOVED***storage*****REMOVED***in***REMOVED***Supabase
4.***REMOVED***✅***REMOVED*****Add***REMOVED***history***REMOVED***tracking*****REMOVED***using***REMOVED***workflow_history***REMOVED***table
5.***REMOVED***✅***REMOVED*****Deploy***REMOVED***to***REMOVED***production*****REMOVED***and***REMOVED***update***REMOVED***environment***REMOVED***variables

##***REMOVED***🔗***REMOVED***Useful***REMOVED***Links

-***REMOVED***[Supabase***REMOVED***Documentation](https://supabase.com/docs)
-***REMOVED***[Supabase***REMOVED***Auth***REMOVED***Helpers](https://supabase.com/docs/guides/auth/auth-helpers/nextjs)
-***REMOVED***[Google***REMOVED***OAuth***REMOVED***Documentation](https://developers.google.com/identity/protocols/oauth2)
-***REMOVED***[Gmail***REMOVED***API***REMOVED***Reference](https://developers.google.com/gmail/api)
-***REMOVED***[Google***REMOVED***Drive***REMOVED***API***REMOVED***Reference](https://developers.google.com/drive/api)

##***REMOVED***💡***REMOVED***Tips

-***REMOVED*****Development**:***REMOVED***Use***REMOVED***`http://localhost:3000`***REMOVED***for***REMOVED***testing
-***REMOVED*****Production**:***REMOVED***Update***REMOVED***all***REMOVED***URLs***REMOVED***to***REMOVED***your***REMOVED***production***REMOVED***domain
-***REMOVED*****Security**:***REMOVED***Never***REMOVED***commit***REMOVED***`.env.local`***REMOVED***to***REMOVED***git
-***REMOVED*****Monitoring**:***REMOVED***Check***REMOVED***Supabase***REMOVED***dashboard***REMOVED***for***REMOVED***auth***REMOVED***logs
-***REMOVED*****Debugging**:***REMOVED***Enable***REMOVED***verbose***REMOVED***logging***REMOVED***in***REMOVED***Supabase***REMOVED***settings

---

**Need***REMOVED***help?*****REMOVED***Check***REMOVED***the***REMOVED***[Supabase***REMOVED***Discord](https://discord.supabase.com)***REMOVED***or***REMOVED***[GitHub***REMOVED***Discussions](https://github.com/supabase/supabase/discussions)
