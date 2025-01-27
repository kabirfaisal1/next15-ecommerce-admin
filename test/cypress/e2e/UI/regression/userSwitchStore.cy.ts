import StoreSwitcher from '../../../test_components/uiModal-dialog/uiStoreSwitcher';


const storeSwitcher = new StoreSwitcher();

describe( 'Store Switcher', () =>
{

    beforeEach( () =>
    {
        // Visit the base URL set in your configuration
        cy.visit( '/' );
        // Log in to the application using the Auth0 login method with the "Regular" user
        cy.loginToAuth0( "Regular" );
    } );
    it( 'Switch Store', () =>
    {
        storeSwitcher.clickOnStoreDropDown();
        storeSwitcher.selectStore( 'Cypress UI' );
    } );
    it( 'Search and Switch Store', () =>
    {
        storeSwitcher.clickOnStoreDropDown();
        storeSwitcher.searchForStore( 'Cypress UI' );
        storeSwitcher.selectStore( 'Cypress UI' );
    } );
    it( 'Search for invalid store', () =>
    {
        storeSwitcher.clickOnStoreDropDown();
        storeSwitcher.searchForStore( 'Cypress Test UI' );
        storeSwitcher.verifySearchStoreError( 'No store found.' );
    } );
    it( 'Navigate to Billboard after switch', () =>
    {
        storeSwitcher.clickOnStoreDropDown();
        storeSwitcher.selectStore( 'Cypress UI' );
        cy.navigation_menu( "Billboards" );
    } );
    it( 'Navigate to Setting after switch', () =>
    {
        storeSwitcher.clickOnStoreDropDown();
        storeSwitcher.selectStore( 'Cypress UI' );
        cy.navigation_menu( "Settings" );
    } );


} );
