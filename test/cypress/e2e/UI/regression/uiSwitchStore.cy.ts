import StoreSwitcher from '@support/test_components/uiModal-dialog/uiStoreSwitcher';

const storeSwitcher = new StoreSwitcher();

describe( 'Store Switcher Functionality', () =>
{

    beforeEach( () =>
    {
        cy.step( 'Visiting the base URL and logging in' );
        cy.visit( '/' );
        cy.loginToAuth0( 'Regular' );
    } );

    context( 'Switch Store UI Workflow', () =>
    {

        it( 'Switch Store', () =>
        {
            cy.step( 'Opening store switcher dropdown' );
            storeSwitcher.clickOnStoreDropDown();
            cy.step( 'Selecting store: Cypress UI' );
            storeSwitcher.selectStore( 'Cypress UI' );
        } );

        it( 'Search and Switch Store', () =>
        {
            cy.step( 'Opening store switcher dropdown' );
            storeSwitcher.clickOnStoreDropDown();
            cy.step( 'Searching for store: Cypress UI' );
            storeSwitcher.searchForStore( 'Cypress UI' );
            cy.step( 'Selecting store: Cypress UI' );
            storeSwitcher.selectStore( 'Cypress UI' );
        } );

        it( 'Search for invalid store', () =>
        {
            cy.step( 'Opening store switcher dropdown' );
            storeSwitcher.clickOnStoreDropDown();
            cy.step( 'Searching for non-existent store: Cypress Test UI' );
            storeSwitcher.searchForStore( 'Cypress Test UI' );
            cy.step( 'Verifying error message: No store found.' );
            storeSwitcher.verifySearchStoreError( 'No store found.' );
        } );

        it( 'Navigate to Billboard after switch', () =>
        {
            cy.step( 'Switching store and navigating to Billboards' );
            storeSwitcher.clickOnStoreDropDown();
            storeSwitcher.selectStore( 'Cypress UI' );
            cy.navigateTabItem( 'Billboards' );
        } );

        it( 'Navigate to Settings after switch', () =>
        {
            cy.step( 'Switching store and navigating to Settings' );
            storeSwitcher.clickOnStoreDropDown();
            storeSwitcher.selectStore( 'Cypress UI' );
            cy.navigateTabItem( 'Settings' );
        } );

    } );
    afterEach( () =>
    {
        cy.step( 'Cleaning up test data' );
        cy.clearCookies();
        cy.clearLocalStorage();
    }
    );
} );
