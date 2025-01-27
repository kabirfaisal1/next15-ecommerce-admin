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
Cypress.Commands.add( 'generateStoreAPIEndpoint', ( testData: string, userId?: string, orderBy: string = '' ): Cypress.Chainable<string> =>
{
    // Initialize the query with an empty string
    let storeIDQuery = '';

    // Check if a userId is provided, construct the SQL query to find the store ID
    if ( userId )
    {
        cy.step( `Running SQL Query to find storeID` );
        storeIDQuery = `SELECT id FROM public."Stores" WHERE "userId" = '${userId}' ORDER BY "createdAt" ${orderBy};`;
    }

    // Log the constructed query for debugging purposes
    cy.step( `storeIDQuery: ${storeIDQuery}` );

    // If the testData is dynamic, fetch the store ID from the database
    if ( testData === 'dynamic' )
    {
        // Execute the query using a Cypress task and process the results
        return cy.task( 'queryDatabase', storeIDQuery ).then( ( rows ) =>
        {
            // Check if the query returned any rows
            if ( rows.length > 0 )
            {
                cy.step( `Returning endpoint with storeId: ${rows[ 0 ].id}` );
                // Wrap the endpoint in cy.wrap to ensure it's chainable
                return cy.wrap( `/api/stores/${rows[ 0 ].id}` );
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

Cypress.Commands.add( 'validateStoreResponseBody', ( response: any, expectedResults: TestObjects ) =>
{

    // Check if an expected store name is provided for validation
    if ( expectedResults.expectedResponseStoreName )
    {
        // Assert that the response's name matches the expected store name
        expect( response.name ).to.equal( expectedResults.expectedResponseStoreName );
        // Log a step indicating successful validation of the store name
        cy.step( `Validated response Store Name: ${expectedResults.expectedResponseStoreName}` );
    }

    // Check if there are specific response keys expected in the response body
    if ( expectedResults.expectedResponseKeys )
    {
        // Log a step indicating the keys that will be validated
        cy.step( `Validated response keys: ${expectedResults.expectedResponseKeys}` );
        // Loop through each expected key and assert that the response has the property
        expectedResults.expectedResponseKeys.forEach( ( key ) =>
        {
            expect( response ).to.have.property( key );
        } );
    }

    // Check if the `expectedResponseStoreId` is explicitly set to false
    if ( expectedResults.expectedResponseStoreId === false )
    {
        // Log a step indicating that the store ID should not be null or empty
        cy.step( `Validated response Store Id is not null` );
        // Assert that the response's `id` is not empty
        expect( response.id ).to.not.be.empty;
    }

    // Check if an expected user ID is provided for validation
    if ( expectedResults.expectedResponseUseId !== undefined )
    {
        // Log a step indicating the expected user ID that will be validated
        cy.step( `Validated response User Id: ${expectedResults.expectedResponseUseId}` );
        // Assert that the response's `userId` matches the expected user ID
        expect( response.userId ).to.equal( expectedResults.expectedResponseUseId );
    }
} );

Cypress.Commands.add( 'generateBillboardAPIEndpoint', ( testData: string, storeid?: string, orderBy: string = '' ): Cypress.Chainable<string> =>
{
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

Cypress.Commands.add( 'validateBillboardResponseBody', ( response: any, expectedResults: TestObjects ) =>
{

    // Check if an expected store name is provided for validation
    if ( expectedResults.expectedResponseBillboardName )
    {
        // Assert that the response's name matches the expected store name
        expect( response.label ).to.equal( expectedResults.expectedResponseBillboardName );
        // Log a step indicating successful validation of the store name
        cy.step( `Validated response Store Name: ${expectedResults.expectedResponseBillboardName}` );
    }

    // Check if there are specific response keys expected in the response body
    if ( expectedResults.expectedResponseKeys )
    {
        // Log a step indicating the keys that will be validated
        cy.step( `Validated response keys: ${expectedResults.expectedResponseKeys}` );
        // Loop through each expected key and assert that the response has the property
        expectedResults.expectedResponseKeys.forEach( ( key ) =>
        {
            expect( response ).to.have.property( key );
        } );
    }

    cy.step( `Validated response Store Id 2${expectedResults.expectedResponseStoreId} and storeid ${response.storeId }` );
    // Check if the `expectedResponseStoreId` is explicitly set to false
    if ( expectedResults.expectedResponseStoreId )
    {
        cy.step( `Checking that Store Id matches ${expectedResults.expectedResponseStoreId}` );
        // Assert that the `storeId` matches the expected value
        expect( response.storeId ).to.equal( expectedResults.expectedResponseStoreId );
    }

    // Check if an expected imageUrl is provided for validation
    if ( expectedResults.expectedResponseImageUrl )
    {
        // Log a step indicating the expected imageUrl that will be validated
        cy.step( `Validated response imageUrl: ${expectedResults.expectedResponseImageUrl}` );
        // Assert that the response's `userId` matches the expected imageUrl
        expect( response.imageUrl ).to.equal( expectedResults.expectedResponseImageUrl );
    }

    // Check if there are response Errors expected in the response body
    if ( expectedResults.expectedError )
    {
        // Log a step indicating the keys that will be validated
        cy.step( `Validated response keys: ${expectedResults.expectedError}` );
        // Loop through each expected key and assert that the response has the property
        expect( response ).to.equal( expectedResults.expectedError );

    }
} );
