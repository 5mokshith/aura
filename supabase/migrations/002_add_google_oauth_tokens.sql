--***REMOVED***Add***REMOVED***Google***REMOVED***OAuth***REMOVED***token***REMOVED***storage***REMOVED***to***REMOVED***profiles***REMOVED***table
ALTER***REMOVED***TABLE***REMOVED***public.profiles
ADD***REMOVED***COLUMN***REMOVED***IF***REMOVED***NOT***REMOVED***EXISTS***REMOVED***google_access_token***REMOVED***TEXT,
ADD***REMOVED***COLUMN***REMOVED***IF***REMOVED***NOT***REMOVED***EXISTS***REMOVED***google_refresh_token***REMOVED***TEXT,
ADD***REMOVED***COLUMN***REMOVED***IF***REMOVED***NOT***REMOVED***EXISTS***REMOVED***google_token_expires_at***REMOVED***TIMESTAMPTZ,
ADD***REMOVED***COLUMN***REMOVED***IF***REMOVED***NOT***REMOVED***EXISTS***REMOVED***google_scopes***REMOVED***TEXT[];

--***REMOVED***Create***REMOVED***a***REMOVED***separate***REMOVED***table***REMOVED***for***REMOVED***OAuth***REMOVED***tokens***REMOVED***(more***REMOVED***secure***REMOVED***approach)
CREATE***REMOVED***TABLE***REMOVED***IF***REMOVED***NOT***REMOVED***EXISTS***REMOVED***public.oauth_tokens***REMOVED***(
***REMOVED******REMOVED******REMOVED******REMOVED***id***REMOVED***UUID***REMOVED***DEFAULT***REMOVED***uuid_generate_v4()***REMOVED***PRIMARY***REMOVED***KEY,
***REMOVED******REMOVED******REMOVED******REMOVED***user_id***REMOVED***UUID***REMOVED***REFERENCES***REMOVED***public.profiles(id)***REMOVED***ON***REMOVED***DELETE***REMOVED***CASCADE***REMOVED***NOT***REMOVED***NULL***REMOVED***UNIQUE,
***REMOVED******REMOVED******REMOVED******REMOVED***provider***REMOVED***TEXT***REMOVED***NOT***REMOVED***NULL***REMOVED***DEFAULT***REMOVED***'google',
***REMOVED******REMOVED******REMOVED******REMOVED***access_token***REMOVED***TEXT***REMOVED***NOT***REMOVED***NULL,
***REMOVED******REMOVED******REMOVED******REMOVED***refresh_token***REMOVED***TEXT,
***REMOVED******REMOVED******REMOVED******REMOVED***token_type***REMOVED***TEXT***REMOVED***DEFAULT***REMOVED***'Bearer',
***REMOVED******REMOVED******REMOVED******REMOVED***expires_at***REMOVED***TIMESTAMPTZ,
***REMOVED******REMOVED******REMOVED******REMOVED***scopes***REMOVED***TEXT[],
***REMOVED******REMOVED******REMOVED******REMOVED***created_at***REMOVED***TIMESTAMPTZ***REMOVED***DEFAULT***REMOVED***NOW(),
***REMOVED******REMOVED******REMOVED******REMOVED***updated_at***REMOVED***TIMESTAMPTZ***REMOVED***DEFAULT***REMOVED***NOW()
);

--***REMOVED***Create***REMOVED***index***REMOVED***for***REMOVED***faster***REMOVED***lookups
CREATE***REMOVED***INDEX***REMOVED***IF***REMOVED***NOT***REMOVED***EXISTS***REMOVED***idx_oauth_tokens_user_id***REMOVED***ON***REMOVED***public.oauth_tokens(user_id);
CREATE***REMOVED***INDEX***REMOVED***IF***REMOVED***NOT***REMOVED***EXISTS***REMOVED***idx_oauth_tokens_provider***REMOVED***ON***REMOVED***public.oauth_tokens(provider);

--***REMOVED***Enable***REMOVED***RLS***REMOVED***on***REMOVED***oauth_tokens
ALTER***REMOVED***TABLE***REMOVED***public.oauth_tokens***REMOVED***ENABLE***REMOVED***ROW***REMOVED***LEVEL***REMOVED***SECURITY;

--***REMOVED***Create***REMOVED***RLS***REMOVED***policies***REMOVED***for***REMOVED***oauth_tokens
CREATE***REMOVED***POLICY***REMOVED***"Users***REMOVED***can***REMOVED***view***REMOVED***their***REMOVED***own***REMOVED***oauth***REMOVED***tokens"
***REMOVED******REMOVED******REMOVED******REMOVED***ON***REMOVED***public.oauth_tokens***REMOVED***FOR***REMOVED***SELECT
***REMOVED******REMOVED******REMOVED******REMOVED***USING***REMOVED***(auth.uid()***REMOVED***=***REMOVED***user_id);

CREATE***REMOVED***POLICY***REMOVED***"Users***REMOVED***can***REMOVED***insert***REMOVED***their***REMOVED***own***REMOVED***oauth***REMOVED***tokens"
***REMOVED******REMOVED******REMOVED******REMOVED***ON***REMOVED***public.oauth_tokens***REMOVED***FOR***REMOVED***INSERT
***REMOVED******REMOVED******REMOVED******REMOVED***WITH***REMOVED***CHECK***REMOVED***(auth.uid()***REMOVED***=***REMOVED***user_id);

CREATE***REMOVED***POLICY***REMOVED***"Users***REMOVED***can***REMOVED***update***REMOVED***their***REMOVED***own***REMOVED***oauth***REMOVED***tokens"
***REMOVED******REMOVED******REMOVED******REMOVED***ON***REMOVED***public.oauth_tokens***REMOVED***FOR***REMOVED***UPDATE
***REMOVED******REMOVED******REMOVED******REMOVED***USING***REMOVED***(auth.uid()***REMOVED***=***REMOVED***user_id);

CREATE***REMOVED***POLICY***REMOVED***"Users***REMOVED***can***REMOVED***delete***REMOVED***their***REMOVED***own***REMOVED***oauth***REMOVED***tokens"
***REMOVED******REMOVED******REMOVED******REMOVED***ON***REMOVED***public.oauth_tokens***REMOVED***FOR***REMOVED***DELETE
***REMOVED******REMOVED******REMOVED******REMOVED***USING***REMOVED***(auth.uid()***REMOVED***=***REMOVED***user_id);

--***REMOVED***Create***REMOVED***trigger***REMOVED***for***REMOVED***updated_at
CREATE***REMOVED***TRIGGER***REMOVED***update_oauth_tokens_updated_at
***REMOVED******REMOVED******REMOVED******REMOVED***BEFORE***REMOVED***UPDATE***REMOVED***ON***REMOVED***public.oauth_tokens
***REMOVED******REMOVED******REMOVED******REMOVED***FOR***REMOVED***EACH***REMOVED***ROW
***REMOVED******REMOVED******REMOVED******REMOVED***EXECUTE***REMOVED***FUNCTION***REMOVED***update_updated_at_column();

--***REMOVED***Function***REMOVED***to***REMOVED***store***REMOVED***Google***REMOVED***OAuth***REMOVED***tokens***REMOVED***after***REMOVED***authentication
CREATE***REMOVED***OR***REMOVED***REPLACE***REMOVED***FUNCTION***REMOVED***public.store_google_oauth_tokens(
***REMOVED******REMOVED******REMOVED******REMOVED***p_user_id***REMOVED***UUID,
***REMOVED******REMOVED******REMOVED******REMOVED***p_access_token***REMOVED***TEXT,
***REMOVED******REMOVED******REMOVED******REMOVED***p_refresh_token***REMOVED***TEXT,
***REMOVED******REMOVED******REMOVED******REMOVED***p_expires_at***REMOVED***TIMESTAMPTZ,
***REMOVED******REMOVED******REMOVED******REMOVED***p_scopes***REMOVED***TEXT[]
)
RETURNS***REMOVED***void***REMOVED***AS***REMOVED***$$
BEGIN
***REMOVED******REMOVED******REMOVED******REMOVED***INSERT***REMOVED***INTO***REMOVED***public.oauth_tokens***REMOVED***(
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***user_id,
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***provider,
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***access_token,
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***refresh_token,
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***expires_at,
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***scopes
***REMOVED******REMOVED******REMOVED******REMOVED***)
***REMOVED******REMOVED******REMOVED******REMOVED***VALUES***REMOVED***(
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***p_user_id,
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***'google',
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***p_access_token,
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***p_refresh_token,
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***p_expires_at,
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***p_scopes
***REMOVED******REMOVED******REMOVED******REMOVED***)
***REMOVED******REMOVED******REMOVED******REMOVED***ON***REMOVED***CONFLICT***REMOVED***(user_id)
***REMOVED******REMOVED******REMOVED******REMOVED***DO***REMOVED***UPDATE***REMOVED***SET
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***access_token***REMOVED***=***REMOVED***EXCLUDED.access_token,
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***refresh_token***REMOVED***=***REMOVED***COALESCE(EXCLUDED.refresh_token,***REMOVED***oauth_tokens.refresh_token),
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***expires_at***REMOVED***=***REMOVED***EXCLUDED.expires_at,
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***scopes***REMOVED***=***REMOVED***EXCLUDED.scopes,
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***updated_at***REMOVED***=***REMOVED***NOW();
END;
$$***REMOVED***LANGUAGE***REMOVED***plpgsql***REMOVED***SECURITY***REMOVED***DEFINER;

--***REMOVED***Function***REMOVED***to***REMOVED***get***REMOVED***valid***REMOVED***Google***REMOVED***OAuth***REMOVED***token***REMOVED***(refresh***REMOVED***if***REMOVED***needed)
CREATE***REMOVED***OR***REMOVED***REPLACE***REMOVED***FUNCTION***REMOVED***public.get_google_oauth_token(p_user_id***REMOVED***UUID)
RETURNS***REMOVED***TABLE***REMOVED***(
***REMOVED******REMOVED******REMOVED******REMOVED***access_token***REMOVED***TEXT,
***REMOVED******REMOVED******REMOVED******REMOVED***refresh_token***REMOVED***TEXT,
***REMOVED******REMOVED******REMOVED******REMOVED***expires_at***REMOVED***TIMESTAMPTZ,
***REMOVED******REMOVED******REMOVED******REMOVED***is_expired***REMOVED***BOOLEAN
)***REMOVED***AS***REMOVED***$$
BEGIN
***REMOVED******REMOVED******REMOVED******REMOVED***RETURN***REMOVED***QUERY
***REMOVED******REMOVED******REMOVED******REMOVED***SELECT***REMOVED***
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***ot.access_token,
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***ot.refresh_token,
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***ot.expires_at,
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***(ot.expires_at***REMOVED***<***REMOVED***NOW())***REMOVED***as***REMOVED***is_expired
***REMOVED******REMOVED******REMOVED******REMOVED***FROM***REMOVED***public.oauth_tokens***REMOVED***ot
***REMOVED******REMOVED******REMOVED******REMOVED***WHERE***REMOVED***ot.user_id***REMOVED***=***REMOVED***p_user_id
***REMOVED******REMOVED******REMOVED******REMOVED***AND***REMOVED***ot.provider***REMOVED***=***REMOVED***'google';
END;
$$***REMOVED***LANGUAGE***REMOVED***plpgsql***REMOVED***SECURITY***REMOVED***DEFINER;

--***REMOVED***Function***REMOVED***to***REMOVED***delete***REMOVED***OAuth***REMOVED***tokens***REMOVED***(for***REMOVED***disconnect)
CREATE***REMOVED***OR***REMOVED***REPLACE***REMOVED***FUNCTION***REMOVED***public.delete_google_oauth_tokens(p_user_id***REMOVED***UUID)
RETURNS***REMOVED***void***REMOVED***AS***REMOVED***$$
BEGIN
***REMOVED******REMOVED******REMOVED******REMOVED***DELETE***REMOVED***FROM***REMOVED***public.oauth_tokens
***REMOVED******REMOVED******REMOVED******REMOVED***WHERE***REMOVED***user_id***REMOVED***=***REMOVED***p_user_id
***REMOVED******REMOVED******REMOVED******REMOVED***AND***REMOVED***provider***REMOVED***=***REMOVED***'google';
END;
$$***REMOVED***LANGUAGE***REMOVED***plpgsql***REMOVED***SECURITY***REMOVED***DEFINER;
