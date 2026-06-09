import { createClient } from '@supabase/supabase-js';

// Cookie-free client for public pages — allows static/ISR rendering.
// Only use the cookie-based server client for admin pages that need auth.
export function createPublicClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
