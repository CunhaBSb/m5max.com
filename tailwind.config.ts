import type { Config } from "tailwindcss";
// eslint-disable-next-line @typescript-eslint/no-require-imports
const tailwindcssAnimate = require("tailwindcss-animate");

const config: Config = {
	// Light theme only — sem dark mode
	darkMode: false,
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '1rem',
			screens: {
				sm: '640px',
				md: '768px',
				lg: '1024px',
				xl: '1280px',
				'2xl': '1400px',
			}
		},
		screens: {
			xs: '360px',
			sm: '640px',
			md: '768px',
			lg: '1024px',
			xl: '1280px',
			'2xl': '1536px',
		},
		extend: {
			height: {
				'18': '4.5rem',
				'100dvh': '100dvh',
			},
			minHeight: {
				'100dvh': '100dvh',
				'touch': '44px',
			},
			minWidth: {
				'touch': '44px',
			},
			fontFamily: {
				sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
				mono: ['Menlo', 'Monaco', 'monospace'],
			},
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))',
					glow: 'hsl(var(--primary-glow))',
					soft: 'hsl(var(--primary-soft))',
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))',
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))',
				},
				success: {
					DEFAULT: 'hsl(var(--success))',
					foreground: 'hsl(var(--success-foreground))',
				},
				warning: {
					DEFAULT: 'hsl(var(--warning))',
					foreground: 'hsl(var(--warning-foreground))',
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))',
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))',
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))',
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))',
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))',
				},
				// M5 Max — identidade da marca
				fire: {
					red: 'hsl(var(--fire-red))',
					orange: 'hsl(var(--fire-orange))',
					gold: 'hsl(var(--fire-gold))',
					yellow: 'hsl(var(--fire-yellow))',
				},
				charcoal: {
					50: 'hsl(var(--charcoal-50))',
					100: 'hsl(var(--charcoal-100))',
					200: 'hsl(var(--charcoal-200))',
					300: 'hsl(var(--charcoal-300))',
					400: 'hsl(var(--charcoal-400))',
					500: 'hsl(var(--charcoal-500))',
					600: 'hsl(var(--charcoal-600))',
					700: 'hsl(var(--charcoal-700))',
					800: 'hsl(var(--charcoal-800))',
					900: 'hsl(var(--charcoal-900))',
				},
				tech: {
					blue: 'hsl(var(--tech-blue))',
					'blue-light': 'hsl(var(--tech-blue-light))',
				},
				metal: {
					silver: 'hsl(var(--metal-silver))',
					platinum: 'hsl(var(--metal-platinum))',
				},
				// Admin escopo: tokens semanticos warm white
				app: 'hsl(var(--admin-bg-app))',
				sunken: 'hsl(var(--admin-bg-sunken))',
				'border-subtle': 'hsl(var(--admin-border-subtle))',
				'border-strong': 'hsl(var(--admin-border-strong))',
				'text-primary': 'hsl(var(--admin-text-primary))',
				'text-secondary': 'hsl(var(--admin-text-secondary))',
				'text-tertiary': 'hsl(var(--admin-text-tertiary))',
				'text-disabled': 'hsl(var(--admin-text-disabled))',
				'text-inverse': 'hsl(var(--admin-text-inverse))',
				brand: {
					50:  'hsl(var(--admin-brand-50))',
					100: 'hsl(var(--admin-brand-100))',
					200: 'hsl(var(--admin-brand-200))',
					300: 'hsl(var(--admin-brand-300))',
					400: 'hsl(var(--admin-brand-400))',
					500: 'hsl(var(--admin-brand-500))',
					600: 'hsl(var(--admin-brand-600))',
					700: 'hsl(var(--admin-brand-700))',
					800: 'hsl(var(--admin-brand-800))',
					900: 'hsl(var(--admin-brand-900))',
				},
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)',
			},
			boxShadow: {
				'soft-sm': 'var(--shadow-sm)',
				'soft-md': 'var(--shadow-md)',
				'soft-lg': 'var(--shadow-lg)',
				'soft-xl': 'var(--shadow-xl)',
				'fire': 'var(--shadow-fire)',
				'focus': 'var(--shadow-focus)',
			},
			keyframes: {
				'accordion-down': {
					from: { height: '0' },
					to: { height: 'var(--radix-accordion-content-height)' },
				},
				'accordion-up': {
					from: { height: 'var(--radix-accordion-content-height)' },
					to: { height: '0' },
				},
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
			},
			backgroundImage: {
				'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
			},
		}
	},
	plugins: [tailwindcssAnimate],
};

export default config;
