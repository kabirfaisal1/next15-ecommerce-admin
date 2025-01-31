
import AdminBillboardPage from '../../../test_components/pages/uiAdminBillboardPage';



const adminBillboardPage = new AdminBillboardPage();
describe( 'Store Billboard', () =>
{

    beforeEach( () =>
    {
        // Visit the base URL set in your configuration
        cy.visit( '/' );
        // Log in to the application using the Auth0 login method with the "Regular" user
        cy.loginToAuth0( "Regular" );

    } );
    context( 'Store Billboard Admin workflow UI', () =>
    {
        it( 'User navigate to Billboards', () =>
        {
            // navigate to admin billboards page
            cy.log( 'Going to billboards from navigation tab' );
            cy.navigateTabItem( "Billboards" );

        } );
        it.skip( 'User add new billboards', () =>
        {
            //TODO: need to come up with a solution
            const storeId = '8fe72069-48ae-43bc-b8f4-5614b3fb02db';
            cy.visit( `/${storeId}/billboards` );
            adminBillboardPage.verifyBillboardHeaders( storeId );
            adminBillboardPage.clickOnAddBillboardButton( storeId );
            adminBillboardPage.uploadImage( '/test/cypress/fixtures/cypresslogo.png' ); //TODO: this step dont work for cloudinary come with better solution
            adminBillboardPage.enterBillboardName( 'Cypress new Billboard' );
            adminBillboardPage.clickOnSubmitButton();
            adminBillboardPage.verifyBillboardAPIRoute( storeId, 'Cypress new Billboard' );
        } );
        it( 'User add new billboards', () =>
        {
            //TODO: need to come up with a solution
            const storeId = '8fe72069-48ae-43bc-b8f4-5614b3fb02db';
            cy.visit( `/${storeId}/billboards` );
            adminBillboardPage.verifyBillboardHeaders( storeId );
            adminBillboardPage.clickOnAddBillboardButton( storeId );
            adminBillboardPage.uploadImage( '/test/cypress/fixtures/cypresslogo.png' ); //TODO: this step dont work for cloudinary come with better solution
            adminBillboardPage.enterBillboardName( 'Cypress new Billboard' );
            adminBillboardPage.clickOnSubmitButton();
            adminBillboardPage.verifyBillboardAPIRoute( storeId, 'Cypress new Billboard' );
        } );

    } );



} );
