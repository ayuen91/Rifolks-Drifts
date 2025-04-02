import { createBrowserClient } from "@supabase/ssr";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
	throw new Error("Missing Supabase environment variables");
}

export const supabase = createBrowserClient(supabaseUrl, supabaseKey, {
	auth: {
		persistSession: true,
		autoRefreshToken: true,
		detectSessionInUrl: true,
	},
	cookies: {
		get(name: string) {
			return document.cookie
				.split("; ")
				.find((row) => row.startsWith(`${name}=`))
				?.split("=")[1];
		},
		set(name: string, value: string, options: any) {
			document.cookie = `${name}=${value}; path=/; max-age=${options.maxAge}; SameSite=Lax`;
		},
		remove(name: string, options: any) {
			document.cookie = `${name}=; path=/; max-age=0; SameSite=Lax`;
		},
	},
});
