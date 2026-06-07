import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "@/styles/globals.css";
import { BrandConfigService } from "@shared/core";

async function init() {
  await BrandConfigService.loadConfig(
    "dashboard",
    import.meta.env.VITE_BRAND_CONFIG_URL,
  );

  createRoot(document.getElementById("root")!).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
}

init();
