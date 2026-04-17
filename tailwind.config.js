// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
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
  			}
  		},
  		backgroundImage: {
  			'cinema-gradient': 'linear-gradient(135deg, #0d1657 0%, #1a237e 50%, #3949ab 100%)',
  			'glass-gradient': 'linear-gradient(135deg, rgba(255,255,255,0.15), rgba(255,255,255,0.05))',
  			'primary-gradient': 'linear-gradient(135deg, #1a237e, #3949ab)',
  			'secondary-gradient': 'linear-gradient(135deg, #f57c00, #ff9800)',
  			'accent-gradient': 'linear-gradient(135deg, #00acc1, #26c6da)'
  		},
  		backdropBlur: {
  			xs: '2px',
  			'4xl': '72px'
  		},
  		animation: {
  			shimmer: 'shimmer 3s ease-in-out infinite',
  			'float-0': 'float-0 15s ease-in-out infinite',
  			'float-1': 'float-1 18s ease-in-out infinite',
  			'float-2': 'float-2 12s ease-in-out infinite',
  			'background-pulse': 'backgroundPulse 10s ease-in-out infinite'
  		},
  		keyframes: {
  			shimmer: {
  				'0%': {
  					transform: 'translateX(-100%)',
  					opacity: '0'
  				},
  				'50%': {
  					opacity: '1'
  				},
  				'100%': {
  					transform: 'translateX(100%)',
  					opacity: '0'
  				}
  			},
  			'float-0': {
  				'0%, 100%': {
  					transform: 'translateY(0px) translateX(0px)',
  					opacity: '0.3'
  				},
  				'33%': {
  					transform: 'translateY(-20px) translateX(10px)',
  					opacity: '0.6'
  				},
  				'66%': {
  					transform: 'translateY(10px) translateX(-10px)',
  					opacity: '0.4'
  				}
  			},
  			'float-1': {
  				'0%, 100%': {
  					transform: 'translateY(0px) translateX(0px)',
  					opacity: '0.4'
  				},
  				'50%': {
  					transform: 'translateY(-30px) translateX(20px)',
  					opacity: '0.7'
  				}
  			},
  			'float-2': {
  				'0%, 100%': {
  					transform: 'translateY(0px) translateX(0px)',
  					opacity: '0.2'
  				},
  				'25%': {
  					transform: 'translateY(15px) translateX(-15px)',
  					opacity: '0.5'
  				},
  				'75%': {
  					transform: 'translateY(-25px) translateX(15px)',
  					opacity: '0.6'
  				}
  			},
  			backgroundPulse: {
  				'0%, 100%': {
  					opacity: '1'
  				},
  				'50%': {
  					opacity: '0.8'
  				}
  			}
  		},
  		boxShadow: {
  			glass: '0 8px 32px rgba(0, 0, 0, 0.1)',
  			'glass-hover': '0 16px 48px rgba(0, 0, 0, 0.15)',
  			premium: '0 12px 40px rgba(26, 35, 126, 0.2)',
  			'glow-primary': '0 0 20px rgba(26, 35, 126, 0.5), 0 0 40px rgba(26, 35, 126, 0.3)',
  			'glow-secondary': '0 0 20px rgba(245, 124, 0, 0.5), 0 0 40px rgba(245, 124, 0, 0.3)',
  			'glow-accent': '0 0 20px rgba(0, 172, 193, 0.5), 0 0 40px rgba(0, 172, 193, 0.3)'
  		},
  		transitionProperty: {
  			glass: 'background-color, border-color, backdrop-filter, box-shadow, transform, opacity'
  		},
  		screens: {
  			xs: '475px'
  		},
  		spacing: {
  			'18': '4.5rem',
  			'88': '22rem',
  			'128': '32rem'
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		}
  	}
  },
  plugins: [],
  // Support for dark mode
  darkMode: 'class',
};