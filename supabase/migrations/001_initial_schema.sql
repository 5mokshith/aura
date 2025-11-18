--***REMOVED***Enable***REMOVED***UUID***REMOVED***extension
CREATE***REMOVED***EXTENSION***REMOVED***IF***REMOVED***NOT***REMOVED***EXISTS***REMOVED***"uuid-ossp";

--***REMOVED***Create***REMOVED***profiles***REMOVED***table
CREATE***REMOVED***TABLE***REMOVED***IF***REMOVED***NOT***REMOVED***EXISTS***REMOVED***public.profiles***REMOVED***(
***REMOVED******REMOVED******REMOVED******REMOVED***id***REMOVED***UUID***REMOVED***REFERENCES***REMOVED***auth.users(id)***REMOVED***ON***REMOVED***DELETE***REMOVED***CASCADE***REMOVED***PRIMARY***REMOVED***KEY,
***REMOVED******REMOVED******REMOVED******REMOVED***email***REMOVED***TEXT***REMOVED***NOT***REMOVED***NULL***REMOVED***UNIQUE,
***REMOVED******REMOVED******REMOVED******REMOVED***full_name***REMOVED***TEXT,
***REMOVED******REMOVED******REMOVED******REMOVED***avatar_url***REMOVED***TEXT,
***REMOVED******REMOVED******REMOVED******REMOVED***preferences***REMOVED***JSONB***REMOVED***DEFAULT***REMOVED***'{
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***"theme":***REMOVED***"system",
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***"notificationsEnabled":***REMOVED***true,
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***"defaultView":***REMOVED***"dashboard",
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***"favoriteActions":***REMOVED***[]
***REMOVED******REMOVED******REMOVED******REMOVED***}'::jsonb,
***REMOVED******REMOVED******REMOVED******REMOVED***created_at***REMOVED***TIMESTAMPTZ***REMOVED***DEFAULT***REMOVED***NOW(),
***REMOVED******REMOVED******REMOVED******REMOVED***updated_at***REMOVED***TIMESTAMPTZ***REMOVED***DEFAULT***REMOVED***NOW()
);

--***REMOVED***Create***REMOVED***workflow***REMOVED***status***REMOVED***enum
CREATE***REMOVED***TYPE***REMOVED***workflow_status***REMOVED***AS***REMOVED***ENUM***REMOVED***('planning',***REMOVED***'executing',***REMOVED***'completed',***REMOVED***'failed',***REMOVED***'cancelled');

--***REMOVED***Create***REMOVED***workflows***REMOVED***table
CREATE***REMOVED***TABLE***REMOVED***IF***REMOVED***NOT***REMOVED***EXISTS***REMOVED***public.workflows***REMOVED***(
***REMOVED******REMOVED******REMOVED******REMOVED***id***REMOVED***UUID***REMOVED***DEFAULT***REMOVED***uuid_generate_v4()***REMOVED***PRIMARY***REMOVED***KEY,
***REMOVED******REMOVED******REMOVED******REMOVED***user_id***REMOVED***UUID***REMOVED***REFERENCES***REMOVED***public.profiles(id)***REMOVED***ON***REMOVED***DELETE***REMOVED***CASCADE***REMOVED***NOT***REMOVED***NULL,
***REMOVED******REMOVED******REMOVED******REMOVED***command***REMOVED***TEXT***REMOVED***NOT***REMOVED***NULL,
***REMOVED******REMOVED******REMOVED******REMOVED***status***REMOVED***workflow_status***REMOVED***DEFAULT***REMOVED***'planning',
***REMOVED******REMOVED******REMOVED******REMOVED***steps***REMOVED***JSONB***REMOVED***DEFAULT***REMOVED***'[]'::jsonb,
***REMOVED******REMOVED******REMOVED******REMOVED***results***REMOVED***JSONB***REMOVED***DEFAULT***REMOVED***'[]'::jsonb,
***REMOVED******REMOVED******REMOVED******REMOVED***error***REMOVED***TEXT,
***REMOVED******REMOVED******REMOVED******REMOVED***start_time***REMOVED***TIMESTAMPTZ***REMOVED***DEFAULT***REMOVED***NOW(),
***REMOVED******REMOVED******REMOVED******REMOVED***end_time***REMOVED***TIMESTAMPTZ,
***REMOVED******REMOVED******REMOVED******REMOVED***created_at***REMOVED***TIMESTAMPTZ***REMOVED***DEFAULT***REMOVED***NOW(),
***REMOVED******REMOVED******REMOVED******REMOVED***updated_at***REMOVED***TIMESTAMPTZ***REMOVED***DEFAULT***REMOVED***NOW()
);

--***REMOVED***Create***REMOVED***workflow_history***REMOVED***table
CREATE***REMOVED***TABLE***REMOVED***IF***REMOVED***NOT***REMOVED***EXISTS***REMOVED***public.workflow_history***REMOVED***(
***REMOVED******REMOVED******REMOVED******REMOVED***id***REMOVED***UUID***REMOVED***DEFAULT***REMOVED***uuid_generate_v4()***REMOVED***PRIMARY***REMOVED***KEY,
***REMOVED******REMOVED******REMOVED******REMOVED***user_id***REMOVED***UUID***REMOVED***REFERENCES***REMOVED***public.profiles(id)***REMOVED***ON***REMOVED***DELETE***REMOVED***CASCADE***REMOVED***NOT***REMOVED***NULL,
***REMOVED******REMOVED******REMOVED******REMOVED***workflow_id***REMOVED***UUID***REMOVED***REFERENCES***REMOVED***public.workflows(id)***REMOVED***ON***REMOVED***DELETE***REMOVED***CASCADE***REMOVED***NOT***REMOVED***NULL,
***REMOVED******REMOVED******REMOVED******REMOVED***command***REMOVED***TEXT***REMOVED***NOT***REMOVED***NULL,
***REMOVED******REMOVED******REMOVED******REMOVED***status***REMOVED***TEXT***REMOVED***NOT***REMOVED***NULL,
***REMOVED******REMOVED******REMOVED******REMOVED***executed_at***REMOVED***TIMESTAMPTZ***REMOVED***DEFAULT***REMOVED***NOW(),
***REMOVED******REMOVED******REMOVED******REMOVED***created_at***REMOVED***TIMESTAMPTZ***REMOVED***DEFAULT***REMOVED***NOW()
);

--***REMOVED***Create***REMOVED***indexes***REMOVED***for***REMOVED***better***REMOVED***query***REMOVED***performance
CREATE***REMOVED***INDEX***REMOVED***IF***REMOVED***NOT***REMOVED***EXISTS***REMOVED***idx_profiles_email***REMOVED***ON***REMOVED***public.profiles(email);
CREATE***REMOVED***INDEX***REMOVED***IF***REMOVED***NOT***REMOVED***EXISTS***REMOVED***idx_workflows_user_id***REMOVED***ON***REMOVED***public.workflows(user_id);
CREATE***REMOVED***INDEX***REMOVED***IF***REMOVED***NOT***REMOVED***EXISTS***REMOVED***idx_workflows_status***REMOVED***ON***REMOVED***public.workflows(status);
CREATE***REMOVED***INDEX***REMOVED***IF***REMOVED***NOT***REMOVED***EXISTS***REMOVED***idx_workflows_created_at***REMOVED***ON***REMOVED***public.workflows(created_at***REMOVED***DESC);
CREATE***REMOVED***INDEX***REMOVED***IF***REMOVED***NOT***REMOVED***EXISTS***REMOVED***idx_workflow_history_user_id***REMOVED***ON***REMOVED***public.workflow_history(user_id);
CREATE***REMOVED***INDEX***REMOVED***IF***REMOVED***NOT***REMOVED***EXISTS***REMOVED***idx_workflow_history_executed_at***REMOVED***ON***REMOVED***public.workflow_history(executed_at***REMOVED***DESC);

--***REMOVED***Create***REMOVED***updated_at***REMOVED***trigger***REMOVED***function
CREATE***REMOVED***OR***REMOVED***REPLACE***REMOVED***FUNCTION***REMOVED***update_updated_at_column()
RETURNS***REMOVED***TRIGGER***REMOVED***AS***REMOVED***$$
BEGIN
***REMOVED******REMOVED******REMOVED******REMOVED***NEW.updated_at***REMOVED***=***REMOVED***NOW();
***REMOVED******REMOVED******REMOVED******REMOVED***RETURN***REMOVED***NEW;
END;
$$***REMOVED***LANGUAGE***REMOVED***plpgsql;

--***REMOVED***Create***REMOVED***triggers***REMOVED***for***REMOVED***updated_at
CREATE***REMOVED***TRIGGER***REMOVED***update_profiles_updated_at
***REMOVED******REMOVED******REMOVED******REMOVED***BEFORE***REMOVED***UPDATE***REMOVED***ON***REMOVED***public.profiles
***REMOVED******REMOVED******REMOVED******REMOVED***FOR***REMOVED***EACH***REMOVED***ROW
***REMOVED******REMOVED******REMOVED******REMOVED***EXECUTE***REMOVED***FUNCTION***REMOVED***update_updated_at_column();

CREATE***REMOVED***TRIGGER***REMOVED***update_workflows_updated_at
***REMOVED******REMOVED******REMOVED******REMOVED***BEFORE***REMOVED***UPDATE***REMOVED***ON***REMOVED***public.workflows
***REMOVED******REMOVED******REMOVED******REMOVED***FOR***REMOVED***EACH***REMOVED***ROW
***REMOVED******REMOVED******REMOVED******REMOVED***EXECUTE***REMOVED***FUNCTION***REMOVED***update_updated_at_column();

--***REMOVED***Enable***REMOVED***Row***REMOVED***Level***REMOVED***Security***REMOVED***(RLS)
ALTER***REMOVED***TABLE***REMOVED***public.profiles***REMOVED***ENABLE***REMOVED***ROW***REMOVED***LEVEL***REMOVED***SECURITY;
ALTER***REMOVED***TABLE***REMOVED***public.workflows***REMOVED***ENABLE***REMOVED***ROW***REMOVED***LEVEL***REMOVED***SECURITY;
ALTER***REMOVED***TABLE***REMOVED***public.workflow_history***REMOVED***ENABLE***REMOVED***ROW***REMOVED***LEVEL***REMOVED***SECURITY;

--***REMOVED***Create***REMOVED***RLS***REMOVED***policies***REMOVED***for***REMOVED***profiles
CREATE***REMOVED***POLICY***REMOVED***"Users***REMOVED***can***REMOVED***view***REMOVED***their***REMOVED***own***REMOVED***profile"
***REMOVED******REMOVED******REMOVED******REMOVED***ON***REMOVED***public.profiles***REMOVED***FOR***REMOVED***SELECT
***REMOVED******REMOVED******REMOVED******REMOVED***USING***REMOVED***(auth.uid()***REMOVED***=***REMOVED***id);

CREATE***REMOVED***POLICY***REMOVED***"Users***REMOVED***can***REMOVED***update***REMOVED***their***REMOVED***own***REMOVED***profile"
***REMOVED******REMOVED******REMOVED******REMOVED***ON***REMOVED***public.profiles***REMOVED***FOR***REMOVED***UPDATE
***REMOVED******REMOVED******REMOVED******REMOVED***USING***REMOVED***(auth.uid()***REMOVED***=***REMOVED***id);

CREATE***REMOVED***POLICY***REMOVED***"Users***REMOVED***can***REMOVED***insert***REMOVED***their***REMOVED***own***REMOVED***profile"
***REMOVED******REMOVED******REMOVED******REMOVED***ON***REMOVED***public.profiles***REMOVED***FOR***REMOVED***INSERT
***REMOVED******REMOVED******REMOVED******REMOVED***WITH***REMOVED***CHECK***REMOVED***(auth.uid()***REMOVED***=***REMOVED***id);

--***REMOVED***Create***REMOVED***RLS***REMOVED***policies***REMOVED***for***REMOVED***workflows
CREATE***REMOVED***POLICY***REMOVED***"Users***REMOVED***can***REMOVED***view***REMOVED***their***REMOVED***own***REMOVED***workflows"
***REMOVED******REMOVED******REMOVED******REMOVED***ON***REMOVED***public.workflows***REMOVED***FOR***REMOVED***SELECT
***REMOVED******REMOVED******REMOVED******REMOVED***USING***REMOVED***(auth.uid()***REMOVED***=***REMOVED***user_id);

CREATE***REMOVED***POLICY***REMOVED***"Users***REMOVED***can***REMOVED***insert***REMOVED***their***REMOVED***own***REMOVED***workflows"
***REMOVED******REMOVED******REMOVED******REMOVED***ON***REMOVED***public.workflows***REMOVED***FOR***REMOVED***INSERT
***REMOVED******REMOVED******REMOVED******REMOVED***WITH***REMOVED***CHECK***REMOVED***(auth.uid()***REMOVED***=***REMOVED***user_id);

CREATE***REMOVED***POLICY***REMOVED***"Users***REMOVED***can***REMOVED***update***REMOVED***their***REMOVED***own***REMOVED***workflows"
***REMOVED******REMOVED******REMOVED******REMOVED***ON***REMOVED***public.workflows***REMOVED***FOR***REMOVED***UPDATE
***REMOVED******REMOVED******REMOVED******REMOVED***USING***REMOVED***(auth.uid()***REMOVED***=***REMOVED***user_id);

CREATE***REMOVED***POLICY***REMOVED***"Users***REMOVED***can***REMOVED***delete***REMOVED***their***REMOVED***own***REMOVED***workflows"
***REMOVED******REMOVED******REMOVED******REMOVED***ON***REMOVED***public.workflows***REMOVED***FOR***REMOVED***DELETE
***REMOVED******REMOVED******REMOVED******REMOVED***USING***REMOVED***(auth.uid()***REMOVED***=***REMOVED***user_id);

--***REMOVED***Create***REMOVED***RLS***REMOVED***policies***REMOVED***for***REMOVED***workflow_history
CREATE***REMOVED***POLICY***REMOVED***"Users***REMOVED***can***REMOVED***view***REMOVED***their***REMOVED***own***REMOVED***workflow***REMOVED***history"
***REMOVED******REMOVED******REMOVED******REMOVED***ON***REMOVED***public.workflow_history***REMOVED***FOR***REMOVED***SELECT
***REMOVED******REMOVED******REMOVED******REMOVED***USING***REMOVED***(auth.uid()***REMOVED***=***REMOVED***user_id);

CREATE***REMOVED***POLICY***REMOVED***"Users***REMOVED***can***REMOVED***insert***REMOVED***their***REMOVED***own***REMOVED***workflow***REMOVED***history"
***REMOVED******REMOVED******REMOVED******REMOVED***ON***REMOVED***public.workflow_history***REMOVED***FOR***REMOVED***INSERT
***REMOVED******REMOVED******REMOVED******REMOVED***WITH***REMOVED***CHECK***REMOVED***(auth.uid()***REMOVED***=***REMOVED***user_id);

CREATE***REMOVED***POLICY***REMOVED***"Users***REMOVED***can***REMOVED***delete***REMOVED***their***REMOVED***own***REMOVED***workflow***REMOVED***history"
***REMOVED******REMOVED******REMOVED******REMOVED***ON***REMOVED***public.workflow_history***REMOVED***FOR***REMOVED***DELETE
***REMOVED******REMOVED******REMOVED******REMOVED***USING***REMOVED***(auth.uid()***REMOVED***=***REMOVED***user_id);

--***REMOVED***Create***REMOVED***function***REMOVED***to***REMOVED***handle***REMOVED***new***REMOVED***user***REMOVED***creation
CREATE***REMOVED***OR***REMOVED***REPLACE***REMOVED***FUNCTION***REMOVED***public.handle_new_user()
RETURNS***REMOVED***TRIGGER***REMOVED***AS***REMOVED***$$
BEGIN
***REMOVED******REMOVED******REMOVED******REMOVED***INSERT***REMOVED***INTO***REMOVED***public.profiles***REMOVED***(id,***REMOVED***email,***REMOVED***full_name,***REMOVED***avatar_url)
***REMOVED******REMOVED******REMOVED******REMOVED***VALUES***REMOVED***(
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***NEW.id,
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***NEW.email,
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***NEW.raw_user_meta_data->>'full_name',
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***NEW.raw_user_meta_data->>'avatar_url'
***REMOVED******REMOVED******REMOVED******REMOVED***);
***REMOVED******REMOVED******REMOVED******REMOVED***RETURN***REMOVED***NEW;
END;
$$***REMOVED***LANGUAGE***REMOVED***plpgsql***REMOVED***SECURITY***REMOVED***DEFINER;

--***REMOVED***Create***REMOVED***trigger***REMOVED***for***REMOVED***new***REMOVED***user***REMOVED***creation
CREATE***REMOVED***TRIGGER***REMOVED***on_auth_user_created
***REMOVED******REMOVED******REMOVED******REMOVED***AFTER***REMOVED***INSERT***REMOVED***ON***REMOVED***auth.users
***REMOVED******REMOVED******REMOVED******REMOVED***FOR***REMOVED***EACH***REMOVED***ROW
***REMOVED******REMOVED******REMOVED******REMOVED***EXECUTE***REMOVED***FUNCTION***REMOVED***public.handle_new_user();
