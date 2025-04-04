import { createBrowserClient } from '@supabase/ssr'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
	throw new Error("Missing Supabase environment variables: NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY");
}

// Create a singleton Supabase client for the browser.
// This will be used on the client-side and should correctly handle cookies
// when running in a browser context. The previous error occurred because
// the client from utils/supabase.ts (with manual document.cookie) was
// being initialized/imported during the server-side build phase in _app.tsx.
// By consolidating to this client (imported correctly), the issue should be resolved.
export const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey);

// Note: For server-side operations (API routes, getServerSideProps),
// you would typically use `createServerClient` from `@supabase/ssr`
// and pass the request/response context for cookie handling.
