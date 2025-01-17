/// <reference types="cypress" />
// import { Cypress } from 'cypress';


export { }; // Ensures this file is treated as a module



/* eslint-disable @typescript-eslint/no-namespace */
declare global
{
    namespace Cypress
    {
        interface Chainable
        {
            loginToAuth0 ( userType: string ): Chainable;
            getTokens (): Chainable;


            dragAndDrop (
                dragEl: Chainable<JQuery<HTMLElement>>,
                dropEl: Chainable<JQuery<HTMLElement>>
            ): Chainable<JQuery<HTMLElement>>;
            navigation_menu (
                element: string,
            ): Chainable<JQuery<HTMLElement>>;
            formatEndpoint (
                testData: string,
                userId?: string, orderBy?: string
            ): Chainable;
        }
    }
}



Cypress.Commands.add( 'loginToAuth0', ( userType: string ) =>
{

    // Dynamically set email and password based on environment and user type
    const version = Cypress.env( 'version' ) || 'local';
    // Ensure userType is properly normalized
    const normalizedUserType = userType.toLowerCase().replace( /\s+/g, '' ); // Remove spaces and convert to lowercase
    cy.step( normalizedUserType );
    const email =
        version === 'production'
            ? normalizedUserType === 'nostore'
                ? Cypress.env( 'ProdNoStoreUserEmail' )
                : Cypress.env( 'ProdEmail' )
            : normalizedUserType === 'nostore'
                ? Cypress.env( 'LocalNoStoreUserEmail' )
                : Cypress.env( 'LocalEmail' );

    const password =
        version === 'production'
            ? normalizedUserType === 'nostore'
                ? Cypress.env( 'ProdNoStoreUserPassword' )
                : Cypress.env( 'ProdPassword' )
            : normalizedUserType === 'nostore'
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
    ( dragEl: Cypress.Chainable, dropEl: Cypress.Chainable ) =>
    {
        cy.log( 'cy.dragAndDrop is triggered' );
        const dataTransfer = new DataTransfer();

        dragEl.trigger( 'dragstart', { dataTransfer } );
        dropEl.trigger( 'drop', { dataTransfer } );
        dragEl.trigger( 'dragend' );
    }
);

Cypress.Commands.add( 'formatEndpoint', ( testData: string, userId?: string, orderBy?: string = '' ): Cypress.Chainable<string> =>
{
    // const storeIDQuery = `SELECT id FROM public."Stores" WHERE "userId" = 'user_2rfrlZzqrYe0y1BAXYVYHQRgn8W';`;
    let storeIDQuery = ''; // Initialize the query with an empty string

    if ( userId )
    {
        storeIDQuery = `SELECT id FROM public."Stores" WHERE "userId" = '${userId}' ORDER BY "createdAt" ${orderBy};`;
    }
    cy.step( `storeIDQuery: ${storeIDQuery}` );
    if ( testData === 'dynamic' )
    {
        return cy.task( 'queryDatabase', storeIDQuery ).then( ( rows ) =>
        {
            if ( rows.length > 0 )
            {
                return `/api/stores/${rows[ 0 ].id}`;
            } else
            {
                throw new Error( 'No rows returned from query' );
            }
        } );
    } else
    {
        return cy.wrap( testData ); // Always return a Cypress chainable
    }
} );
