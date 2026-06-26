import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
    './hooks/**/*.{ts,tsx}',
    './store/**/*.{ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: '1.25rem',
      screens: { '2xl': '1400px' },
    },
    extend: {
      // Brand palette
      colors: {
        // Civic signal color — orange for urgency/action (not default blue)
        'civic-orange': '#F97316',
        'civic-orange-dim': '#EA580C',
        'civic-orange-light': '#FED7AA',

        // Deep surfaces
        'civic-navy': '#0F172A',
        'civic-navy-mid': '#1E293B',
        'civic-navy-light': '#334155',

        // Status-semantic colors (used everywhere for status chips)
        'status-reported': '#6366F1',   // Indigo
        'status-verified': '#F59E0B',   // Amber
        'status-assigned': '#3B82F6',   // Blue
        'status-inprogress': '#8B5CF6', // Violet
        'status-resolved': '#10B981',   // Emerald
        'status-closed': '#6B7280',     // Slate

        // Category accent colors
        'cat-pothole':  '#92400E',
        'cat-water':    '#1D4ED8',
        'cat-lighting': '#D97706',
        'cat-waste':    '#065F46',
        'cat-road':     '#5B21B6',
        'cat-building': '#9F1239',

        // Severity gradient
        'sev-low':      '#34D399',
        'sev-medium':   '#FBBF24',
        'sev-high':     '#F87171',
        'sev-critical': '#EF4444',

        // shadcn CSS var wiring (keep for shadcn components to work)
        border:      'hsl(var(--border))',
        input:       'hsl(var(--input))',
        ring:        'hsl(var(--ring))',
        background:  'hsl(var(--background))',
        foreground:  'hsl(var(--foreground))',
        primary: {
          DEFAULT:    'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT:    'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT:    'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT:    'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT:    'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT:    'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT:    'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
      },

      // Typography
      fontFamily: {
        sans:    ['DM Sans', 'system-ui', 'sans-serif'],
        display: ['Space Grotesk', 'DM Sans', 'sans-serif'],
        mono:    ['JetBrains Mono', 'Menlo', 'monospace'],
      },

      // Spacing and radius
      borderRadius: {
        lg:  'var(--radius)',
        md:  'calc(var(--radius) - 2px)',
        sm:  'calc(var(--radius) - 4px)',
        card: '14px',
        pill: '9999px',
      },

      // Shadows
      boxShadow: {
        card:       '0 1px 2px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.06)',
        'card-lg':  '0 2px 8px rgba(0,0,0,0.08), 0 16px 40px rgba(0,0,0,0.1)',
        'orange':   '0 0 0 2px #F97316, 0 8px 24px rgba(249,115,22,.25)',
        'inset':    'inset 0 1px 2px rgba(0,0,0,0.08)',
      },

      // Animation
      keyframes: {
        'slide-up': {
          '0%':   { transform: 'translateY(12px)', opacity: '0' },
          '100%': { transform: 'translateY(0)',     opacity: '1' },
        },
        'fade-in': {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'scale-in': {
          '0%':   { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)',    opacity: '1' },
        },
        'ping-once': {
          '0%, 100%': { transform: 'scale(1)',    opacity: '1'   },
          '50%':      { transform: 'scale(1.15)', opacity: '0.6' },
        },
        'points-pop': {
          '0%':   { transform: 'translateY(0) scale(1)',    opacity: '1'   },
          '60%':  { transform: 'translateY(-20px) scale(1.2)', opacity: '1' },
          '100%': { transform: 'translateY(-36px) scale(0.9)', opacity: '0' },
        },
      },
      animation: {
        'slide-up':  'slide-up 0.25s ease-out',
        'fade-in':   'fade-in 0.2s ease-out',
        'scale-in':  'scale-in 0.2s ease-out',
        'ping-once': 'ping-once 0.5s ease-in-out',
        'points-pop': 'points-pop 0.8s ease-out forwards',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};

export default config;
