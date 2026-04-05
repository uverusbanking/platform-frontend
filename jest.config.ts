import type { Config } from "jest";
import nextJest from "next/jest.js";

const createJestConfig = nextJest({
  // Point to a real Next.js app directory so next/jest can find app/ and load next.config
  dir: "./dashboard",
});

// Add any custom config to be passed to Jest
const config: Config = {
  coverageProvider: "v8",
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  // Discover tests in all app directories
  roots: ["<rootDir>/control", "<rootDir>/dashboard"],
  moduleNameMapper: {
    // Handle module aliases — resolve @/ relative to each app's src
    "^@/(.*)$": "<rootDir>/$1",
    "^@shared/(.*)$": "<rootDir>/shared/$1",
  },
};

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
export default createJestConfig(config);
