import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#06070B",
        foreground: "#F5F1E8",
        card: {
          DEFAULT: "rgba(13, 16, 24, 0.75)",
          border: "rgba(201, 169, 97, 0.2)",
        },
        gold: {
          50: "#FFFDF5",
          100: "#FDF8E2",
          200: "#F8ECBA",
          300: "#F3DC87",
          400: "#E9C757",
          500: "#C9A961", // Base luxury gold
          600: "#A88542",
          700: "#84632F",
          800: "#654926",
          900: "#49331B",
          glow: "rgba(201, 169, 97, 0.4)",
        },
        deepDark: "#0A0D18",
      },
      fontFamily: {
        serif: ["var(--font-cormorant)", "Cormorant Garamond", "Georgia", "serif"],
        sans: ["var(--font-jakarta)", "Plus Jakarta Sans", "system-ui", "sans-serif"],
      },
      backgroundImage: {
        "gold-gradient": "linear-gradient(135deg, #F5E6AD 0%, #C9A961 50%, #9B7835 100%)",
        "gold-metallic": "linear-gradient(135deg, #EAD79B 0%, #C9A961 40%, #D4B46E 70%, #91702F 100%)",
        "dark-radial": "radial-gradient(ellipse at top, #141A29 0%, #06070B 70%)",
        "glass-radial": "radial-gradient(circle at 50% 0%, rgba(201, 169, 97, 0.15), transparent 70%)",
      },
      boxShadow: {
        "gold-glow": "0 0 35px -5px rgba(201, 169, 97, 0.3)",
        "gold-inner": "inset 0 1px 1px 0 rgba(245, 230, 173, 0.3)",
        "luxury-card": "0 20px 50px -10px rgba(0, 0, 0, 0.8), 0 0 1px 1px rgba(201, 169, 97, 0.15)",
      },
      animation: {
        "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "shimmer": "shimmer 2.5s infinite linear",
        "float": "float 6s ease-in-out infinite",
        "draw-path": "draw 2.5s ease-out forwards",
      },
      keyframes: {
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-8px)" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
