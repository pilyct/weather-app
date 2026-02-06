import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/weather": "http://localhost:3000",
      "/cities": "http://localhost:3000",
      "/poem": "http://localhost:3000",
    },
  },
  // server: {
  //   port: 3000, // optional, matches CRA
  //   // proxy: { "/api": "http://localhost:3001" }, // uncomment if you want backend proxying
  // },
});
