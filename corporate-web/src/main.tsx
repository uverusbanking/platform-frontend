import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { BrandConfigService } from "./lib/brand-config";

async function init() {
  // Load brand config (asynchronously, with fallback)
  await BrandConfigService.loadConfig("corporate");

  createRoot(document.getElementById("root")!).render(<App />);
}

init();
