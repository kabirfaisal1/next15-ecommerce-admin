
import AdminBillboardPage from '@support//test_components/pages/uiAdminBillboardPage';
import { AdminAPIRequestKeys } from '@support//utilities/apiRequestKeys';


const adminBillboardPage = new AdminBillboardPage();
describe( 'Store Billboard', () =>
{
    const storeId = '00ea910b-ecf0-4d1e-bcb6-5cb72313bb46';

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


            cy.visit( `/${storeId}/billboards` );
            adminBillboardPage.verifyBillboardHeaders( storeId );

            // Create billboard via API
            adminBillboardPage.createBillboardWithAPI(
                storeId,
                token,
                [ new AdminAPIRequestKeys().billboardName, new AdminAPIRequestKeys().imageUrl ],
                [ 'CypressUIBillboard', "https://res.cloudinary.com/dzsguot60/image/upload/v1738955812/nawg5xwt83sdkhdqjwus.png" ]
            );
            adminBillboardPage.actionModifyBillboard( 'CypressUIBillboard' );
            adminBillboardPage.enterBillboardName( 'ToBeDeleted' );
            adminBillboardPage.clickOnSubmitButton();

        } );

        it( 'User delete store', () =>
        {

            cy.visit( `/${storeId}/billboards` );
            adminBillboardPage.verifyBillboardHeaders( storeId );
            adminBillboardPage.actionDeleteBillboard( 'ToBeDeleted' );

        } );

    } );



} );
