/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      keyframes: {
        zoomInOut: {
          "0%": { backgroundSize: "102%" },
          "2%": { backgroundSize: "102%" },
          "5%": { backgroundSize: "105%" },
          "10%": { backgroundSize: "106%" },
          "20%": { backgroundSize: "107%" },
          "30%": { backgroundSize: "108%" },
          "40%": { backgroundSize: "109%" },
          "50%": { backgroundSize: "110%" },
          "60%": { backgroundSize: "109%" },
          "70%": { backgroundSize: "108%" },
          "80%": { backgroundSize: "107%" },
          "90%": { backgroundSize: "106%" },
          "95%": { backgroundSize: "105%" },
          "98%": { backgroundSize: "102%" },
          "100%": { backgroundSize: "102%" },
        },
      },
      animation: {
        zoomInOut: "zoomInOut 50s cubic-bezier(0.05, 0.1, 0.1, 0.05) infinite",
        spinSlow: "spin 3s linear infinite",
      },
    },
  },
  plugins: [],
};
