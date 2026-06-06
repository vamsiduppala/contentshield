import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        void: "#050712",
        night: "#090D1F",
        panel: "rgba(12, 17, 35, 0.72)",
        line: "rgba(255, 255, 255, 0.12)",
        acid: "#7CFF9B",
        cyan: "#55D6FF",
        violet: "#9A7CFF",
        amber: "#FFD38A"
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"]
      },
      boxShadow: {
        glow: "0 0 60px rgba(85, 214, 255, 0.18)",
        premium: "0 28px 90px rgba(0, 0, 0, 0.45)"
      },
      backgroundImage: {
        mesh: "radial-gradient(circle at 20% 10%, rgba(124,255,155,.18), transparent 26%), radial-gradient(circle at 72% 14%, rgba(154,124,255,.22), transparent 30%), radial-gradient(circle at 55% 80%, rgba(85,214,255,.14), transparent 32%)"
      }
    }
  },
  plugins: []
} satisfies Config;
