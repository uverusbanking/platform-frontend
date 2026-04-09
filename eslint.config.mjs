import { defineConfig, globalIgnores } from "eslint/config";

const eslintConfig = defineConfig([
  // Override default ignores.
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "node_modules/**",
    "control/**",
    "personal-web/**",
    "corporate-web/**",
  ]),
]);

export default eslintConfig;
