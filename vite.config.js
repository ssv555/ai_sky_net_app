import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: process.env.VITE_BASE_PATH || "/",
  server: {
    port: 31000,
    open: true,
    host: true,
    allowedHosts: ["v570907.hosted-by-vdsina.ru"],
  },
  build: {
    outDir: "dist",
    sourcemap: true,
  },
});
