import { createClient } from '@supabase/supabase-js';

// Server-only. Uses the service role key, which bypasses Row Level Security.
// Never import this file into a client component or expose the key to the browser.
//
// Created lazily (on first call, at request time) rather than at module load —
// otherwise a missing env var crashes the entire Next.js build the moment this
// file is imported, instead of only the one request that actually needs it.
let _client = null;
export function getSupabaseAdmin() {
  if (!_client) {
    _client = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY,
      { auth: { autoRefreshToken: false, persistSession: false } }
    );
  }
  return _client;
}
