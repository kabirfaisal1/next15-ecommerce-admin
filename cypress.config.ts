import { defineConfig } from "cypress";
import { clerkSetup } from '@clerk/testing/cypress';

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
      clerkSetup( { config } );

      /**
       * An object that maps environment names to their corresponding URLs.
       * - `local`: URL for the local environment.
       * - `staging`: URL for the staging environment.
       * - `production`: URL for the production environment.
       */
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
