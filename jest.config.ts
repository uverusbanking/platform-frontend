import type { Config } from "jest";
import nextJest from "next/jest.js";

// Create a separate Jest config for each app, since each has its own @/ alias root
const createControlConfig = nextJest({ dir: "./control" });
const createDashboardConfig = nextJest({ dir: "./dashboard" });

const sharedConfig: Partial<Config> = {
  coverageProvider: "v8",
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
};

// Use an async function export to avoid top-level await
export default async function (): Promise<Config> {
  const controlConfig = await createControlConfig({
    ...sharedConfig,
    displayName: "control",
    roots: ["<rootDir>/control"],
    // Exclude Playwright e2e tests — those use a different runner
    testPathIgnorePatterns: ["/node_modules/", "/e2e/"],
    moduleNameMapper: {
      "^@/(.*)$": "<rootDir>/control/src/$1",
      "^@shared/(.*)$": "<rootDir>/shared/$1",
    },
  })();

  const dashboardConfig = await createDashboardConfig({
    ...sharedConfig,
    displayName: "dashboard",
    roots: ["<rootDir>/dashboard"],
    moduleNameMapper: {
      "^@/(.*)$": "<rootDir>/dashboard/src/$1",
      "^@shared/(.*)$": "<rootDir>/shared/$1",
    },
  })();

  return {
    projects: [controlConfig as Config, dashboardConfig as Config],
  };
}
