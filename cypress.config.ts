import { defineConfig } from "cypress";
import { Client } from 'pg';
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

      //* Add all user credentials to the environment variables to be used in the tests based on the environment
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
      //* Add a custom command to set environment variables for API Token
      on( 'task', {
        setEnv ( { key, value } )
        {
          process.env[ key ] = value;
          return null;
        },

        queryDatabase ( { query, values } )
        {
          const client = new Client( {
            connectionString: process.env.DATABASE_URL,
          } );

          return client.connect()
            .then( () => client.query( query, values ) )
            .then( res =>
            {
              client.end();
              return res.rowCount; // Return the number of affected rows
            } )
            .catch( err =>
            {
              client.end();
              throw err;
            } );
        },
      } );

      return config;
    },
  },
} );
