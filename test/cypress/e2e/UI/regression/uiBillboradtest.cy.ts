
import AdminBillboardPage from '@support//test_components/pages/uiAdminBillboardPage';
import { AdminAPIRequestKeys } from '@support//utilities/apiRequestKeys';


const adminBillboardPage = new AdminBillboardPage();
describe( 'Store Billboard', () =>
{
    const storeId = '655eaa67-bf30-4216-98a5-8a331b34d981';

    let token: string = '';
    beforeEach( () =>
    {

        cy.visit( '/' );
        cy.loginToAuth0( "Regular" );

        // TODO: remove this when User add new billboards solution is found
        // cy.getTokens().then( ( clerkToken: string ) =>
        // {
        //     token = clerkToken;
        // } );

    } );
    context( 'Store Billboard Admin workflow UI', () =>
    {
        it.skip( 'User navigate to Billboards', () =>
        {
            cy.log( 'Going to billboards from navigation tab' );
            cy.navigateTabItem( "Billboards" );

        } );
        it( 'User add new billboards', () =>
        {
            //TODO: need to come up with a solution

            cy.visit( `/${storeId}/billboards` );
            adminBillboardPage.verifyBillboardHeaders( storeId );
            adminBillboardPage.clickOnAddBillboardButton( storeId );

            /* ==== Generated with Cypress Studio ==== */
            cy.get( '[data-testid="upload-image"]' ).click();
            cy.get( '[data-testid="billboards-labelInput"]' ).clear();
            cy.get( '[data-testid="billboards-labelInput"]' ).type( 'testDelet6' );
            cy.get( '[data-testid="billboards-submitButton"]' ).click();
            /* ==== End Cypress Studio ==== */
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
