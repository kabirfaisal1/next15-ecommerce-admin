/// <reference types="cypress" />

export { }; // Ensures this file is treated as a module

// Clerk Testing Library
import { addClerkCommands } from '@clerk/testing/cypress';
addClerkCommands( { Cypress, cy } );


/* eslint-disable @typescript-eslint/no-namespace */
declare global
{
    namespace Cypress
    {
        interface Chainable
        {

            loginToAuth0 (): Chainable<JQuery<HTMLElement>>;
            getTokens (): Chainable<JQuery<HTMLElement>>;

            /**
             * Custom command to perform drag-and-drop.
             * @param dragEl - The element to drag.
             * @param dropEl - The target element to drop into.
             */
            dragAndDrop (
                dragEl: Chainable<JQuery<HTMLElement>>,
                dropEl: Chainable<JQuery<HTMLElement>>
            ): Chainable<JQuery<HTMLElement>>;
            /**
         * Custom command to perform drag-and-drop.
         * @param dragEl - The element to drag.
         * @param dropEl - The target element to drop into.
         */
            navigation_menu (
                element: string,

            ): Chainable<JQuery<HTMLElement>>;
        }
    }
}
/* eslint-enable @typescript-eslint/no-namespace */


Cypress.Commands.add( 'loginToAuth0', () =>
{
    // Dynamically set email and password based on environment and user type
    const version = Cypress.env( 'version' ) || 'local';
    const userType = Cypress.env( 'userType' ) || 'regular'; // Default to 'regular' user

    cy.step( 'Getting environment-specific email' );
    const email =
        version === 'production'
            ? userType === 'noStore'
                ? Cypress.env( 'ProdNoStoreUserEmail' )
                : Cypress.env( 'ProdEmail' )
            : userType === 'noStore'
                ? Cypress.env( 'LocalNoStoreUserEmail' )
                : Cypress.env( 'LocalEmail' );
    cy.step( 'Getting environment-specific Password' );
    const password =
        version === 'production'
            ? userType === 'noStore'
                ? Cypress.env( 'ProdNoStoreUserPassword' )
                : Cypress.env( 'ProdPassword' )
            : userType === 'noStore'
                ? Cypress.env( 'LocalNoStoreUserPassword' )
                : Cypress.env( 'LocalPassword' );

    cy.step( `Entering Email` );
    cy.get( '#identifier-field' ).type( email );
    cy.step( `Clicking on Continue Button after entering email` );
    cy.get( '[data-localization-key="formButtonPrimary"]' ).should( 'have.text', 'Continue' ).click();

    cy.step( `Entering password` );
    cy.get( '#password-field' ).type( password, { log: false } );
    cy.step( `Clicking on Continue Button after entering password` );
    cy.get( '[data-localization-key="formButtonPrimary"]' ).should( 'have.text', 'Continue' ).click();

} );

Cypress.Commands.add( 'getTokens', () =>
{
    cy.step( `Getting tokens` );
    return cy.window().wait( 10000 ).then( ( win ) =>
    {
        if ( win.Clerk && win.Clerk.session )
        {
            return win.Clerk.session.getToken( { template: 'apiTest' } ).then( ( token: string ) =>
            {
                return cy.wrap( token ); // Wrap token to continue Cypress chaining
            } );
        } else
        {
            throw new Error( 'Clerk session is not available' );
        }
    } );
} );


Cypress.Commands.add( 'navigation_menu', ( element: string ) =>
{
    cy.step( `clicking on the navigation menu: ${element}` );
    if ( element === 'Select a store' )
    {
        cy.get( '[data-testid="store_switcher_trigger"]' ).should( 'have.attr', 'aria-label', 'Select a store' ).click();
        cy.step( 'Checking store switcher pop up to be visible' );
        cy.get( '[data-testid="store_switcher_group"]' ).should( 'be.visible' );
        cy.step( 'Checking store switcher input to be visible' );
        cy.get( 'data-testid="store_switcher_input"' ).should( 'be.visible' );
        cy.step( 'Checking Create Store button to be visible' );
        cy.get( '[data-value="Create Store"]' ).should( 'be.visible' );

    }
    else if ( element === 'Store Overview' )
    {
        cy.get( '[data-testid="store_overview"]' ).should( 'have.text', 'Store Overview' ).click();
    }

    else if ( element === 'Billboards' ) 
    {
        cy.get( '[data-testid="billboards"]' ).should( 'have.text', 'Billboards' ).click();
        cy.step( 'Checking URL to include Billboards' );
        cy.url().should( 'include', element.toLowerCase() );
        cy.step( 'Checking Billboards heading title to be visible' );
        cy.get( '[data-testid="heading-title"]' ).should( 'be.visible' ).and( 'have.text', 'Billboards' );
    }

    else if ( element === 'Settings' ) 
    {
        cy.get( '[data-testid="store_settings"]' ).should( 'have.text', 'Settings' ).click();
        cy.step( 'Checking URL to include Settings' );
        cy.url().should( 'include', element.toLowerCase() );
        cy.step( 'Checking Settings heading title to be visible' );
        cy.get( '[data-testid="heading-title"]' ).should( 'be.visible' ).and( 'have.text', 'Settings' );
    }

    else if ( element === 'User Button' ) 
    {
        cy.get( '[data-clerk-component="UserButton"]' ).should( 'be.visible' ).click();
        cy.step( 'Checking User Button Popover Card to be visible' );
        cy.get( '[class="cl-userButtonPopoverCard cl-popoverBox cl-userButton-popover 🔒️ cl-internal-1grbo8b"]' ).should( 'be.visible' );
    }
    else ( cy.step( `${element} is not found` ) );
} );



Cypress.Commands.add(
    'dragAndDrop',
    ( dragEl: Cypress.Chainable<JQuery<HTMLElement>>, dropEl: Cypress.Chainable<JQuery<HTMLElement>> ) =>
    {
        cy.log( 'cy.dragAndDrop is triggered' );
        const dataTransfer = new DataTransfer();

        dragEl.trigger( 'dragstart', { dataTransfer } );
        dropEl.trigger( 'drop', { dataTransfer } );
        dragEl.trigger( 'dragend' );
    }
);
