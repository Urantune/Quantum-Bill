/** @type {import('tailwindcss').Config} */
export default {
    content: ['./index.html', './src/**/*.{js,jsx}'],
    theme: {
        extend: {
            colors: {
                primary: {
                    DEFAULT: '#FF3B30',
                    hover: '#FF5147',
                    dark: '#D9291F',
                },
                bg: {
                    base: '#0F1117',
                    surface: '#151922',
                    elevated: '#1B2030',
                },
                text: {
                    primary: '#FFFFFF',
                    secondary: '#A0A3B1',
                    muted: '#6B6F80',
                },
                border: {
                    subtle: 'rgba(255,255,255,0.08)',
                    DEFAULT: 'rgba(255,255,255,0.12)',
                },
                success: {
                    DEFAULT: '#16C784',
                    bg: 'rgba(22,199,132,0.1)',
                },
                danger: {
                    DEFAULT: '#FF3B30',
                    bg: 'rgba(255,59,48,0.1)',
                },
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
                mono: ['"JetBrains Mono"', 'monospace'],
            },
            boxShadow: {
                glow: '0 0 24px rgba(255,59,48,0.25)',
                'glow-success': '0 0 24px rgba(22,199,132,0.25)',
                card: '0 4px 24px rgba(0,0,0,0.25)',
                elevated: '0 8px 32px rgba(0,0,0,0.35)',
            },
            borderRadius: {
                card: '16px',
                pill: '999px',
            },
            animation: {
                'fade-up': 'fadeUp 0.6s ease-out forwards',
                'fade-in': 'fadeIn 0.5s ease-out forwards',
                'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                shimmer: 'shimmer 1.8s linear infinite',
            },
            keyframes: {
                fadeUp: {
                    '0%': { opacity: '0', transform: 'translateY(24px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                shimmer: {
                    '0%': { backgroundPosition: '-1000px 0' },
                    '100%': { backgroundPosition: '1000px 0' },
                },
            },
            backgroundImage: {
                'gradient-radial': 'radial-gradient(circle, var(--tw-gradient-stops))',
                'gradient-primary': 'linear-gradient(135deg, #FF3B30 0%, #D9291F 100%)',
            },
        },
    },
    plugins: [],
};