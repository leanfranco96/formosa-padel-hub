import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        padel: {
          neon: "#CCFF00",
          neonDim: "#A3CC00",
          court: "#090D16",
          card: "#111726",
          border: "#1E293B",
        },
      },
      boxShadow: {
        neon: "0 0 20px rgba(204, 255, 0, 0.22)",
      },
    },
  },
  plugins: [],
};

export default config;
