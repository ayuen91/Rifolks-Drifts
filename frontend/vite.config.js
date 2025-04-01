import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
	const env = loadEnv(mode, process.cwd(), "");
	return {
		plugins: [react()],
		resolve: {
			alias: {
				"@": path.resolve(__dirname, "./src"),
			},
		},
		server: {
			port: 3000,
			proxy: {
				"/api": {
					target: env.VITE_API_URL,
					changeOrigin: true,
					secure: false,
				},
			},
		},
		build: {
			outDir: "dist",
			sourcemap: true,
		},
		define: {
			"process.env.NODE_ENV": JSON.stringify(mode),
			"process.env": env
		},
	};
});
