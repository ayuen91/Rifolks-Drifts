/** @type {import('tailwindcss').Config} */
export default {
	content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
	darkMode: "class",
	theme: {
		extend: {
			colors: {
				primary: {
					DEFAULT: "#B197FC",
					dark: "#9A7FFC",
				},
				secondary: {
					DEFAULT: "#7F9F7C",
					dark: "#6B8B68",
				},
				accent: {
					DEFAULT: "#2563eb",
					dark: "#1d4ed8",
				},
				background: {
					light: "#F5F5F5",
					dark: "#121212",
				},
				text: {
					light: "#222222",
					dark: "#FFFFFF",
				},
			},
			fontFamily: {
				heading: ["Montserrat", "sans-serif"],
				body: ["Inter", "sans-serif"],
				button: ["Poppins", "sans-serif"],
			},
			spacing: {
				xs: "0.25rem",
				sm: "0.5rem",
				md: "1rem",
				lg: "1.5rem",
				xl: "2rem",
				"2xl": "3rem",
				"3xl": "4rem",
			},
			borderRadius: {
				sm: "0.25rem",
				md: "0.5rem",
				lg: "1rem",
				full: "9999px",
			},
			boxShadow: {
				sm: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
				md: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
				lg: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
			},
			transitionDuration: {
				DEFAULT: "300ms",
				fast: "150ms",
				slow: "500ms",
			},
			keyframes: {
				fade: {
					"0%, 100%": { opacity: "0.4" },
					"50%": { opacity: "1" },
				},
			},
			animation: {
				fade: "fade 2s ease-in-out infinite",
			},
		},
	},
	plugins: [],
};
