import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', '"72"', 'system-ui', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'Helvetica', 'Arial', 'sans-serif'],
        mono: ['"72Mono"', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
      },
      fontSize: {
        'xs': ['12px', { lineHeight: '1.4' }],
        'metadata': ['13px', { lineHeight: '1.4' }],
        'sm': ['14px', { lineHeight: '1.5' }],
        'supporting': ['14px', { lineHeight: '1.5' }],
        'base': ['15px', { lineHeight: '1.55' }],
        'body': ['15px', { lineHeight: '1.55' }],
        'body-lg': ['16px', { lineHeight: '1.6' }],
        'lg': ['18px', { lineHeight: '1.4' }],
        'card-title': ['18px', { lineHeight: '1.35', fontWeight: '600' }],
        'xl': ['20px', { lineHeight: '1.35' }],
        '2xl': ['24px', { lineHeight: '1.3' }],
        'section-heading': ['26px', { lineHeight: '1.3', fontWeight: '600' }],
        '3xl': ['30px', { lineHeight: '1.25' }],
        'page-heading': ['32px', { lineHeight: '1.25', fontWeight: '700' }],
        '4xl': ['36px', { lineHeight: '1.2' }],
        'hero-title': ['40px', { lineHeight: '1.15', fontWeight: '700' }],
      },
      colors: {
        sap: {
          blue: "#0070f2",
          dark: "#0057d2",
          active: "#0040b0",
          light: "#e5f0ff",
          shell: "#1d2d3e",
          muted: "#556b82",
          bg: "#f5f6f7",
          border: "#d9e2ec",
          positive: "#107e3e",
          critical: "#df6e0c",
          negative: "#bb0000",
        },
        brand: {
          50: "#eef2ff",
          100: "#e0e7ff",
          200: "#c7d2fe",
          300: "#a5b4fc",
          400: "#818cf8",
          500: "#6366f1",
          600: "#4f46e5",
          700: "#4338ca",
          800: "#3730a3",
          900: "#312e81",
        },
        ai: {
          50: "#f5f3ff",
          100: "#ede9fe",
          200: "#ddd6fe",
          500: "#8b5cf6",
          600: "#7c3aed",
          700: "#6d28d9",
        },
        fin: {
          positive: "#107e3e",
          negative: "#bb0000",
          neutral: "#556b82",
        }
      },
    },
  },
  plugins: [],
};
export default config;
