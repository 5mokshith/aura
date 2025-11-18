#***REMOVED***Authentication***REMOVED***Setup***REMOVED***Guide

This***REMOVED***guide***REMOVED***explains***REMOVED***how***REMOVED***to***REMOVED***set***REMOVED***up***REMOVED***Google***REMOVED***OAuth***REMOVED***authentication***REMOVED***for***REMOVED***AURA.

##***REMOVED***Prerequisites

1.***REMOVED***A***REMOVED***Google***REMOVED***Cloud***REMOVED***Platform***REMOVED***(GCP)***REMOVED***project
2.***REMOVED***OAuth***REMOVED***2.0***REMOVED***credentials***REMOVED***configured***REMOVED***in***REMOVED***GCP***REMOVED***Console

##***REMOVED***Google***REMOVED***Cloud***REMOVED***Setup

###***REMOVED***1.***REMOVED***Create***REMOVED***OAuth***REMOVED***2.0***REMOVED***Credentials

1.***REMOVED***Go***REMOVED***to***REMOVED***[Google***REMOVED***Cloud***REMOVED***Console](https://console.cloud.google.com/)
2.***REMOVED***Select***REMOVED***or***REMOVED***create***REMOVED***a***REMOVED***project
3.***REMOVED***Navigate***REMOVED***to***REMOVED*****APIs***REMOVED***&***REMOVED***Services*****REMOVED***>***REMOVED*****Credentials**
4.***REMOVED***Click***REMOVED*****Create***REMOVED***Credentials*****REMOVED***>***REMOVED*****OAuth***REMOVED***client***REMOVED***ID**
5.***REMOVED***Select***REMOVED*****Web***REMOVED***application*****REMOVED***as***REMOVED***the***REMOVED***application***REMOVED***type
6.***REMOVED***Configure***REMOVED***the***REMOVED***OAuth***REMOVED***consent***REMOVED***screen***REMOVED***if***REMOVED***prompted

###***REMOVED***2.***REMOVED***Configure***REMOVED***Authorized***REMOVED***Redirect***REMOVED***URIs

Add***REMOVED***the***REMOVED***following***REMOVED***redirect***REMOVED***URIs:

-***REMOVED***Development:***REMOVED***`http://localhost:3000/auth/callback`
-***REMOVED***Production:***REMOVED***`https://yourdomain.com/auth/callback`

###***REMOVED***3.***REMOVED***Enable***REMOVED***Required***REMOVED***APIs

Enable***REMOVED***the***REMOVED***following***REMOVED***Google***REMOVED***APIs***REMOVED***in***REMOVED***your***REMOVED***project:

-***REMOVED***Gmail***REMOVED***API
-***REMOVED***Google***REMOVED***Drive***REMOVED***API
-***REMOVED***Google***REMOVED***Docs***REMOVED***API
-***REMOVED***Google***REMOVED***Sheets***REMOVED***API
-***REMOVED***Google***REMOVED***Calendar***REMOVED***API

##***REMOVED***Environment***REMOVED***Configuration

1.***REMOVED***Copy***REMOVED***`.env.local.example`***REMOVED***to***REMOVED***`.env.local`:

```bash
cp***REMOVED***.env.local.example***REMOVED***.env.local
```

2.***REMOVED***Fill***REMOVED***in***REMOVED***your***REMOVED***OAuth***REMOVED***credentials:

```env
#***REMOVED***OAuth***REMOVED***Configuration
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_client_id_here.apps.googleusercontent.com
GOOGLE_CLIENT_ID=your_client_id_here.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=REDACTED
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=generate_a_random_secret_here
```

###***REMOVED***Generate***REMOVED***NEXTAUTH_SECRET

Run***REMOVED***this***REMOVED***command***REMOVED***to***REMOVED***generate***REMOVED***a***REMOVED***secure***REMOVED***random***REMOVED***secret:

```bash
openssl***REMOVED***rand***REMOVED***-base64***REMOVED***32
```

##***REMOVED***OAuth***REMOVED***Scopes

AURA***REMOVED***requests***REMOVED***the***REMOVED***following***REMOVED***OAuth***REMOVED***scopes:

-***REMOVED***`https://www.googleapis.com/auth/gmail.modify`***REMOVED***-***REMOVED***Read***REMOVED***and***REMOVED***send***REMOVED***emails
-***REMOVED***`https://www.googleapis.com/auth/drive.file`***REMOVED***-***REMOVED***Create***REMOVED***and***REMOVED***manage***REMOVED***Drive***REMOVED***files
-***REMOVED***`https://www.googleapis.com/auth/documents`***REMOVED***-***REMOVED***Create***REMOVED***and***REMOVED***edit***REMOVED***Google***REMOVED***Docs
-***REMOVED***`https://www.googleapis.com/auth/spreadsheets`***REMOVED***-***REMOVED***Create***REMOVED***and***REMOVED***edit***REMOVED***Google***REMOVED***Sheets
-***REMOVED***`https://www.googleapis.com/auth/calendar`***REMOVED***-***REMOVED***Manage***REMOVED***calendar***REMOVED***events

##***REMOVED***Authentication***REMOVED***Flow

1.***REMOVED*****Login**:***REMOVED***User***REMOVED***clicks***REMOVED***"Connect***REMOVED***Google***REMOVED***Account"***REMOVED***on***REMOVED***`/login`
2.***REMOVED*****OAuth***REMOVED***Redirect**:***REMOVED***User***REMOVED***is***REMOVED***redirected***REMOVED***to***REMOVED***Google's***REMOVED***OAuth***REMOVED***consent***REMOVED***screen
3.***REMOVED*****Authorization**:***REMOVED***User***REMOVED***grants***REMOVED***permissions***REMOVED***to***REMOVED***AURA
4.***REMOVED*****Callback**:***REMOVED***Google***REMOVED***redirects***REMOVED***back***REMOVED***to***REMOVED***`/auth/callback`***REMOVED***with***REMOVED***authorization***REMOVED***code
5.***REMOVED*****Token***REMOVED***Exchange**:***REMOVED***Backend***REMOVED***exchanges***REMOVED***code***REMOVED***for***REMOVED***access***REMOVED***and***REMOVED***refresh***REMOVED***tokens
6.***REMOVED*****Session***REMOVED***Creation**:***REMOVED***Tokens***REMOVED***are***REMOVED***stored***REMOVED***in***REMOVED***httpOnly***REMOVED***cookies
7.***REMOVED*****Dashboard**:***REMOVED***User***REMOVED***is***REMOVED***redirected***REMOVED***to***REMOVED***the***REMOVED***dashboard

##***REMOVED***Token***REMOVED***Management

###***REMOVED***Access***REMOVED***Tokens

-***REMOVED***Stored***REMOVED***in***REMOVED***httpOnly***REMOVED***cookies***REMOVED***for***REMOVED***security
-***REMOVED***Expire***REMOVED***after***REMOVED***1***REMOVED***hour
-***REMOVED***Automatically***REMOVED***refreshed***REMOVED***using***REMOVED***refresh***REMOVED***token

###***REMOVED***Refresh***REMOVED***Tokens

-***REMOVED***Stored***REMOVED***in***REMOVED***httpOnly***REMOVED***cookies
-***REMOVED***Valid***REMOVED***for***REMOVED***30***REMOVED***days
-***REMOVED***Used***REMOVED***to***REMOVED***obtain***REMOVED***new***REMOVED***access***REMOVED***tokens***REMOVED***without***REMOVED***re-authentication

###***REMOVED***Token***REMOVED***Refresh

The***REMOVED***`AuthContext`***REMOVED***automatically:

-***REMOVED***Checks***REMOVED***token***REMOVED***expiration***REMOVED***on***REMOVED***every***REMOVED***auth***REMOVED***status***REMOVED***request
-***REMOVED***Refreshes***REMOVED***expired***REMOVED***tokens***REMOVED***using***REMOVED***the***REMOVED***refresh***REMOVED***token
-***REMOVED***Prompts***REMOVED***re-authentication***REMOVED***if***REMOVED***refresh***REMOVED***fails
-***REMOVED***Checks***REMOVED***token***REMOVED***status***REMOVED***every***REMOVED***5***REMOVED***minutes

##***REMOVED***Security***REMOVED***Features

1.***REMOVED*****httpOnly***REMOVED***Cookies**:***REMOVED***Tokens***REMOVED***stored***REMOVED***in***REMOVED***httpOnly***REMOVED***cookies***REMOVED***prevent***REMOVED***XSS***REMOVED***attacks
2.***REMOVED*****Secure***REMOVED***Flag**:***REMOVED***Cookies***REMOVED***use***REMOVED***secure***REMOVED***flag***REMOVED***in***REMOVED***production***REMOVED***(HTTPS***REMOVED***only)
3.***REMOVED*****SameSite**:***REMOVED***Cookies***REMOVED***use***REMOVED***SameSite=lax***REMOVED***to***REMOVED***prevent***REMOVED***CSRF
4.***REMOVED*****Token***REMOVED***Revocation**:***REMOVED***Disconnect***REMOVED***properly***REMOVED***revokes***REMOVED***tokens***REMOVED***with***REMOVED***Google
5.***REMOVED*****Automatic***REMOVED***Cleanup**:***REMOVED***Expired/invalid***REMOVED***tokens***REMOVED***are***REMOVED***automatically***REMOVED***cleared

##***REMOVED***API***REMOVED***Routes

###***REMOVED***GET***REMOVED***/api/auth/status

Check***REMOVED***current***REMOVED***authentication***REMOVED***status.

**Response:**

```json
{
***REMOVED******REMOVED***"isAuthenticated":***REMOVED***true,
***REMOVED******REMOVED***"session":***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED***"userId":***REMOVED***"123456789",
***REMOVED******REMOVED******REMOVED******REMOVED***"email":***REMOVED***"user@example.com",
***REMOVED******REMOVED******REMOVED******REMOVED***"isAuthenticated":***REMOVED***true,
***REMOVED******REMOVED******REMOVED******REMOVED***"oauthStatus":***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***"isConnected":***REMOVED***true,
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***"userEmail":***REMOVED***"user@example.com",
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***"scopes":***REMOVED***["..."],
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***"expiresAt":***REMOVED***"2024-01-01T12:00:00Z"
***REMOVED******REMOVED******REMOVED******REMOVED***},
***REMOVED******REMOVED******REMOVED******REMOVED***"preferences":***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***"theme":***REMOVED***"system",
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***"notificationsEnabled":***REMOVED***true,
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***"defaultView":***REMOVED***"dashboard",
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***"favoriteActions":***REMOVED***[]
***REMOVED******REMOVED******REMOVED******REMOVED***}
***REMOVED******REMOVED***}
}
```

###***REMOVED***POST***REMOVED***/api/auth/callback

Exchange***REMOVED***authorization***REMOVED***code***REMOVED***for***REMOVED***tokens.

**Request:**

```json
{
***REMOVED******REMOVED***"code":***REMOVED***"authorization_code_from_google"
}
```

**Response:**

```json
{
***REMOVED******REMOVED***"success":***REMOVED***true,
***REMOVED******REMOVED***"message":***REMOVED***"Authentication***REMOVED***successful"
}
```

###***REMOVED***POST***REMOVED***/api/auth/disconnect

Revoke***REMOVED***tokens***REMOVED***and***REMOVED***disconnect***REMOVED***Google***REMOVED***account.

**Response:**

```json
{
***REMOVED******REMOVED***"success":***REMOVED***true,
***REMOVED******REMOVED***"message":***REMOVED***"Successfully***REMOVED***disconnected"
}
```

##***REMOVED***Usage***REMOVED***in***REMOVED***Components

###***REMOVED***Using***REMOVED***the***REMOVED***Auth***REMOVED***Hook

```tsx
"use***REMOVED***client";

import***REMOVED***{***REMOVED***useAuth***REMOVED***}***REMOVED***from***REMOVED***"@/contexts/AuthContext";

export***REMOVED***default***REMOVED***function***REMOVED***MyComponent()***REMOVED***{
***REMOVED******REMOVED***const***REMOVED***{***REMOVED***session,***REMOVED***isLoading,***REMOVED***login,***REMOVED***logout,***REMOVED***refreshAuth***REMOVED***}***REMOVED***=***REMOVED***useAuth();

***REMOVED******REMOVED***if***REMOVED***(isLoading)***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED***return***REMOVED***<div>Loading...</div>;
***REMOVED******REMOVED***}

***REMOVED******REMOVED***if***REMOVED***(!session?.isAuthenticated)***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED***return***REMOVED***<button***REMOVED***onClick={login}>Connect***REMOVED***Google***REMOVED***Account</button>;
***REMOVED******REMOVED***}

***REMOVED******REMOVED***return***REMOVED***(
***REMOVED******REMOVED******REMOVED******REMOVED***<div>
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***<p>Welcome,***REMOVED***{session.email}!</p>
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***<button***REMOVED***onClick={logout}>Disconnect</button>
***REMOVED******REMOVED******REMOVED******REMOVED***</div>
***REMOVED******REMOVED***);
}
```

###***REMOVED***Protected***REMOVED***Routes

```tsx
"use***REMOVED***client";

import***REMOVED***{***REMOVED***useAuth***REMOVED***}***REMOVED***from***REMOVED***"@/contexts/AuthContext";
import***REMOVED***{***REMOVED***useRouter***REMOVED***}***REMOVED***from***REMOVED***"next/navigation";
import***REMOVED***{***REMOVED***useEffect***REMOVED***}***REMOVED***from***REMOVED***"react";

export***REMOVED***default***REMOVED***function***REMOVED***ProtectedPage()***REMOVED***{
***REMOVED******REMOVED***const***REMOVED***{***REMOVED***session,***REMOVED***isLoading***REMOVED***}***REMOVED***=***REMOVED***useAuth();
***REMOVED******REMOVED***const***REMOVED***router***REMOVED***=***REMOVED***useRouter();

***REMOVED******REMOVED***useEffect(()***REMOVED***=>***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED***if***REMOVED***(!isLoading***REMOVED***&&***REMOVED***!session?.isAuthenticated)***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***router.push("/login");
***REMOVED******REMOVED******REMOVED******REMOVED***}
***REMOVED******REMOVED***},***REMOVED***[session,***REMOVED***isLoading,***REMOVED***router]);

***REMOVED******REMOVED***if***REMOVED***(isLoading***REMOVED***||***REMOVED***!session?.isAuthenticated)***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED***return***REMOVED***<div>Loading...</div>;
***REMOVED******REMOVED***}

***REMOVED******REMOVED***return***REMOVED***<div>Protected***REMOVED***content</div>;
}
```

##***REMOVED***Troubleshooting

###***REMOVED***"Failed***REMOVED***to***REMOVED***exchange***REMOVED***authorization***REMOVED***code"

-***REMOVED***Verify***REMOVED***`GOOGLE_CLIENT_ID`***REMOVED***and***REMOVED***`GOOGLE_CLIENT_SECRET`***REMOVED***are***REMOVED***correct
-***REMOVED***Check***REMOVED***that***REMOVED***redirect***REMOVED***URI***REMOVED***matches***REMOVED***exactly***REMOVED***in***REMOVED***GCP***REMOVED***Console
-***REMOVED***Ensure***REMOVED***authorization***REMOVED***code***REMOVED***hasn't***REMOVED***expired***REMOVED***(valid***REMOVED***for***REMOVED***10***REMOVED***minutes)

###***REMOVED***"Token***REMOVED***refresh***REMOVED***failed"

-***REMOVED***Refresh***REMOVED***token***REMOVED***may***REMOVED***have***REMOVED***expired***REMOVED***(30***REMOVED***days)
-***REMOVED***User***REMOVED***may***REMOVED***have***REMOVED***revoked***REMOVED***access***REMOVED***in***REMOVED***Google***REMOVED***account***REMOVED***settings
-***REMOVED***Prompt***REMOVED***user***REMOVED***to***REMOVED***reconnect***REMOVED***their***REMOVED***account

###***REMOVED***"Authentication***REMOVED***failed"

-***REMOVED***Check***REMOVED***that***REMOVED***all***REMOVED***required***REMOVED***APIs***REMOVED***are***REMOVED***enabled***REMOVED***in***REMOVED***GCP
-***REMOVED***Verify***REMOVED***OAuth***REMOVED***consent***REMOVED***screen***REMOVED***is***REMOVED***configured
-***REMOVED***Check***REMOVED***browser***REMOVED***console***REMOVED***for***REMOVED***detailed***REMOVED***error***REMOVED***messages

##***REMOVED***Testing

To***REMOVED***test***REMOVED***the***REMOVED***authentication***REMOVED***flow***REMOVED***locally:

1.***REMOVED***Start***REMOVED***the***REMOVED***development***REMOVED***server:***REMOVED***`npm***REMOVED***run***REMOVED***dev`
2.***REMOVED***Navigate***REMOVED***to***REMOVED***`http://localhost:3000`
3.***REMOVED***You***REMOVED***should***REMOVED***be***REMOVED***redirected***REMOVED***to***REMOVED***`/login`
4.***REMOVED***Click***REMOVED***"Connect***REMOVED***Google***REMOVED***Account"
5.***REMOVED***Complete***REMOVED***OAuth***REMOVED***flow***REMOVED***with***REMOVED***your***REMOVED***Google***REMOVED***account
6.***REMOVED***You***REMOVED***should***REMOVED***be***REMOVED***redirected***REMOVED***back***REMOVED***to***REMOVED***the***REMOVED***dashboard

##***REMOVED***Production***REMOVED***Deployment

Before***REMOVED***deploying***REMOVED***to***REMOVED***production:

1.***REMOVED***Update***REMOVED***`NEXTAUTH_URL`***REMOVED***to***REMOVED***your***REMOVED***production***REMOVED***domain
2.***REMOVED***Add***REMOVED***production***REMOVED***redirect***REMOVED***URI***REMOVED***to***REMOVED***GCP***REMOVED***Console
3.***REMOVED***Ensure***REMOVED***all***REMOVED***environment***REMOVED***variables***REMOVED***are***REMOVED***set***REMOVED***in***REMOVED***your***REMOVED***hosting***REMOVED***platform
4.***REMOVED***Test***REMOVED***the***REMOVED***complete***REMOVED***OAuth***REMOVED***flow***REMOVED***in***REMOVED***production
5.***REMOVED***Monitor***REMOVED***token***REMOVED***refresh***REMOVED***and***REMOVED***expiration***REMOVED***handling
