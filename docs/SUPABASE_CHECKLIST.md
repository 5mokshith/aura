# Supabase Setup Checklist

Use this checklist to ensure your Supabase integration is properly configured.

## Initial Setup

- [ ] Create Supabase account at [supabase.com](https://supabase.com)
- [ ] Create new project in Supabase dashboard
- [ ] Save database password securely
- [ ] Note project URL and API keys

## Environment Configuration

- [ ] Copy Project URL to `.env.local` as `NEXT_PUBLIC_SUPABASE_URL`
- [ ] Copy anon key to `.env.local` as `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- [ ] Copy service_role key to `.env.local` as `SUPABASE_SERVICE_ROLE_KEY`
- [ ] Restart development server after updating env vars

## Database Setup

- [ ] Open SQL Editor in Supabase dashboard
- [ ] Run migration from `supabase/migrations/001_initial_schema.sql`
- [ ] Verify tables created: `profiles`, `workflows`, `workflow_history`
- [ ] Check that RLS policies are enabled
- [ ] Verify triggers are created

## Authentication Setup

- [ ] Enable Google provider in Authentication → Providers
- [ ] Add Google Client ID
- [ ] Add Google Client Secret
- [ ] Configure redirect URLs:
  - [ ] Development: `http://localhost:3000/auth/callback`
  - [ ] Production: `https://yourdomain.com/auth/callback`
- [ ] Save provider configuration

## OAuth Scopes (Optional)

Configure additional Google OAuth scopes if needed:
- [ ] `https://www.googleapis.com/auth/gmail.modify`
- [ ] `https://www.googleapis.com/auth/drive.file`
- [ ] `https://www.googleapis.com/auth/documents`
- [ ] `https://www.googleapis.com/auth/spreadsheets`
- [ ] `https://www.googleapis.com/auth/calendar`

## Code Integration

- [ ] Supabase packages installed (`@supabase/supabase-js`, `@supabase/ssr`)
- [ ] Client utility created (`lib/supabase/client.ts`)
- [ ] Server utility created (`lib/supabase/server.ts`)
- [ ] Middleware utility created (`lib/supabase/middleware.ts`)
- [ ] Middleware configured (`middleware.ts`)
- [ ] Auth context created (`contexts/SupabaseAuthContext.tsx`)
- [ ] Database types defined (`lib/supabase/database.types.ts`)
- [ ] Query helpers created (`lib/supabase/queries.ts`)

## Testing

### Authentication Flow
- [ ] Sign in with Google works
- [ ] User redirected to dashboard after sign in
- [ ] User profile created automatically
- [ ] Sign out works correctly
- [ ] Protected routes redirect to login when not authenticated
- [ ] Authenticated users can access protected routes

### Database Operations
- [ ] Can create workflow
- [ ] Can fetch workflows
- [ ] Can update workflow
- [ ] Can delete workflow history
- [ ] RLS policies prevent unauthorized access

### API Routes
- [ ] `/api/profile` GET returns user profile
- [ ] `/api/profile` PATCH updates profile
- [ ] `/api/workflows` GET returns user workflows
- [ ] `/api/workflows` POST creates workflow
- [ ] All routes check authentication

### Error Handling
- [ ] Invalid credentials show error
- [ ] Network errors handled gracefully
- [ ] Session expiration handled
- [ ] Database errors logged properly

## Security Verification

- [ ] RLS enabled on all tables
- [ ] Service role key not exposed in client code
- [ ] Auth checks in all API routes
- [ ] User can only access their own data
- [ ] CORS configured correctly
- [ ] Environment variables not committed to git

## Production Preparation

- [ ] Update `NEXT_PUBLIC_SUPABASE_URL` for production
- [ ] Add production redirect URL to Supabase
- [ ] Configure custom domain (optional)
- [ ] Set up database backups
- [ ] Enable MFA for admin accounts
- [ ] Configure email templates
- [ ] Set up monitoring and alerts
- [ ] Test complete flow in production

## Optional Enhancements

- [ ] Set up real-time subscriptions
- [ ] Configure storage buckets
- [ ] Add database indexes for performance
- [ ] Set up Edge Functions
- [ ] Configure rate limiting
- [ ] Add custom email templates
- [ ] Enable database webhooks
- [ ] Set up CI/CD for migrations

## Documentation

- [ ] Team members have access to Supabase project
- [ ] Environment variables documented
- [ ] Database schema documented
- [ ] API routes documented
- [ ] Migration process documented

## Monitoring

- [ ] Check auth logs in Supabase dashboard
- [ ] Monitor database performance
- [ ] Review API usage
- [ ] Check error logs
- [ ] Monitor storage usage

## Troubleshooting Checklist

If something isn't working:

- [ ] Check environment variables are correct
- [ ] Verify dev server was restarted
- [ ] Confirm database migration ran successfully
- [ ] Check RLS policies are set up
- [ ] Verify Google OAuth credentials
- [ ] Check redirect URLs match exactly
- [ ] Review browser console for errors
- [ ] Check Supabase logs for errors
- [ ] Verify network connectivity
- [ ] Clear browser cookies and cache

## Resources

- [ ] Bookmarked [Supabase Documentation](https://supabase.com/docs)
- [ ] Joined [Supabase Discord](https://discord.supabase.com)
- [ ] Reviewed [Auth Helpers Guide](https://supabase.com/docs/guides/auth/auth-helpers/nextjs)
- [ ] Read [RLS Guide](https://supabase.com/docs/guides/auth/row-level-security)

## Next Steps

After completing this checklist:

1. Review [MIGRATION_TO_SUPABASE.md](./MIGRATION_TO_SUPABASE.md) if migrating from old auth
2. Explore [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) for detailed documentation
3. Check [lib/supabase/README.md](../lib/supabase/README.md) for usage patterns
4. Start building features with Supabase!

---

**Last Updated:** Check this date when reviewing
**Completed By:** _________________
**Date Completed:** _________________

