"use client";

import { useState, useEffect } from "react";
import { Sun, Moon } from "lucide-react";

export default function ThemeToggle() {
	const [dark, setDark] = useState(false);

	useEffect(() => {
		const stored = localStorage.getItem("theme");
		if (stored === "dark") {
			setDark(true);
			document.documentElement.classList.add("dark");
		}
	}, []);

	const toggle = () => {
		setDark((prev) => {
			const next = !prev;
			if (next) {
				document.documentElement.classList.add("dark");
				localStorage.setItem("theme", "dark");
			} else {
				document.documentElement.classList.remove("dark");
				localStorage.setItem("theme", "light");
			}
			return next;
		});
	};

	return (
		<button
			aria-label="Toggle theme"
			className="h-8 w-8 rounded-lg flex items-center justify-center text-do-text-secondary hover:text-do-text hover:bg-do-bg-light transition-colors"
			onClick={toggle}
			type="button"
		>
			{dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
		</button>
	);
}
