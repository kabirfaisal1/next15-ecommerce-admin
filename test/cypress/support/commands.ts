/// <reference types="cypress" />

export { }; // Ensures this file is treated as a module

/* eslint-disable @typescript-eslint/no-namespace */
declare global
{
    namespace Cypress
    {
        interface Chainable
        {
            /**
             * Custom command to log in to Auth0.
             * @param username - The username for Auth0.
             * @param password - The password for Auth0.
             */
            loginToAuth0 ( username: string, password: string ): Chainable<JQuery<HTMLElement>>;

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
            dragAndDrop2 (
                dragEl: Chainable<JQuery<HTMLElement>>,
                dropEl: Chainable<JQuery<HTMLElement>>
            ): Chainable<JQuery<HTMLElement>>;
        }
    }
}
/* eslint-enable @typescript-eslint/no-namespace */

// Implementation of custom commands

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


Cypress.Commands.add(
    'dragAndDrop2',
    ( dragEl, dropEl ) =>
    {
        cy.log( 'cy.dragAndDrop is triggered' );
        const dataTransfer = new DataTransfer();

        dragEl.trigger( 'dragstart', { dataTransfer } );
        dropEl.trigger( 'drop', { dataTransfer } );
        dragEl.trigger( 'dragend' );
    }
);

Cypress.Commands.add( 'loginToAuth0', ( username: string, password: string ) =>
{
    cy.step( `Logging into Auth0 with username: ${username}` );
    cy.log( `Logging into Auth0 with password: ${password}` );
    // Implement the Auth0 login logic here
} );
