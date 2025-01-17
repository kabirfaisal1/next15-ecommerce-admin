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

