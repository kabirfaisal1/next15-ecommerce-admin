import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";
import cypressPlugin from "eslint-plugin-cypress"; // Import the Cypress plugin

const __filename = fileURLToPath( import.meta.url );
const __dirname = dirname( __filename );

const compat = new FlatCompat( {
  baseDirectory: __dirname,
} );

const eslintConfig = [
  ...compat.extends( "next/core-web-vitals", "next/typescript" ),
  {
    files: ["test/cypress/**/*.cy.{js,ts,jsx,tsx}"], // Target Cypress test files
    plugins: {
      cypress: cypressPlugin, // Add the Cypress plugin object
    },
    env: {
      "cypress/globals": true, // Enable Cypress globals
    },
    rules: {
      ...cypressPlugin.configs.recommended.rules, // Apply recommended Cypress rules
    },
  },
];

export default eslintConfig;
