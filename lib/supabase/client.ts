// Supabase Browser Client
//
// Setup:
// 1. Create a new Supabase project at https://supabase.com
// 2. Go to Settings → API in your Supabase dashboard
// 3. Copy the "Project URL" and "anon/public" key
// 4. Paste them into .env.local as:
//    NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
//    NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
// 5. In Authentication → Settings, you can disable "Confirm email" for easier dev

import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
