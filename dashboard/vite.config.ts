import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

export default defineConfig({
  envDir: "../",
  server: {
    host: "::",
    port: 3001,
    allowedHosts: true,
    hmr: {
      overlay: false,
    },
    proxy: {
      "/api": {
        target: process.env.VITE_API_URL || "http://localhost:3000",
        changeOrigin: true,
        rewrite: (p) => p.replace(/^\/api/, "/api"),
      },
    },
  },
  preview: {
    port: 3001,
    allowedHosts: true,
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@shared/core": path.resolve(__dirname, "../shared/src"),
    },
  },
});
