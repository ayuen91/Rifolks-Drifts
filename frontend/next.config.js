/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	swcMinify: true,
	images: {
		domains: ["asopomvrogpnirgguquy.supabase.co"],
	},
	experimental: {
		serverActions: true,
	},
};

module.exports = nextConfig;
