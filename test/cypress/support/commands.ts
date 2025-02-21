/// <reference types="cypress" />

export { }; // Ensures this file is treated as a module to prevent global scope pollution

/* eslint-disable @typescript-eslint/no-namespace */
declare global
{
    namespace Cypress
    {
        interface Chainable
        {
            /**
             * Logs in to Auth0 with a specified user type.
             * @param {string} userType - The type of user to log in as.
             */
            loginToAuth0 ( userType: string ): Chainable;

            /**
             * Retrieves authentication tokens from Clerk.
             * @returns {Chainable<string>} - Returns a Cypress-wrapped token.
             */
            getTokens (): Chainable<string>;

            /**
             * Performs drag-and-drop actions between two elements.
             * @param {Cypress.Chainable} dragEl - Element to be dragged.
             * @param {Cypress.Chainable} dropEl - Target element for the drop.
             */
            dragAndDrop ( dragEl: Chainable<JQuery<HTMLElement>>, dropEl: Chainable<JQuery<HTMLElement>> ): Chainable<JQuery<HTMLElement>>;

            /**
             * Navigates to a tab item in the navigation menu.
             * @param {string} element - The name of the navigation element.
             */
            navigateTabItem ( element: string ): Chainable<JQuery<HTMLElement>>;

            /**
             * Verifies if a toast message is displayed.
             * @param {string} message - The expected message.
             */
            verifyToastMessage ( message: string ): Chainable;

            /**
             * Asserts that a value was successfully copied to the clipboard.
             * @param {string} value - The expected clipboard value.
             */
            assertValueCopiedToClipboard ( value: string ): Chainable;

            /**
             * Handles object deletion confirmation dialogs.
             * @param {boolean} confirm - If true, confirms deletion; otherwise cancels.
             */
            deleteObjects ( confirm: boolean ): Chainable;

            /**
             * Uploads an image to Cloudinary.
             * @param {string} imageUrl - The image URL or file path.
             */
            uploadToCloudinary ( imageUrl: string ): Chainable;

            /**
             * Handles table actions based on search text.
             * @param {Cypress.Chainable} tableRowSelector - Selector for table rows.
             * @param {Cypress.Chainable} tableColumnSelector - Selector for action column.
             * @param {string} searchText - Text to search for in the table.
             */
            handlingTable (
                tableRowSelector: Chainable<JQuery<HTMLElement>>,
                tableColumnSelector: Chainable<JQuery<HTMLElement>>,
                searchText: string
            ): Chainable<JQuery<HTMLElement>>;

            /**
             * Submits a form and validates API responses.
             * @param {string} storeId - The store ID.
             * @param {'categories' | 'sizes'} entityType - The type of entity.
             * @param {() => Chainable<JQuery<HTMLElement>>} buttonElement - The button selector function.
             * @param {string} [entityId] - The entity ID if updating.
             * @param {(interception: any) => void} [additionalValidation] - Additional validation function.
             */
            afterSubmitForm (
                storeId: string,
                entityType: 'categories' | 'sizes',
                buttonElement: () => Chainable<JQuery<HTMLElement>>,
                entityId?: string,
                additionalValidation?: ( interception: any ) => void
            ): Chainable<JQuery<HTMLElement>>;
        }
    }
}

/**
 * Logs in to Auth0 with a specific user type.
 */
Cypress.Commands.add( 'loginToAuth0', ( userType: string ) =>
{
    const version = Cypress.env( 'version' ) || 'local';
    const normalizedUserType = userType.toLowerCase().replace( /\s+/g, '' );
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

    cy.get( '#identifier-field' ).type( email );
    cy.get( '[data-localization-key="formButtonPrimary"]' ).contains( 'Continue' ).click();
    cy.get( '#password-field' ).type( password, { log: false } );
    cy.get( '[data-localization-key="formButtonPrimary"]' ).contains( 'Continue' ).click();
} );

/**
 * Retrieves authentication tokens.
 */
Cypress.Commands.add( 'getTokens', () =>
{
    cy.window().wait( 10000 ).then( ( win ) =>
    {
        if ( win.Clerk?.session )
        {
            return win.Clerk.session.getToken( { template: 'apiTest' } ).then( ( token: string ) => cy.wrap( token ) );
        } else
        {
            throw new Error( 'Clerk session is not available' );
        }
    } );
} );

/**
 * Handles navigation within the menu.
 */
Cypress.Commands.add( 'navigateTabItem', ( element: string ) =>
{
    const menuItems: { [ key: string ]: string; } = {
        'Store Overview': '[data-testid="store_overview"]',
        'Billboards': '[data-testid="billboards"]',
        'Categories': '[data-testid="categories"]',
        'Settings': '[data-testid="store_settings"]',
        'User Button': '[data-clerk-component="UserButton"]',
    };

    const selector = menuItems[ element ] || '[data-testid="store_overview"]';
    cy.get( selector ).click();

    if ( element !== 'User Button' )
    {
        cy.url().should( 'include', element.toLowerCase() );
        cy.get( '[data-testid="heading-title"]' ).should( 'be.visible' ).and( 'include.text', element );
    }
} );

/**
 * Performs drag-and-drop actions.
 */
Cypress.Commands.add( 'dragAndDrop', ( dragEl, dropEl ) =>
{
    const dataTransfer = new DataTransfer();
    dragEl.trigger( 'dragstart', { dataTransfer } );
    dropEl.trigger( 'drop', { dataTransfer } );
    dragEl.trigger( 'dragend' );
} );

/**
 * Verifies if a toast message is displayed.
 */
Cypress.Commands.add( 'verifyToastMessage', ( message: string ) =>
{
    cy.get( '.g03958317564' ).should( 'be.visible' ).and( 'have.text', message );
} );

/**
 * Asserts that a value was copied to the clipboard.
 */
Cypress.Commands.add( 'assertValueCopiedToClipboard', ( value: string ) =>
{
    cy.window().then( ( win ) =>
    {
        win.navigator.clipboard.readText().then( ( text ) =>
        {
            expect( text ).to.include( value );
        } );
    } );
} );

/**
 * Handles object deletion dialogs.
 */
Cypress.Commands.add( 'deleteObjects', ( confirm: boolean ) =>
{
    cy.get( '[data-testid="modal_DialogTitle"]' ).should( 'be.visible' ).and( 'have.text', 'Are you sure?' );
    cy.get( '[data-testid="modal_DialogDescription"]' ).should( 'be.visible' ).and( 'have.text', 'This action cannot be undone' );

    cy.get( '[data-testid="modal_DialogChildren"] button' )
        .contains( confirm ? 'Confirm' : 'Cancel' )
        .should( 'be.visible' )
        .click();
} );

/**
 * Handles table actions based on search text.
 */
Cypress.Commands.add( 'handlingTable', ( tableRowSelector, tableColumnSelector, searchText ) =>
{
    tableRowSelector.each( ( $row, index ) =>
    {
        cy.wrap( $row )
            .invoke( 'text' )
            .then( ( text ) =>
            {
                if ( text.includes( searchText.trim() ) )
                {
                    tableColumnSelector.eq( index ).click();
                }
            } );
    } );
} );
