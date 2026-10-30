/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: "#0E1210",
          900: "#0E1210",
          800: "#151B18",
          700: "#1D2521",
        },
        veneer: {
          DEFAULT: "#E9D3A8",
          light: "#F3E5C8",
          dark: "#CDB383",
        },
        birch: {
          DEFAULT: "#F5EBD7",
          light: "#FAF4E9",
          dark: "#E5D8BE",
        },
        amber: {
          glue: "#D9922B",
          glow: "#F0A638",
        },
        forest: {
          machine: "#4F6B57",
          dark: "#35483B",
        },
        steel: {
          DEFAULT: "#9AA3A0",
          dark: "#687370",
          light: "#C2C9C7",
        },
      },
      fontFamily: {
        serif: ["var(--font-headline)", "Georgia", "serif"],
        sans: ["var(--font-sans)", "system-ui", "-apple-system", "sans-serif"],
        mono: ["var(--font-mono)", "Menlo", "Courier New", "monospace"],
      },
    },
  },
  plugins: [],
};

