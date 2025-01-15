import { defineConfig } from "cypress";

export default defineConfig( {

  e2e: {
    specPattern: "test/cypress/**/**/*.cy.{js,jsx,ts,tsx}",
    downloadsFolder: "test/cypress/downloads",
    screenshotOnRunFailure: false,
    defaultCommandTimeout: 15000,
    viewportWidth: 1920,
    viewportHeight: 1080,
    supportFile: "**/support/e2e.ts",
    setupNodeEvents ( on, config )
    {
      const version = config.env.version || 'local';
      const url: { [ key: string ]: string; } = {
        local: "http://localhost:3000/",
        staging: "https://google.com",
        production: "https://amazon.com"
      };

      config.baseUrl = url[ version ];
      return config;
    },

  },
} );
