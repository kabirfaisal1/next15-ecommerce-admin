import { defineConfig } from "cypress";

import dotenv from 'dotenv';

// Load .env file
dotenv.config();

export default defineConfig( {
  e2e: {
    specPattern: 'test/cypress/**/**/*.cy.{js,jsx,ts,tsx}',
    downloadsFolder: 'test/cypress/downloads',
    screenshotOnRunFailure: false,
    defaultCommandTimeout: 15000,
    viewportWidth: 1920,
    viewportHeight: 1080,
    supportFile: '**/support/e2e.ts',
    setupNodeEvents ( on, config )
    {
      const version = config.env.version || 'local';
      const url: { [ key: string ]: string; } = {
        local: 'http://localhost:3000/',
        staging: 'https://google.com',
        production: 'https://amazon.com',
      };

      // Set the base URL dynamically
      config.baseUrl = url[ version ];

      // Add all environment variables
      config.env = {
        ...config.env,
        ProdEmail: process.env.prodEmail,
        ProdPassword: process.env.prodPassword,
        ProdNoStoreUserEmail: process.env.prodNoStoreUserEmail,
        ProdNoStoreUserPassword: process.env.prodNoStoreUserPassword,
        LocalEmail: process.env.LocalEmail,
        LocalPassword: process.env.LocalPassword,
        LocalNoStoreUserEmail: process.env.LocalNoStoreUserEmail,
        LocalNoStoreUserPassword: process.env.LocalNoStoreUserPassword,
      };
      on( 'task', {

        setEnv ( { key, value } )
        {

          process.env[ key ] = value;

          return null;

        }

      } );

      return config;
    },
  },
} );
