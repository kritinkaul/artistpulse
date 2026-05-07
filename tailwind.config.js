/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      animation: {
        'shimmer': 'shimmer 2s infinite',
        'shimmer-musical': 'shimmer-musical 2.5s infinite',
        'float': 'float 4s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 2.5s ease-in-out infinite',
        'gradient': 'gradient-shift 4s ease infinite',
        'gradient-flow': 'gradient-flow 3s ease infinite',
        'bounce-slow': 'bounce 3s infinite',
        'music-wave': 'music-wave 1.5s ease-in-out infinite',
        'equalizer-bar': 'equalizer-bar 1.2s ease-in-out infinite',
        'vinyl-spin': 'vinyl-spin 8s linear infinite',
        'sound-ripple': 'sound-ripple 2s ease-in-out infinite',
        'border-wave': 'border-wave 3s ease-in-out infinite',
        'neon-flicker': 'neon-flicker 4s ease-in-out infinite',
        'grid-pulse': 'grid-pulse 3s ease-in-out infinite',
      },
      keyframes: {
        shimmer: {
          '0%': { transform: 'translateX(-100%) skewX(-12deg)' },
          '100%': { transform: 'translateX(300%) skewX(-12deg)' },
        },
        'shimmer-musical': {
          '0%': { transform: 'translateX(-100%) skewX(-12deg)' },
          '100%': { transform: 'translateX(300%) skewX(-12deg)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-15px)' },
        },
        'pulse-glow': {
          '0%, 100%': { opacity: '0.4', transform: 'scale(1)' },
          '50%': { opacity: '1', transform: 'scale(1.08)' },
        },
        'gradient-shift': {
          '0%, 100%': { 'background-position': '0% 50%' },
          '50%': { 'background-position': '100% 50%' },
        },
        'gradient-flow': {
          '0%, 100%': { 'background-position': '0% 50%' },
          '50%': { 'background-position': '100% 50%' },
        },
        'music-wave': {
          '0%, 100%': { transform: 'scaleY(0.5)' },
          '50%': { transform: 'scaleY(1.2)' },
        },
        'equalizer-bar': {
          '0%, 100%': { height: '30%' },
          '25%': { height: '80%' },
          '50%': { height: '50%' },
          '75%': { height: '90%' },
        },
        'vinyl-spin': {
          from: { transform: 'rotate(0deg)' },
          to: { transform: 'rotate(360deg)' },
        },
        'sound-ripple': {
          '0%': { transform: 'scale(0.95)', opacity: '0.8' },
          '50%': { transform: 'scale(1.05)', opacity: '1' },
          '100%': { transform: 'scale(0.95)', opacity: '0.8' },
        },
        'border-wave': {
          '0%, 100%': { borderColor: 'rgba(0, 217, 255, 0.5)' },
          '33%': { borderColor: 'rgba(181, 55, 242, 0.5)' },
          '66%': { borderColor: 'rgba(255, 0, 168, 0.5)' },
        },
        'neon-flicker': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.95' },
        },
        'grid-pulse': {
          '0%, 100%': { opacity: '0.4' },
          '50%': { opacity: '0.6' },
        },
      },
      colors: {
        purple: {
          25: '#fefaff',
        },
        blue: {
          25: '#fafeff',
        },
        neon: {
          cyan: '#00d9ff',
          purple: '#b537f2',
          pink: '#ff00a8',
          green: '#00ff88',
          orange: '#ff6b00',
          blue: '#4d7fff',
        },
        musical: {
          primary: '#00d9ff',
          secondary: '#b537f2',
          accent: '#ff00a8',
          success: '#00ff88',
          warning: '#ffaa00',
          error: '#ff2e5a',
        },
      },
      boxShadow: {
        'neon-cyan': '0 0 20px rgba(0, 217, 255, 0.5), 0 0 40px rgba(0, 217, 255, 0.3)',
        'neon-purple': '0 0 20px rgba(181, 55, 242, 0.5), 0 0 40px rgba(181, 55, 242, 0.3)',
        'neon-pink': '0 0 20px rgba(255, 0, 168, 0.5), 0 0 40px rgba(255, 0, 168, 0.3)',
        'neon-green': '0 0 20px rgba(0, 255, 136, 0.5), 0 0 40px rgba(0, 255, 136, 0.3)',
      },
    },
  },
  plugins: [],
}
