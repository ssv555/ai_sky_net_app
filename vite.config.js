import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { BASE_PATH } from "./src/config";

export default defineConfig({
  plugins: [react()],
  base: BASE_PATH || "/",
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
