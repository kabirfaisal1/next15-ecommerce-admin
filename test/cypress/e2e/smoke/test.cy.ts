/// <reference types="cypress" />

describe( 'Google', () =>
{
    it( 'should load Google homepage', () =>
    {
        cy.visit( 'https://www.google.com' );
    } );

    it( 'should perform drag-and-drop', () =>
    {
        cy.dragAndDrop( cy.get( '#drag' ), cy.get( '#drop' ) );
    } );
} );
