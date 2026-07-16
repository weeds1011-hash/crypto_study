import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#17211b",
        muted: "#59665e",
        paper: "#f6f7f1",
        panel: "#ffffff",
        line: "#dfe4dc",
        forest: "#167a5a",
        marine: "#245a9b",
        amberline: "#b98520",
        danger: "#b84c42"
      },
      boxShadow: {
        calm: "0 18px 44px rgba(31, 43, 38, 0.12)"
      }
    }
  },
  plugins: [],
};

export default config;
