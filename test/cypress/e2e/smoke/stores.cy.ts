/// <reference types="cypress" />

describe( 'Google', () =>
{
    beforeEach( () =>
    {
        // Visit the base URL set in your configuration
        cy.visit( '/' );

        cy.loginToAuth0();

    } );

    it( 'Create store for first time', () =>
    {
        cy.get( '[data-testid="modal_DialogTitle"]' ).should( 'be.visible' ).and( 'have.text', 'Create Store' );
        cy.get( '[data-testid="modal_DialogDescription"]' ).should( 'be.visible' ).and( 'have.text', 'Add a new store to manage products and categories' );
        cy.get( '[data-testid="storeModal-Form"]' ).should( 'be.visible' ).and( 'have.text', 'Name' );
    } );
} );
