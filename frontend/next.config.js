/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	swcMinify: true,
	images: {
		domains: ["asopomvrogpnirgguquy.supabase.co"],
	},
	experimental: {
		// Remove serverActions as it's now available by default
	},
};

module.exports = nextConfig;
