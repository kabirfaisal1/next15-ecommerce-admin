
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

    } );
    context( 'Store Billboard Admin workflow UI', () =>
    {
        it( 'User navigate to Billboards', () =>
        {
            cy.log( 'Going to billboards from navigation tab' );
            cy.navigateTabItem( "Categories" );

        } );

    } );



} );
