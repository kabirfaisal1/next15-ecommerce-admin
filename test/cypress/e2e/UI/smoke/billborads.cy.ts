/// <reference types="cypress" />

describe( 'Google', () =>
{
    it( 'should load Google homepage', () =>
    {
        cy.visit( 'https://www.google.com' );
        cy.title().should( 'include', 'Google' );
    } );

    it( 'should search for a query', () =>
    {
        cy.visit( 'https://www.google.com' );
        cy.get( 'input[name="q"]' ).type( 'Cypress{enter}' );
        cy.title().should( 'include', 'Cypress' );
    } );
} );
