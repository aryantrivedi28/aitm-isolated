/** @type {import('tailwindcss').Config} */
module.exports = {
	darkMode: ["class"],
	content: [
		"./src/app/**/*.{js,ts,jsx,tsx,mdx}",
		"./src/components/**/*.{js,ts,jsx,tsx,mdx}",
		"./pages/**/*.{js,ts,jsx,tsx,mdx}",
		"./app/**/*.{js,ts,jsx,tsx,mdx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: "2rem",
			screens: {
				"2xl": "1400px",
			},
		},
		fontFamily: {
			sans: ["Inter", "system-ui", "sans-serif"],
		},
		extend: {
			colors: {
				background: "hsl(var(--background))",
				foreground: "hsl(var(--foreground))",
				card: {
					DEFAULT: "hsl(var(--card))",
					foreground: "hsl(var(--card-foreground))",
				},
				popover: {
					DEFAULT: "hsl(var(--popover))",
					foreground: "hsl(var(--popover-foreground))",
				},
				primary: {
					DEFAULT: "hsl(var(--primary))",
					foreground: "hsl(var(--primary-foreground))",
				},
				secondary: {
					DEFAULT: "hsl(var(--secondary))",
					foreground: "hsl(var(--secondary-foreground))",
				},
				muted: {
					DEFAULT: "hsl(var(--muted))",
					foreground: "hsl(var(--muted-foreground))",
				},
				accent: {
					DEFAULT: "hsl(var(--accent))",
					foreground: "hsl(var(--accent-foreground))",
				},
				destructive: {
					DEFAULT: "hsl(var(--destructive))",
					foreground: "hsl(var(--destructive-foreground))",
				},
				border: "hsl(var(--border))",
				input: "hsl(var(--input))",
				ring: "hsl(var(--ring))",
				chart: {
					1: "hsl(var(--chart-1))",
					2: "hsl(var(--chart-2))",
					3: "hsl(var(--chart-3))",
					4: "hsl(var(--chart-4))",
					5: "hsl(var(--chart-5))",
				},
				// ✅ Finzie Brand Colors
				"brand-dark": "hsl(var(--brand-dark))",
				"brand-yellow": "hsl(var(--brand-yellow))",
				"brand-yellow-hover": "hsl(var(--brand-yellow-hover))",
				"brand-white": "hsl(var(--brand-white))",
				"brand-black": "hsl(var(--brand-black))",
				"brand-gray-600": "hsl(var(--brand-gray-600))",
				"brand-gray-300": "hsl(var(--brand-gray-300))",
			},
			backgroundImage: {
				"gradient-hero": "var(--gradient-hero)",
				"gradient-hero-overlay": "var(--gradient-hero-overlay)",
				"gradient-accent": "var(--gradient-accent)",
				"gradient-subtle": "var(--gradient-subtle)",
				"gradient-premium": "var(--gradient-premium)",
				"gradient-glass": "var(--gradient-glass)",
				"gradient-border": "var(--gradient-border)",
			},
			backgroundSize: {
				"size-200": "200% 200%",
			},
			boxShadow: {
				elegant: "var(--shadow-elegant)",
				glow: "var(--shadow-glow)",
				premium: "var(--shadow-premium)",
				glass: "var(--shadow-glass)",
				inset: "var(--shadow-inset)",
			},
			transitionTimingFunction: {
				smooth: "var(--transition-smooth)",
				spring: "var(--transition-spring)",
				bounce: "var(--transition-bounce)",
				glass: "var(--transition-glass)",
			},
			borderRadius: {
				lg: "var(--radius)",
				md: "calc(var(--radius) - 2px)",
				sm: "calc(var(--radius) - 4px)",
			},
			keyframes: {
				"accordion-down": {
					from: { height: "0" },
					to: { height: "var(--radix-accordion-content-height)" },
				},
				"accordion-up": {
					from: { height: "var(--radix-accordion-content-height)" },
					to: { height: "0" },
				},
				"fade-in": {
					"0%": { opacity: "0", transform: "translateY(20px)" },
					"100%": { opacity: "1", transform: "translateY(0)" },
				},
				"scale-in": {
					"0%": { transform: "scale(0.95)", opacity: "0" },
					"100%": { transform: "scale(1)", opacity: "1" },
				},
				"slide-up": {
					"0%": { transform: "translateY(100px)", opacity: "0" },
					"100%": { transform: "translateY(0)", opacity: "1" },
				},
				float: {
					"0%, 100%": { transform: "translateY(0px)" },
					"50%": { transform: "translateY(-10px)" },
				},
				"float-slow": {
					"0%, 100%": { transform: "translateY(0px) rotateX(0deg)" },
					"50%": { transform: "translateY(-20px) rotateX(5deg)" },
				},
				shimmer: {
					"0%": { transform: "translateX(-100%)" },
					"100%": { transform: "translateX(100%)" },
				},
				gradient: {
					"0%, 100%": { "background-position": "0% 50%" },
					"50%": { "background-position": "100% 50%" },
				},
				"glow-pulse": {
					"0%, 100%": { opacity: "1", transform: "scale(1)" },
					"50%": { opacity: "0.8", transform: "scale(1.05)" },
				},
				"slide-in-bottom": {
					"0%": { transform: "translateY(100px)", opacity: "0" },
					"100%": { transform: "translateY(0)", opacity: "1" },
				},
				"slide-in-right": {
					"0%": { transform: "translateX(100px)", opacity: "0" },
					"100%": { transform: "translateX(0)", opacity: "1" },
				},
			},
			animation: {
				"accordion-down": "accordion-down 0.2s ease-out",
				"accordion-up": "accordion-up 0.2s ease-out",
				"fade-in": "fade-in 0.8s ease-out",
				"scale-in": "scale-in 0.6s ease-spring",
				"slide-up": "slide-up 0.8s ease-spring",
				"slide-in-bottom": "slide-in-bottom 0.8s ease-spring",
				"slide-in-right": "slide-in-right 0.8s ease-spring",
				float: "float 3s ease-in-out infinite",
				"float-slow": "float-slow 6s ease-in-out infinite",
				shimmer: "shimmer 2s ease-in-out infinite",
				gradient: "gradient 3s ease infinite",
				"glow-pulse": "glow-pulse 2s ease-in-out infinite",
			},
		},
	},
	plugins: [require("tailwindcss-animate")],
};
