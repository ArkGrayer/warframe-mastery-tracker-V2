import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        nunito: ['Nunito', 'sans-serif'],
      },
      colors: {
        void: {
          deep: "#08060e",
          surface: "#100e1a",
          border: "#1e1a2e",
          accent: "#4cc9ff",
          gold: "#c8a96e",
          marble: "#f0e6d3",
          dust: "#8a7a9b",
        }
      }
    },
  },
  plugins: [],
}

export default config
