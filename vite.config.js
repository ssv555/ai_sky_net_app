import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());
  return {
    plugins: [react()],
    base: env.VITE_BASE_PATH || "/",
    server: {
      port: 31000,
      open: true,
      host: true,
      allowedHosts: ["it-joy.ru", "it-joy.com.ru", "v570907.hosted-by-vdsina.ru"],
    },
    build: {
      outDir: "dist",
      sourcemap: mode === "development",
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ["react", "react-dom", "react-router-dom"],
            ui: [
              "@mui/material",
              "@mui/icons-material",
              "@emotion/react",
              "@emotion/styled",
            ],
          },
          assetFileNames: (assetInfo) => {
            if (assetInfo.name.endsWith(".css")) {
              return "assets/css/[name]-[hash][extname]";
            }
            return "assets/[name]-[hash][extname]";
          },
          chunkFileNames: "assets/js/[name]-[hash].js",
          entryFileNames: "assets/js/[name]-[hash].js",
        },
      },
      cssCodeSplit: true, // Разделяем CSS на чанки
      cssMinify: true, // Минифицируем CSS
      chunkSizeWarningLimit: 1000,
      minify: "terser",
      terserOptions: {
        compress: {
          drop_console: mode === "production",
          drop_debugger: true,
        },
      },
    },
    optimizeDeps: {
      include: ["react", "react-dom", "react-router-dom"],
    },
    css: {
      modules: {
        scopeBehaviour: "local",
        localsConvention: "camelCase",
      },
      preprocessorOptions: {
        less: {
          javascriptEnabled: true,
        },
      },
      devSourcemap: true,
    },
  };
});
