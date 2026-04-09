import type { Config } from "jest";
import nextJest from "next/jest.js";

// Dashboard has been migrated to Vite + Vitest — run its tests with `pnpm --filter dashboard test`
const createControlConfig = nextJest({ dir: "./control" });

const sharedConfig: Partial<Config> = {
  coverageProvider: "v8",
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
};

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

  return {
    projects: [controlConfig as Config],
  };
}
