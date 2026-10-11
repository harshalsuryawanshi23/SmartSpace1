/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "var(--bg)",
        surface: "var(--surface)",
        ink: {
          DEFAULT: "var(--ink)",
          soft: "var(--ink-soft)",
        },
        primary: {
          DEFAULT: "var(--primary)",
          2: "var(--primary-2)",
          hover: "#4D42D4",
        },
        accent: "var(--accent)",
        success: "var(--success)",
        warning: "var(--warning)",
        danger: "var(--danger)",
      },
      fontFamily: {
        heading: ["Fredoka", "sans-serif"],
        body: ["Nunito", "sans-serif"],
      },
      borderRadius: {
        'clay-lg': "var(--radius-lg)",
        'clay-md': "var(--radius-md)",
      }
    },
  },
  plugins: [],
}
