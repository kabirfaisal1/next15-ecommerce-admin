import StoreForm from '../../../test_components/uiModal-dialog/uiStoreModal';
import AdminSettingPage from '../../../test_components/pages/uiAdminSettingPage';



const storeForm = new StoreForm();
const adminSettingPage = new AdminSettingPage();
describe( 'No Store Admin User', () =>
{
    // let storeID: string;
    const storeIDQuery = `SELECT id FROM public."Stores" WHERE "userId" = 'user_2qOt3xdN0TBsnKSVgczTsusMYZW' ORDER BY "createdAt" ASC;`;

    beforeEach( () =>
    {
        // Visit the base URL set in your configuration
        cy.visit( '/' );
        cy.loginToAuth0( "No Store" );
    } );

    it( 'First Time new user logged in', () =>
    {
        storeForm.verifyModalDialogTitle();
        storeForm.verifyModalDescription();
        storeForm.verifyStoreFormLabel();
    } );

    it( 'First time user click on cancel modal', () =>
    {
        storeForm.clickOnCancelButton();
        storeForm.noNameError( "Store name is required" );
    } );

    it( 'User click on continue without entering store name', () =>
    {
        storeForm.clickOnContinueButton();
        storeForm.noNameError( "Store name is required" );
    } );

    it( 'User enter name less then 3 character', () =>
    {
        storeForm.enterStoreName( 'cy' );
        storeForm.clickOnContinueButton();
        storeForm.noNameError( 'Store name is too short' );
    } );

    it( 'Create Store Successfully', () =>
    {
        // Intercept the store creation API call before triggering it
        cy.intercept( 'POST', '/api/stores' ).as( 'createStore' );

        // Enter the store name and submit the form
        storeForm.enterStoreName( 'cypressUITest' );
        storeForm.clickOnContinueButton();

        // Wait for the intercepted API call to complete
        cy.wait( '@createStore' ).then( ( interception ) =>
        {
            // Assert that the response status code is 201
            expect( interception.response.statusCode ).to.eq( 201 );

            // Extract the storeId from the response body
            const storeId = interception.response.body.id;

            // Assert that the storeId exists in the response
            expect( storeId ).to.exist;

            // Save storeId to Cypress environment
            Cypress.env( 'storeId', storeId );

            // Wait for the page to reload and verify the URL contains the storeId
            cy.url().should( 'include', storeId );
        } );
    } );
    it( 'Update Store name Successfully', () =>
    {
        // Access the storeId from Cypress environment
        const storeId = Cypress.env( 'storeId' );

        // Intercept the store creation API call before triggering it
        cy.intercept( 'PATCH', `/api/stores/${storeId}` ).as( 'updateStore' );

        // Enter the store name and submit the form
        adminSettingPage.goToSetting( storeId );
        adminSettingPage.updateStoreName( 'Updated Cypress Store' );
        adminSettingPage.clickOnSaveButton();

        // Wait for the intercepted API call to complete
        cy.wait( '@updateStore' ).then( ( interception ) =>
        {
            // Assert that the response status code is 201
            expect( interception.response.statusCode ).to.eq( 202 );

            // Extract the storeId from the response body
            const updateCount = interception.response.body.count;

            // Assert that the storeId exists in the response
            expect( updateCount ).to.exist;

            // Wait for the page to reload and verify the URL contains the storeId
            cy.url().should( 'include', storeId );
        } );

        // cy.verifyToastMessage( 'Store updated successfully' ); //TODO: Implement this
    } );
    it( 'Delete Store name Successfully', () =>
    {
        // Access the storeId from Cypress environment
        const storeId = Cypress.env( 'storeId' );

        // Intercept the store creation API call before triggering it
        cy.intercept( 'DELETE', `/api/stores/${storeId}` ).as( 'deleteStore' );

        // Enter the store name and submit the form
        adminSettingPage.goToSetting( storeId );
        adminSettingPage.deleteStore( true );

        // Wait for the intercepted API call to complete
        cy.wait( '@deleteStore' ).then( ( interception ) =>
        {
            // Assert that the response status code is 201
            expect( interception.response.statusCode ).to.eq( 200 );

            // Extract the storeId from the response body
            const deleteStoreCount = interception.response.body.count;

            // Assert that the storeId exists in the response
            expect( deleteStoreCount ).to.exist;

            // Wait for the page to reload and verify the URL contains the storeId
            cy.url().should( 'not.include', storeId );
        } );

        // cy.verifyToastMessage( 'Store updated successfully' ); //TODO: Implement this
    } );
    it( 'User can not access other admin store setting', () =>
    {
        // Fetch the store ID and use it within the chain
        cy.task( 'queryDatabase', storeIDQuery ).then( ( rows ) =>
        {
            if ( rows.length > 0 )
            {
                const storeID = rows[ 0 ].id; // Extract the store ID from the query result
                cy.step( `Resolved and using storeID: ${storeID}` ); // Log the resolved storeID

                // Use the storeID for navigation and further tests
                cy.visit( `/${storeID}/settings` );
                cy.get( 'h1' ).contains( '404' ); //TODO: Verify that the page contains after creating error page
            } else
            {
                throw new Error( 'No rows returned from query' );
            }
        } );

    } );
    it( 'User can not access other admin store billboards', () =>
    {
        // Fetch the store ID and use it within the chain
        cy.task( 'queryDatabase', storeIDQuery ).then( ( rows ) =>
        {
            if ( rows.length > 0 )
            {
                const storeID = rows[ 0 ].id; // Extract the store ID from the query result
                cy.step( `Resolved and using storeID: ${storeID}` ); // Log the resolved storeID

                // Use the storeID for navigation and further tests
                cy.visit( `/${storeID}/billboards` );
                cy.get( 'h1' ).contains( '404' ); //TODO Verify that the page contains after creating error page
            } else
            {
                throw new Error( 'No rows returned from query' );
            }
        } );

    } );
} );
