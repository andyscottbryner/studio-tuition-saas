import { createClient } from '@supabase/supabase-js';

// Used from client components (browser). Respects RLS as the logged-in user.
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);
