/// <reference types="cypress" />

export { }; // Ensures this file is treated as a module

/* eslint-disable @typescript-eslint/no-namespace */
declare global
{
    namespace Cypress
    {
        interface Chainable
        {
            storeAPIValidations ( response: any, expectedResults: TestObjects ): void;
            getStoreID ( query: string ): void;
        }
    }
}




// Custom Command Implementation
Cypress.Commands.add( 'storeAPIValidations', ( response: any, expectedResults: TestObjects ) =>
{
    if ( expectedResults.expectedResponseStoreName )
    {
        expect( response.name ).to.equal( expectedResults.expectedResponseStoreName );
        cy.step( `Validated response Store Name: ${expectedResults.expectedResponseStoreName}` );
    }

    if ( expectedResults.expectedResponseKeys )
    {
        expectedResults.expectedResponseKeys.forEach( ( key ) =>
        {
            expect( response ).to.have.property( key );
        } );
        cy.step( `Validated response keys: ${expectedResults.expectedResponseKeys}` );
    }

    if ( expectedResults.expectedResponseStoreId === false )
    {
        expect( response.id ).to.not.be.empty;
        cy.step( `Validated response Store Id is not null` );
    }

    if ( expectedResults.expectedResponseUseId !== undefined )
    {
        expect( response.userId ).to.equal( expectedResults.expectedResponseUseId );
        cy.step( `Validated response User Id: ${expectedResults.expectedResponseUseId}` );
    }
} );

Cypress.Commands.add( 'getStoreID', ( query ) =>
{
    return cy.task( 'queryDatabase', query ).then( ( rows ) =>
    {
        if ( rows.length > 0 )
        {
            const storeID = rows[ 0 ].id;
            cy.step( `Validated response Store Id: ${storeID}` );
            return storeID; // Return the ID
        } else
        {
            throw new Error( 'No rows returned from query' );
        }
    } );
} );
