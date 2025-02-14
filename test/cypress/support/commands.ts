//// <reference types="cypress" />
// Import Cypress types for better IntelliSense and type checking
// import { Cypress } from 'cypress';

export { }; // Ensures this file is treated as a module to prevent global scope pollution

/* eslint-disable @typescript-eslint/no-namespace */
// Declare global namespace extensions for Cypress
declare global
{
    namespace Cypress
    {
        interface Chainable
        {
            // Custom command to log in to Auth0 with a specific user type
            loginToAuth0 ( userType: string ): Chainable;

            // Custom command to retrieve authentication tokens
            getTokens (): Chainable;

            // Custom command to perform drag-and-drop actions
            dragAndDrop (
                dragEl: Chainable<JQuery<HTMLElement>>, // Element to drag
                dropEl: Chainable<JQuery<HTMLElement>> // Element to drop onto
            ): Chainable<JQuery<HTMLElement>>;

            // Custom command to interact with the navigation menu
            navigateTabItem (
                element: string // Name of the navigation element to click
            ): Chainable<JQuery<HTMLElement>>;

            // Custom command to verify toast messages
            verifyToastMessage ( message: string ): Chainable;

            // Custom command to assert values copied to clipboard
            assertValueCopiedToClipboard ( message: string ): Chainable;

            // Custom command to handle the deletion of objects with confirmation
            deleteObjects ( object: boolean ): Chainable;

            uploadToCloudinary ( imageUrl: string ): Chainable;

            handlingTable (
                tableRowSelector: Chainable<JQuery<HTMLElement>>,
                tableColumnSelector: Chainable<JQuery<HTMLElement>>,
                searchText: string
            ): Chainable<JQuery<HTMLElement>>;
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

// Add a custom command to log in to Auth0 with a specific user type
Cypress.Commands.add( 'loginToAuth0', ( userType: string ) =>
{
    // Dynamically set email and password based on environment and user type
    const version = Cypress.env( 'version' ) || 'local';
    // Normalize the userType string by converting to lowercase and removing spaces
    const normalizedUserType = userType.toLowerCase().replace( /\s+/g, '' );
    cy.step( normalizedUserType ); // Log the normalized user type
    // Determine the email based on the environment (production or local) and user type
    const email =
        version === 'production'
            ? normalizedUserType === 'nostore'
                ? Cypress.env( 'ProdNoStoreUserEmail' )
                : Cypress.env( 'ProdEmail' )
            : normalizedUserType === 'nostore'
                ? Cypress.env( 'LocalNoStoreUserEmail' )
                : Cypress.env( 'LocalEmail' );

    // Determine the password based on the environment and user type
    const password =
        version === 'production'
            ? normalizedUserType === 'nostore'
                ? Cypress.env( 'ProdNoStoreUserPassword' )
                : Cypress.env( 'ProdPassword' )
            : normalizedUserType === 'nostore'
                ? Cypress.env( 'LocalNoStoreUserPassword' )
                : Cypress.env( 'LocalPassword' );

    // Log a step for entering the email
    cy.step( `Entering Email` );
    // Enter the email in the identifier field
    cy.get( '#identifier-field' ).type( email );

    // Log a step for clicking the "Continue" button after entering the email
    cy.step( `Clicking on Continue Button after entering email` );
    // Click the "Continue" button
    cy.get( '[data-localization-key="formButtonPrimary"]' )
        .should( 'have.text', 'Continue' )
        .click();

    // Log a step for entering the password
    cy.step( `Entering password` );
    // Enter the password in the password field
    cy.get( '#password-field' ).type( password, { log: false } );

    // Log a step for clicking the "Continue" button after entering the password
    cy.step( `Clicking on Continue Button after entering password` );
    // Click the "Continue" button
    cy.get( '[data-localization-key="formButtonPrimary"]' )
        .should( 'have.text', 'Continue' )
        .click();
} );

// Add a custom command to retrieve authentication tokens
Cypress.Commands.add( 'getTokens', () =>
{
    // Log a step for getting tokens
    cy.step( `Getting tokens` );
    return cy.window().wait( 10000 ).then( ( win ) =>
    {
        // Check if the Clerk session is available
        if ( win.Clerk && win.Clerk.session )
        {
            // Retrieve the token using the Clerk session API
            return win.Clerk.session.getToken( { template: 'apiTest' } ).then( ( token: string ) =>
            {
                // Wrap the token in Cypress chainable for further chaining
                return cy.wrap( token );
            } );
        } else
        {
            // Throw an error if the Clerk session is not available
            throw new Error( 'Clerk session is not available' );
        }
    } );
} );

// Add a custom command to interact with the navigation menu
// Add a custom command to interact with the navigation menu
Cypress.Commands.add( 'navigateTabItem', ( element: string ) =>
{
    cy.step( `clicking on the navigation menu: ${element}` );

    switch ( element )
    {
        case 'Store Overview':
            // Handle logic for "Store Overview" navigation menu item
            cy.get( '[data-testid="store_overview"]' )
                .should( 'have.text', 'Store Overview' )
                .click();
            break;

        case 'Billboards':
            // Handle logic for "Billboards" navigation menu item
            cy.get( '[data-testid="billboards"]' )
                .should( 'have.text', 'Billboards' )
                .click();
            cy.step( 'Checking URL to include Billboards' );
            cy.url().should( 'include', element.toLowerCase() );
            cy.step( 'Checking Billboards heading title to be visible' );
            cy.get( '[data-testid="heading-title"]' )
                .should( 'be.visible' )
                .and( 'include.text', 'Billboards' );
            cy.get( '[data-testid="heading-description"]' )
                .should( 'be.visible' ).first()
                .and( 'have.text', 'Manage billboards for your store' );
            break;

        case 'Categories':
            // Handle logic for "Settings" navigation menu item
            cy.get( '[data-testid="categories"]' )
                .should( 'have.text', 'Categories' )
                .click();
            cy.step( 'Checking URL to include categories' );
            cy.url().should( 'include', element.toLowerCase() );
            cy.step( 'Checking categories heading title to be visible' );
            cy.get( '[data-testid="heading-title"]' )
                .should( 'be.visible' )
                .and( 'include.text', 'Categories' );
            cy.get( '[data-testid="heading-description"]' )
                .should( 'be.visible' ).first()
                .and( 'have.text', 'Manage category for your store' ); //toDO Categories
            break;

        case 'Settings':
            // Handle logic for "Settings" navigation menu item
            cy.get( '[data-testid="store_settings"]' )
                .should( 'have.text', 'Settings' )
                .click();
            cy.step( 'Checking URL to include Settings' );
            cy.url().should( 'include', element.toLowerCase() );
            cy.step( 'Checking Settings heading title to be visible' );
            cy.get( '[data-testid="heading-title"]' )
                .should( 'be.visible' )
                .and( 'have.text', 'Settings' );
            cy.get( '[data-testid="heading-description"]' )
                .should( 'be.visible' )
                .and( 'have.text', 'Manage Store Preferences' );
            break;

        case 'User Button':
            // Handle logic for "User Button" navigation menu item
            cy.get( '[data-clerk-component="UserButton"]' )
                .should( 'be.visible' )
                .click();
            cy.step( 'Checking User Button Popover Card to be visible' );
            cy.get( '[class="cl-userButtonPopoverCard cl-popoverBox cl-userButton-popover 🔒️ cl-internal-1grbo8b"]' )
                .should( 'be.visible' );
            break;

        default:
            // Default to "Store Overview" navigation menu item
            cy.step( `${element} is not found, defaulting to Store Overview` );
            cy.get( '[data-testid="store_overview"]' )
                .should( 'have.text', 'Store Overview' )
                .click();
            break;
    }
} );

// Add a custom command for drag-and-drop functionality
Cypress.Commands.add(
    'dragAndDrop',
    ( dragEl: Cypress.Chainable, dropEl: Cypress.Chainable ) =>
    {
        const dataTransfer = new DataTransfer();

        // Trigger the dragstart event on the drag element
        dragEl.trigger( 'dragstart', { dataTransfer } );

        // Trigger the drop event on the drop element
        dropEl.trigger( 'drop', { dataTransfer } );

        // Trigger the dragend event on the drag element
        dragEl.trigger( 'dragend' );
    }
);

// Add a custom command to verify a toast message
Cypress.Commands.add( 'verifyToastMessage', ( message: string ) =>
{
    // Check if the toast message is visible and matches the expected text
    cy.get( 'class="g03958317564"' ).should( 'be.visible' ).and( 'have.text', message );
} );

// Add a custom command to assert that a value is copied to the clipboard
Cypress.Commands.add( 'assertValueCopiedToClipboard', ( value: string ) =>
{
    cy.window().then( ( win ) =>
    {
        win.navigator.clipboard.readText().then( ( text ) =>
        {
            // Log a step to validate the copied value
            cy.step( `Checking if the value copied to clipboard contains: ${value}` );
            // Assert that the clipboard text contains the expected value
            expect( text ).to.include( value );
        } );
    } );
} );


// Add a custom Cypress command to handle the deletion of objects
Cypress.Commands.add( 'deleteObjects', ( object: boolean ) =>
{
    // Log a step to verify the delete dialog title
    cy.step( `Checking delete Dialog Title` );
    // Assert that the delete dialog title is visible and contains the correct text
    cy.get( '[data-testid="modal_DialogTitle"]' )
        .should( 'be.visible' )
        .and( 'have.text', 'Are you sure?' );

    // Log a step to verify the delete dialog description
    cy.step( `Checking delete Dialog Description` );
    // Assert that the delete dialog description is visible and contains the correct text
    cy.get( '[data-testid="modal_DialogDescription"]' )
        .should( 'be.visible' )
        .and( 'have.text', 'This action cannot be undone' );

    // Check the value of the `object` parameter to determine the action
    if ( object === true )
    {
        // Log a step to indicate the confirm delete button will be clicked
        cy.step( `Clicking on Confirm Delete Button` );
        // Click the "Confirm" button if the object parameter is `true`
        cy.get( '[data-testid="modal_DialogChildren"] button' )
            .contains( 'Confirm' )
            .should( 'be.visible' )
            .click();
    } else
    {
        // Log a step to indicate the cancel delete button will be clicked
        cy.step( `Clicking on Cancel Delete Button` );
        // Click the "Cancel" button if the object parameter is `false`
        cy.get( '[data-testid="modal_DialogChildren"] button' )
            .contains( 'Cancel' )
            .should( 'be.visible' )
            .click();
    }
} );




Cypress.Commands.add( 'handlingTable', ( tableRowSelector, tableColumnSelector, searchText ) =>
{
    cy.step( `Searching for row containing: ${searchText}` );

    tableRowSelector.each( ( $row, index ) =>
    {
        cy.wrap( $row )
            .invoke( 'text' )
            .then( ( text ) =>
            {
                if ( text.includes( searchText.trim() ) )
                {
                    cy.step( `Found row for ${searchText} at index ${index}` );

                    // Click the action button matching the correct index
                    tableColumnSelector.eq( index ).should( 'be.visible' ).click();
                }
            } );
    } );
} );
//TODO: for submiting categories and sizes and prdoucts 
Cypress.Commands.add(
    'afterSubmitForm',
    ( storeId: string, entityType: 'categories' | 'sizes', buttonElement: () => Cypress.Chainable<JQuery<HTMLElement>>, entityId?: string, additionalValidation?: ( interception: any ) => void ) =>
    {
        cy.step( `Determining whether to create or update ${entityType}` );

        cy.wrap( null )
            .then( () =>
            {
                return buttonElement().should( 'be.visible' ).invoke( 'text' );
            } )
            .then( ( buttonText ) =>
            {
                const isCreating = buttonText.includes( `Create ${entityType.slice( 0, -1 )}` ); // Removing 's' for singular form
                const method = isCreating ? 'POST' : 'PATCH';
                const endpoint = isCreating ? `/api/${storeId}/${entityType}` : `/api/${storeId}/${entityType}/${entityId}`;
                const alias = isCreating ? `create${entityType}` : `update${entityType}`;

                cy.step( `Intercepting API call for ${isCreating ? 'creating' : 'updating'} ${entityType}` );
                cy.intercept( method, endpoint ).as( alias );

                return cy.wrap( alias );
            } )
            .then( ( alias ) =>
            {
                cy.step( `Clicking on the submit button for ${entityType}` );
                buttonElement().click();

                cy.step( `Waiting for the intercepted API response: ${alias}` );
                cy.wait( `@${alias}`, { timeout: 10000 } ).then( ( interception ) =>
                {
                    expect( interception.response.statusCode ).to.eq( 200 );

                    // If additional validation function is provided, execute it
                    if ( additionalValidation )
                    {
                        additionalValidation( interception );
                    } else
                    {
                        const { storeId: xhrStoreId, id: xhrEntityId } = interception.response.body;
                        cy.step( `Validating API response data for ${entityType}` );
                        expect( xhrStoreId ).to.eq( storeId );
                        expect( xhrEntityId ).to.exist;

                        cy.log( `Saving ${entityType.slice( 0, -1 )}Id to Cypress environment` );
                        Cypress.env( `${entityType.slice( 0, -1 )}Id`, xhrEntityId );

                        cy.step( `Verifying the new ${entityType.slice( 0, -1 )} page URL` );
                        cy.visit( `/${storeId}/${entityType}/${xhrEntityId}` );
                        cy.url().should( 'include', xhrEntityId );
                    }
                } );
            } );
    }
);
