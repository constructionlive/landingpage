import type { Config } from "tailwindcss";

const config: Config = {
	darkMode: "class",
	content: [
		"./app/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
	],
	theme: {
		extend: {
			colors: {
				"do-bg": "var(--do-bg)",
				"do-bg-card": "var(--do-bg-card)",
				"do-bg-light": "var(--do-bg-light)",
				"do-bg-hover": "var(--do-bg-hover)",
				"do-text": "var(--do-text)",
				"do-text-secondary": "var(--do-text-secondary)",
				"do-text-muted": "var(--do-text-muted)",
				"do-border": "var(--do-border)",
				"do-border-accent": "var(--do-border-accent)",
				"do-orange": "#f97316",
				"do-orange-dark": "#ea580c",
			},
			fontFamily: {
				mono: ["JetBrains Mono", "Fira Code", "monospace"],
				sans: ["Inter", "system-ui", "sans-serif"],
			},
		},
	},
	plugins: [],
};

export default config;
