import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { BrandConfigService } from "@shared/core";

async function init() {
  const config = await BrandConfigService.loadConfig(
    "personal",
    import.meta.env.VITE_API_URL,
  );
  BrandConfigService.applyToDocument(config);

  createRoot(document.getElementById("root")!).render(<App />);
}

init();
