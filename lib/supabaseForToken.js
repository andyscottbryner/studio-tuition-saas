import { createClient } from '@supabase/supabase-js';

// Server-only. Builds a request-scoped Supabase client that acts AS the user
// who owns the given access token — so RLS still applies, and we can trust
// auth.uid() to be the real logged-in user, not whatever the client claims.
export function supabaseForToken(accessToken) {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    { global: { headers: { Authorization: `Bearer ${accessToken}` } } }
  );
}
