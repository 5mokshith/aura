# Supabase Integration

This directory contains all Supabase-related utilities for AURA.

## Files Overview

### `client.ts`
Browser-side Supabase client for use in React components.

```tsx
import { createClient } from "@/lib/supabase/client";

const supabase = createClient();
const { data, error } = await supabase.from("profiles").select("*");
```

### `server.ts`
Server-side Supabase client for use in Server Components and API routes.

```tsx
import { createClient } from "@/lib/supabase/server";

const supabase = await createClient();
const { data: { user } } = await supabase.auth.getUser();
```

### `middleware.ts`
Middleware utilities for handling auth state in Next.js middleware.

```tsx
import { updateSession } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  return await updateSession(request);
}
```

### `database.types.ts`
TypeScript types generated from your Supabase database schema.

**Regenerate types:**
```bash
npx supabase gen types typescript --project-id YOUR_PROJECT_ID > lib/supabase/database.types.ts
```

### `queries.ts`
Pre-built database query functions with proper typing.

```tsx
import { getProfile, updateProfile, getUserWorkflows } from "@/lib/supabase/queries";

// Get user profile
const profile = await getProfile(userId);

// Update profile
await updateProfile(userId, { full_name: "John Doe" });

// Get workflows
const workflows = await getUserWorkflows(userId, 10);
```

## Usage Patterns

### Client Components

```tsx
"use client";

import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";

export default function MyComponent() {
  const [data, setData] = useState(null);
  const supabase = createClient();

  useEffect(() => {
    async function fetchData() {
      const { data } = await supabase.from("profiles").select("*");
      setData(data);
    }
    fetchData();
  }, []);

  return <div>{/* render data */}</div>;
}
```

### Server Components

```tsx
import { createClient } from "@/lib/supabase/server";

export default async function MyPage() {
  const supabase = await createClient();
  const { data } = await supabase.from("profiles").select("*");

  return <div>{/* render data */}</div>;
}
```

### API Routes

```tsx
import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data } = await supabase.from("profiles").select("*");
  return NextResponse.json({ data });
}
```

### Using Query Helpers

```tsx
import { getProfile, updateProfile } from "@/lib/supabase/queries";

// In a Server Component or API route
const profile = await getProfile(userId);

await updateProfile(userId, {
  full_name: "Jane Doe",
  preferences: { theme: "dark" }
});
```

## Authentication

### Check Auth Status

```tsx
const supabase = createClient();
const { data: { user } } = await supabase.auth.getUser();

if (user) {
  console.log("User is authenticated:", user.email);
}
```

### Sign In with Google

```tsx
const { data, error } = await supabase.auth.signInWithOAuth({
  provider: "google",
  options: {
    redirectTo: `${window.location.origin}/auth/callback`,
  },
});
```

### Sign Out

```tsx
const { error } = await supabase.auth.signOut();
```

## Database Operations

### Select

```tsx
const { data, error } = await supabase
  .from("workflows")
  .select("*")
  .eq("user_id", userId)
  .order("created_at", { ascending: false })
  .limit(10);
```

### Insert

```tsx
const { data, error } = await supabase
  .from("workflows")
  .insert({
    user_id: userId,
    command: "Create summary",
    status: "planning",
  })
  .select()
  .single();
```

### Update

```tsx
const { data, error } = await supabase
  .from("workflows")
  .update({ status: "completed" })
  .eq("id", workflowId)
  .select()
  .single();
```

### Delete

```tsx
const { error } = await supabase
  .from("workflow_history")
  .delete()
  .eq("id", historyId);
```

## Real-time Subscriptions

```tsx
const channel = supabase
  .channel('workflow-changes')
  .on(
    'postgres_changes',
    {
      event: 'UPDATE',
      schema: 'public',
      table: 'workflows',
      filter: `user_id=eq.${userId}`
    },
    (payload) => {
      console.log('Change received!', payload);
    }
  )
  .subscribe();

// Cleanup
return () => {
  supabase.removeChannel(channel);
};
```

## Error Handling

```tsx
const { data, error } = await supabase
  .from("profiles")
  .select("*")
  .eq("id", userId)
  .single();

if (error) {
  console.error("Database error:", error.message);
  // Handle error appropriately
  return;
}

// Use data safely
console.log(data);
```

## Type Safety

All queries are fully typed when using the generated types:

```tsx
import type { Database } from "./database.types";

type Profile = Database["public"]["Tables"]["profiles"]["Row"];
type WorkflowInsert = Database["public"]["Tables"]["workflows"]["Insert"];

const profile: Profile = await getProfile(userId);
```

## Best Practices

1. **Use query helpers** from `queries.ts` for common operations
2. **Always check for errors** after database operations
3. **Use server-side client** for sensitive operations
4. **Leverage RLS policies** for security
5. **Type your queries** using generated types
6. **Handle loading states** in components
7. **Clean up subscriptions** in useEffect cleanup

## Security Notes

- Never expose `SUPABASE_SERVICE_ROLE_KEY` in client code
- Always use RLS policies for data access control
- Validate user input before database operations
- Use server-side client for admin operations
- Monitor auth logs in Supabase dashboard

## Performance Tips

- Use `.select()` to fetch only needed columns
- Add `.limit()` to prevent large data fetches
- Use indexes on frequently queried columns
- Consider pagination for large datasets
- Cache frequently accessed data
- Use real-time subscriptions sparingly

## Troubleshooting

### "Invalid API key"
- Check environment variables
- Restart dev server
- Verify keys in Supabase dashboard

### "Row Level Security policy violation"
- Check RLS policies are set up
- Verify user is authenticated
- Ensure user_id matches auth.uid()

### "Failed to fetch"
- Check network connectivity
- Verify Supabase project is active
- Check CORS settings

## Resources

- [Supabase Docs](https://supabase.com/docs)
- [JavaScript Client](https://supabase.com/docs/reference/javascript)
- [Auth Helpers](https://supabase.com/docs/guides/auth/auth-helpers/nextjs)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)

