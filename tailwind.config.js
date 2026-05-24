/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        heading: ['Playfair Display', 'serif'],
        body: ['Inter', 'sans-serif'],
        mono: ['DM Mono', 'monospace'],
      },
      colors: {
        cyanTech: 'var(--accent-cyan)',
        violetBrain: 'var(--accent-violet)',
        emeraldStack: 'var(--accent-emerald)',
        orangeEnergy: 'var(--accent-orange)',
      },
      boxShadow: {
        neon: '0 18px 40px rgba(47, 128, 237, 0.18)',
        violet: '0 18px 40px rgba(109, 91, 208, 0.18)',
      },
    },
  },
  plugins: [],
};
