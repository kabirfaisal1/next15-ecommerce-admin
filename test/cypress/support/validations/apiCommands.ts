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
        }
    }
}

Cypress.Commands.add( 'generateStoreAPIEndpoint', ( testData: string, userId?: string, orderBy?: string = '' ): Cypress.Chainable<string> =>
{
    let storeIDQuery = ''; // Initialize the query with an empty string

    if ( userId )
    {
        cy.step( `Running SQL Query to find storeID` );
        storeIDQuery = `SELECT id FROM public."Stores" WHERE "userId" = '${userId}' ORDER BY "createdAt" ${orderBy};`;
    }
    cy.step( `storeIDQuery: ${storeIDQuery}` );
    if ( testData === 'dynamic' )
    {
        return cy.task( 'queryDatabase', storeIDQuery ).then( ( rows ) =>
        {
            if ( rows.length > 0 )
            {
                cy.step( `Returning endpoint with storeId: ${rows[ 0 ].id}` );
                return `/api/stores/${rows[ 0 ].id}`;
            } else
            {
                throw new Error( 'No rows returned from query' );
            }
        } );
    } else
    {
        cy.step( `Returning testData: ${testData}` );
        return cy.wrap( testData ); // Always return a Cypress chainable
    }
} );


// Custom Command Implementation
Cypress.Commands.add( 'validateStoreResponseBody', ( response: any, expectedResults: TestObjects ) =>
{
    if ( expectedResults.expectedResponseStoreName )
    {
        expect( response.name ).to.equal( expectedResults.expectedResponseStoreName );
        cy.step( `Validated response Store Name: ${expectedResults.expectedResponseStoreName}` );
    }

    if ( expectedResults.expectedResponseKeys )
    {
        cy.step( `Validated response keys: ${expectedResults.expectedResponseKeys}` );
        expectedResults.expectedResponseKeys.forEach( ( key ) =>
        {
            expect( response ).to.have.property( key );
        } );

    }

    if ( expectedResults.expectedResponseStoreId === false )
    {
        cy.step( `Validated response Store Id is not null` );
        expect( response.id ).to.not.be.empty;

    }

    if ( expectedResults.expectedResponseUseId !== undefined )
    {
        cy.step( `Validated response User Id: ${expectedResults.expectedResponseUseId}` );
        expect( response.userId ).to.equal( expectedResults.expectedResponseUseId );

    }
} );

