import { defineConfig } from "cypress";
import { Client } from 'pg';
import dotenv from 'dotenv';

// Load .env file
dotenv.config();

export default defineConfig( {
  projectId: "h69q3m",
  e2e: {
    specPattern: 'test/cypress/**/**/*.cy.{js,jsx,ts,tsx}',
    downloadsFolder: 'test/cypress/downloads',
    screenshotOnRunFailure: false,
    defaultCommandTimeout: 15000,
    viewportWidth: 1920,
    viewportHeight: 1080,
    supportFile: '**/support/e2e.ts',
    retries: {
      // Configure retry attempts for `cypress run`
      // Default is 0
      runMode: 2,
      // Configure retry attempts for `cypress open`
      // Default is 0
      openMode: 0,
    },
    // chromeWebSecurity: false,
    setupNodeEvents ( on, config )
    {
      const version = config.env.version || 'local';
      const url: { [ key: string ]: string; } = {
        local: 'http://localhost:3000/',
        staging: 'http://localhost:8000/',
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
      //* Add a custom command to set environment variables for API Token
      on( 'task', {
        setEnv ( { key, value } )
        {
          process.env[ key ] = value;
          return null;
        },
      } );

      on( 'task', {
        queryDatabase ( query )
        {
          if ( !query )
          {
            throw new Error( 'The query passed to queryDatabase is null or undefined' );
          }

          const client = new Client( {
            connectionString: process.env.DATABASE_URL, // Use DATABASE_URL from the environment
            ssl: {
              rejectUnauthorized: true, // Enforce SSL verification (adjust if needed)
            },
          } );

          return client
            .connect()
            .then( () => client.query( query ) )
            .then( ( result ) =>
            {
              client.end();
              return result.rows; // Return the query results
            } )
            .catch( ( err ) =>
            {
              client.end();
              throw err; // Handle and propagate the error
            } );
        },
      } );

      return config;
    },
  },
} );
