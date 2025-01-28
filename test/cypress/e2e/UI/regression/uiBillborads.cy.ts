
import AdminBillboardPage from '../../../test_components/pages/uiAdminBillboardPage';



const adminBillboardPage = new AdminBillboardPage();
describe( 'No Store Admin User', () =>
{

    beforeEach( () =>
    {
        // Visit the base URL set in your configuration
        cy.visit( '/' );
        // Log in to the application using the Auth0 login method with the "Regular" user
        cy.loginToAuth0( "Regular" );

    } );
    it( 'User navigate to Billboards', () =>
    {
        // navigate to admin billboards page
        cy.step( 'Going to billboards from navigation tab' );
        cy.navigateTabItem( "Billboards" );

    } );
    it.only( 'User add new billboards', () =>
    {
        const storeId = '8fe72069-48ae-43bc-b8f4-5614b3fb02db';
        cy.visit( `/${storeId}/billboards` );
        adminBillboardPage.verifyBillboardHeaders( storeId );
        adminBillboardPage.clickOnAddBillboardButton( storeId );
        adminBillboardPage.uploadImage( 'images/1.png' );
        adminBillboardPage.enterBillboardName( 'Cypress new Billboard' );
        adminBillboardPage.clickOnSubmitButton();
        adminBillboardPage.verifyBillboardAPIRoute( storeId, 'Cypress new Billboard' );
    } );



} );
