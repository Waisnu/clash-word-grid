import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
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
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				},
				// Aurora theme colors
				aurora: {
					blue: 'hsl(var(--aurora-blue))',
					teal: 'hsl(var(--aurora-teal))',
					purple: 'hsl(var(--aurora-purple))',
					pink: 'hsl(var(--aurora-pink))'
				},
				game: {
					success: 'hsl(var(--game-success))',
					warning: 'hsl(var(--game-warning))',
					player1: 'hsl(var(--game-player-1))',
					player2: 'hsl(var(--game-player-2))',
					player3: 'hsl(var(--game-player-3))',
					player4: 'hsl(var(--game-player-4))'
				}
			},
			backgroundImage: {
				'aurora-bg': 'var(--aurora-bg)',
				'aurora-flow': 'var(--aurora-flow)',
				'aurora-subtle': 'var(--aurora-subtle)',
				'grid-bg': 'var(--grid-bg)',
				'glass-card': 'var(--glass-card)',
				'glass-border': 'var(--glass-border)'
			},
			boxShadow: {
				'aurora': 'var(--shadow-aurora)',
				'intense': 'var(--shadow-intense)',
				'success': 'var(--shadow-success)',
				'glass': 'var(--shadow-glass)'
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				},
				'aurora-flow': {
					'0%': {
						transform: 'translateX(-100%) rotate(0deg)',
						opacity: '0.3'
					},
					'50%': {
						transform: 'translateX(50%) rotate(180deg)',
						opacity: '0.8'
					},
					'100%': {
						transform: 'translateX(100%) rotate(360deg)',
						opacity: '0.3'
					}
				},
				'pulse-glow': {
					'0%, 100%': {
						opacity: '0.4',
						transform: 'scale(1)'
					},
					'50%': {
						opacity: '0.8',
						transform: 'scale(1.05)'
					}
				},
				'float': {
					'0%, 100%': {
						transform: 'translateY(0px)'
					},
					'50%': {
						transform: 'translateY(-10px)'
					}
				},
				'word-found': {
					'0%': {
						transform: 'scale(1)',
						opacity: '1'
					},
					'50%': {
						transform: 'scale(1.2)',
						opacity: '0.8'
					},
					'100%': {
						transform: 'scale(1)',
						opacity: '1'
					}
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'aurora-flow': 'aurora-flow 8s linear infinite',
				'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
				'float': 'float 3s ease-in-out infinite',
				'word-found': 'word-found 0.6s ease-out'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
