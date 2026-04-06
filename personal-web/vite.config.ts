import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode: _mode }) => ({
  server: {
    host: "::",
    port: 8080,
    allowedHosts: ["preview.uveruspay.com", "uveruspay.com"],
    hmr: {
      overlay: false,
    },
  },

  preview: {
    allowedHosts: ["preview.uveruspay.com", "uveruspay.com"],
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
