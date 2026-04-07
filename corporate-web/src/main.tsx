import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { BrandConfigService } from "@shared/core";

async function init() {
  // Load brand config (asynchronously, with fallback)
  await BrandConfigService.loadConfig(
    "corporate",
    import.meta.env.VITE_BRAND_CONFIG_URL,
  );

  createRoot(document.getElementById("root")!).render(<App />);
}

init();
