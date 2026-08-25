import { createClient } from '@supabase/supabase-js';

// Server-only. Uses the service role key, which bypasses Row Level Security.
// Never import this file into a client component or expose the key to the browser.
export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { autoRefreshToken: false, persistSession: false } }
);
