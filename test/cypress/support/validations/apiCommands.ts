/// <reference types="cypress" />

export { }; // Ensures this file is treated as a module

/* eslint-disable @typescript-eslint/no-namespace */
declare global
{
    namespace Cypress
    {
        interface Chainable
        {
            validateStoreResponseBody ( response: any, expectedResults: TestObjects ): void;
            generateStoreAPIEndpoint (
                testData: string,
                userId?: string, orderBy?: string
            ): Chainable;
            generateBillboardAPIEndpoint (
                testData: string,
                userId?: string, orderBy?: string
            ): Chainable;
            validateBillboardResponseBody ( response: any, expectedResults: TestObjects ): void;
        }
    }
}
Cypress.Commands.add(
    'generateStoreAPIEndpoint',
    ( testData: string, userId?: string, orderBy: 'ASC' | 'DESC' = 'DESC' ): Cypress.Chainable<string> =>
    {
        // Construct the SQL query only if userId is provided
        const storeIDQuery = userId
            ? `SELECT id FROM public."Stores" WHERE "userId" = '${userId}' ORDER BY "createdAt" ${orderBy};`
            : '';

        cy.step( `Generated SQL Query: ${storeIDQuery}` );

        // Handle dynamic testData by fetching store ID from the database
        if ( testData === 'dynamic' && storeIDQuery )
        {
            return cy.task( 'queryDatabase', storeIDQuery ).then( ( rows ) =>
            {
                if ( rows?.length > 0 )
                {
                    const storeId = rows[ 0 ].id;
                    cy.step( `Resolved storeId: ${storeId}` );
                    return cy.wrap( `/api/stores/${storeId}` ); // Ensure Cypress chains it
                } else
                {
                    throw new Error( 'No store ID found for the provided userId.' );
                }
            } );
        }

        // Return the testData directly if not dynamic
        cy.step( `Returning static testData: ${testData}` );
        return cy.wrap( testData ); // Ensure Cypress chains it
    }
);

Cypress.Commands.add( 'validateStoreResponseBody', ( response: any, expectedResults: any ) =>
{
    cy.step( 'Starting store response validation' );

    // Helper function to validate specific keys in the response
    const validateKeys = ( keys: string[], responseBody: any ) =>
    {
        cy.step( `Validating response keys: ${keys}` );
        keys.forEach( ( key ) =>
        {
            expect( responseBody ).to.have.property( key, responseBody[ key ] );
        } );
    };

    // Helper function to log validation success
    const logValidation = ( field: string, expected: any, actual: any ) =>
    {
        cy.step( `Validated ${field}: Expected [${expected}], Found [${actual}]` );
    };

    // Store Name Validation
    if ( expectedResults.expectedResponseStoreName )
    {
        expect( response.name ).to.equal( expectedResults.expectedResponseStoreName );
        logValidation( 'Store Name', expectedResults.expectedResponseStoreName, response.name );
    }

    // Response Keys Validation
    if ( expectedResults.expectedResponseKeys )
    {
        validateKeys( expectedResults.expectedResponseKeys, response );
    }

    // Store ID Validation
    if ( expectedResults.expectedResponseStoreId === false )
    {
        cy.step( 'Validating that Store ID is not null' );
        expect( response.id ).to.not.be.empty;
    }

    // User ID Validation
    if ( expectedResults.expectedResponseUseId !== undefined )
    {
        expect( response.userId ).to.equal( expectedResults.expectedResponseUseId );
        logValidation( 'User ID', expectedResults.expectedResponseUseId, response.userId );
    }
} );

Cypress.Commands.add( 'generateBillboardAPIEndpoint', ( testData: string, storeid?: string, orderBy: string = '' ): Cypress.Chainable<string> =>
{
    //TODO: Improve the logic to handle be more dynamic and not rely on the testData value.
    // Initialize the query with an empty string
    let billboardIDQuery = '';

    // Check if a userId is provided, construct the SQL query to find the billboard ID
    if ( storeid )
    {
        cy.step( `Running SQL Query to find billboardID` );

        billboardIDQuery = ` SELECT id FROM public."Billboards" where "storeId" = '${storeid}' ORDER by "createdAt" DESC;`;
        cy.step( `billboardIDQuery: ${billboardIDQuery}` );
    }

    // Log the constructed query for debugging purposes
    cy.step( `billboardIDQuery: ${billboardIDQuery}` );

    // If the testData is dynamic, fetch the billboard ID from the database
    if ( testData === 'dynamic' )
    {
        // Execute the query using a Cypress task and process the results
        return cy.task( 'queryDatabase', billboardIDQuery ).then( ( rows ) =>
        {
            // Check if the query returned any rows
            if ( rows.length > 0 )
            {
                cy.step( `Returning endpoint with billboardId: ${rows[ 0 ].id}` );
                // Wrap the endpoint in cy.wrap to ensure it's chainable
                return cy.wrap( `api/${storeid}/billboards/${rows[ 0 ].id}` );
            } else
            {
                // Throw an error if no rows are returned
                throw new Error( 'No rows returned from query' );
            }
        } );
    } else
    {
        // If the testData is not dynamic, return it as-is
        cy.step( `Returning testData: ${testData}` );
        return cy.wrap( testData ); // Wrap testData in cy.wrap to ensure chainability
    }
} );

Cypress.Commands.add( 'validateBillboardResponseBody', ( response: any, expectedResults: any ) =>
{
    cy.step( 'Validating billboard response' );

    // Use a switch statement to handle different validation cases
    Object.keys( expectedResults ).forEach( ( key ) =>
    {
        switch ( key )
        {
            case 'expectedResponseBillboardName':
                // Validate the expected billboard name
                expect( response.label ).to.equal( expectedResults.expectedResponseBillboardName );
                cy.step( `Validated response Store Name: ${expectedResults.expectedResponseBillboardName}` );
                break;

            case 'expectedResponseKeys':
                // Validate the presence of specific keys in the response
                cy.step( `Validated response keys: ${expectedResults.expectedResponseKeys}` );
                expectedResults.expectedResponseKeys.forEach( ( expectedKey: string ) =>
                {
                    expect( response ).to.have.property( expectedKey );
                } );
                break;

            case 'expectedResponseStoreId':
                // Validate the expected store ID
                cy.step( `Checking that Store ID matches ${expectedResults.expectedResponseStoreId}` );
                expect( response.storeId ).to.equal( expectedResults.expectedResponseStoreId );
                break;

            case 'expectedResponseImageUrl':
                // Validate the expected image URL
                cy.step( `Validated response imageUrl: ${expectedResults.expectedResponseImageUrl}` );
                expect( response.imageUrl ).to.equal( expectedResults.expectedResponseImageUrl );
                break;

            case 'expectedError':
                // Validate the expected error in the response
                cy.step( `Validated response error: ${expectedResults.expectedError}` );
                expect( response ).to.equal( expectedResults.expectedError );
                break;

            default:
                cy.step( `No validation logic for key: ${key}` );
                break;
        }
    } );

    // Additional logging for Store ID validation
    cy.step(
        `Validated response Store ID 2${expectedResults.expectedResponseStoreId} and store ID ${response.storeId}`
    );
} );
