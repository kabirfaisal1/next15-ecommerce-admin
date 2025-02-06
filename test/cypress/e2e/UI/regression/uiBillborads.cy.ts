
import AdminBillboardPage from '../../../support/test_components/pages/uiAdminBillboardPage';
import { AdminAPIRequestKeys } from '../../../support/utilities/apiRequestKeys';



const adminBillboardPage = new AdminBillboardPage();
describe( 'Store Billboard', () =>
{
    let token: string = '';
    beforeEach( () =>
    {
        cy.visit( '/' );
        cy.loginToAuth0( "Regular" );

        // TODO: remove this when User add new billboards solution is found
        cy.getTokens().then( ( clerkToken: string ) =>
        {
            token = clerkToken;
        } );

    } );
    context( 'Store Billboard Admin workflow UI', () =>
    {
        it( 'User navigate to Billboards', () =>
        {
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
        it( 'User update store', () =>
        {
            const storeId = '8fe72069-48ae-43bc-b8f4-5614b3fb02db';

            cy.visit( `/${storeId}/billboards` );
            adminBillboardPage.verifyBillboardHeaders( storeId );

            // Create billboard via API
            adminBillboardPage.createBillboardWithAPI(
                storeId,
                token,
                [ new AdminAPIRequestKeys().billboardName, new AdminAPIRequestKeys().imageUrl ],
                [ 'CypressUIBillboard', "https://res.cloudinary.com/dzsguot60/image/upload/v1736444639/iz0gqlh3fyelyxqzohnk.png" ]
            );
            adminBillboardPage.actionModifyBillboard( 'CypressUIBillboard' );
            adminBillboardPage.enterBillboardName( 'ToBeDeleted' );
            adminBillboardPage.clickOnSubmitButton();

        } );

        it( 'User delete store', () =>
        {
            const storeId = '8fe72069-48ae-43bc-b8f4-5614b3fb02db';


            cy.visit( `/${storeId}/billboards` );
            adminBillboardPage.verifyBillboardHeaders( storeId );
            adminBillboardPage.actionDeleteBillboard( 'ToBeDeleted' );

        } );

    } );



} );
