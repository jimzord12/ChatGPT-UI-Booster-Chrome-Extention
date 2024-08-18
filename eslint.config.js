// ChatGPT Chat: https://chatgpt.com/share/ae1cdf29-25bf-46bd-ac77-7aaf891c69e6

import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import standard from "eslint-config-standard";
import prettier from "eslint-config-prettier";
import tailwindcss from "eslint-plugin-tailwindcss";

export default [
  {
    files: ["**/*.{js,mjs,cjs,ts}"],
    languageOptions: {
      globals: globals.browser,
      parser: tsParser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
      },
    },
    rules: {
      // Define any specific rules or overrides here
    },
    plugins: {
      tailwindcss,
    },
    settings: {
      tailwindcss: {
        // Tailwind-specific settings if needed
      },
    },
  },
  pluginJs.configs.recommended,
  tseslint.configs.recommended,
  standard,
  prettier,
];
