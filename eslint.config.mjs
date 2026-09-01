import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";

const eslintConfig = defineConfig([
  ...nextVitals,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
  {
    rules: {
      // Suppress React Hook warnings
      "react-hooks/exhaustive-deps": "off",
      "react-hooks/rules-of-hooks": "warn",
      
      // Suppress Next.js image optimization warnings
      "@next/next/no-img-element": "off",
      
      // Suppress window.location.href warning
      "@next/next/no-html-link-for-pages": "off",
    },
  },
]);

export default eslintConfig;
