import StoreForm from '../../../test_components/uiModal-dialog/uiStoreModal';
import AdminSettingPage from '../../../test_components/pages/uiAdminSettingPage';



const storeForm = new StoreForm();
const adminSettingPage = new AdminSettingPage();
describe( 'No Store Admin User', () =>
{

    beforeEach( () =>
    {
        // Visit the base URL set in your configuration
        cy.visit( '/' );
        // Log in to the application using the Auth0 login method with the "Regular" user
        cy.loginToAuth0( "Regular" );

        cy.step( 'Going to billboards' );
        cy.navigateTabItem( "Billboards" );
    } );
    it( 'User with store', () =>
    {
        // let billboardsQuery: string;
        const billboardsQuery = `SELECT "label" FROM public."Billboards" where "storeId" = '8fe72069-48ae-43bc-b8f4-5614b3fb02db' ORDER by "createdAt" DESC;`;
        // Fetch the store ID and use it within the chain
        cy.task( 'queryDatabase', billboardsQuery ).then( ( rows ) =>
        {
            if ( rows.length > 0 )
            {
                const storeID = rows[ 0 ].id; // Extract the store ID from the query result
                cy.step( `Checking if user can see billboard: ${billboardsQuery}` ); // Log the resolved storeID

                // Use the storeID for navigation and further tests
                cy.visit( '/8fe72069-48ae-43bc-b8f4-5614b3fb02db/billboards' );
                cy.get( 'h1' ).contains( '404' ); //TODO Verify that the page contains after creating error page
            } else
            {
                throw new Error( 'No rows returned from query' );
            }
        } );

    } );



} );
