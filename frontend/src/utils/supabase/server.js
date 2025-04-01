import { createServerClient } from "@supabase/ssr";
import { getCookieStore } from "../cookies";

export const createClient = (request) => {
	// Create an unmodified response
	let response = {
		headers: new Headers(),
		cookies: {
			getAll() {
				return getCookieStore().getAll();
			},
			setAll(cookiesToSet) {
				cookiesToSet.forEach(({ name, value, options }) => {
					getCookieStore().set(name, value, options);
					response.headers.append('Set-Cookie', `${name}=${value}`);
				});
			}
		}
	};

	const supabase = createServerClient(
		process.env.NEXT_PUBLIC_SUPABASE_URL,
		process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
		{
			cookies: {
				getAll() {
					return getCookieStore().getAll();
				},
				setAll(cookiesToSet) {
					cookiesToSet.forEach(({ name, value, options }) => {
						getCookieStore().set(name, value, options);
						response.cookies.setAll([{ name, value, options }]);
					});
				},
			},
		}
	);

	return { supabase, response };
};
