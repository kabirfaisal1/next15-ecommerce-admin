import StoreForm from '@support/test_components/uiModal-dialog/uiStoreModal';
import AdminSettingPage from '@support/test_components/pages/uiAdminSettingPage';



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
    context( 'New Admin User Store UI Workflow', () =>
    {
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

            // Intercept the store deletion API call before triggering it
            cy.intercept( 'DELETE', `/api/stores/${storeId}` ).as( 'deleteStore' );

            // Navigate to settings and delete the store
            adminSettingPage.goToSetting( storeId );
            adminSettingPage.deleteStore( true );

            // Wait for the intercepted API call to complete
            cy.wait( '@deleteStore' ).then( ( interception ) =>
            {
                cy.step( `Intercepted Status Code: ${interception.response?.statusCode}` );

                // Ensure the response exists
                expect( interception.response, 'API response should exist' ).to.exist;
                expect( interception.response.statusCode, 'Status code should be 200' ).to.equal( 200 );


                cy.step( `Intercepted Response Body: ${JSON.stringify( interception.response.body )}` );
                const responseBody = JSON.parse( interception.response.body ) ;


                expect( responseBody, 'Response body should exist for 200 status' ).to.exist;
                expect( responseBody.message, 'Response should contain "message"' ).to.equal( 'Deleted successfully' );
            } );

            // Verify that the storeId is removed from the URL
            cy.url().should( 'not.include', storeId );

            // cy.verifyToastMessage('Store updated successfully'); // TODO: Implement this
        } );

    } );
} );
