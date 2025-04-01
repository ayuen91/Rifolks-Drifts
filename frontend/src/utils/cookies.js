export const getCookieStore = () => {
	if (typeof document === "undefined") {
		// Server-side
		return {
			getAll: () => [],
			set: (name, value, options) => {
				// Implement server-side cookie set
			},
			remove: (name, options) => {
				// Implement server-side cookie remove
			},
		};
	}

	// Client-side
	return {
		getAll: () => {
			return document.cookie.split(";").map((cookie) => {
				const [name, value] = cookie.trim().split("=");
				return { name, value };
			});
		},
		set: (name, value, options = {}) => {
			let cookie = `${name}=${value}`;
			if (options.path) cookie += `; path=${options.path}`;
			if (options.maxAge) cookie += `; max-age=${options.maxAge}`;
			if (options.domain) cookie += `; domain=${options.domain}`;
			if (options.secure) cookie += "; secure";
			if (options.httpOnly) cookie += "; HttpOnly";
			document.cookie = cookie;
		},
		remove: (name, options = {}) => {
			document.cookie = `${name}=; max-age=0${
				options.path ? `; path=${options.path}` : ""
			}`;
		},
	};
};
