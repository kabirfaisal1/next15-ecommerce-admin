import StoreForm from '@support/test_components/uiModal-dialog/uiStoreModal';
import AdminSettingPage from '@support/test_components/pages/uiAdminSettingPage';

const storeForm = new StoreForm();
const adminSettingPage = new AdminSettingPage();

describe( 'No Store Admin User', () =>
{

    beforeEach( () =>
    {
        cy.step( 'Visiting the base URL and logging in as a No Store user' );
        cy.visit( '/' );
        cy.loginToAuth0( 'No Store' );
    } );

    context( 'New Admin User Store UI Workflow', () =>
    {

        it( 'First-time new user logged in', () =>
        {
            storeForm.verifyModalDialogTitle();
            storeForm.verifyModalDescription();
            storeForm.verifyStoreFormLabel();
        } );


        it( 'First-time user clicks cancel on modal', () =>
        {
            storeForm.clickOnCancelButton();
            storeForm.noNameError( 'Store name is required' );
        } );


        it( 'User clicks continue without entering store name', () =>
        {
            storeForm.clickOnContinueButton();
            storeForm.noNameError( 'Store name is required' );
        } );


        it( 'User enters a store name with less than 3 characters', () =>
        {
            storeForm.enterStoreName( 'cy' );
            storeForm.clickOnContinueButton();
            storeForm.noNameError( 'Store name is too short' );
        } );


        it( 'Create Store Successfully', () =>
        {
            cy.step( 'Intercepting store creation API request' );
            cy.intercept( 'POST', '/api/stores' ).as( 'createStore' );

            storeForm.enterStoreName( 'cypressUITest' );
            storeForm.clickOnContinueButton();

            cy.wait( '@createStore' ).then( ( interception ) =>
            {
                expect( interception.response, 'API response should exist' ).to.exist;
                expect( interception.response.statusCode, 'Status code should be 201' ).to.eq( 201 );

                const storeId = interception.response.body?.id;
                expect( storeId, 'Store ID should exist in response' ).to.exist;

                Cypress.env( 'storeId', storeId );
                cy.url().should( 'include', storeId );
            } );
        } );


        it( 'Update Store Name Successfully', () =>
        {
            const storeId = Cypress.env( 'storeId' );

            cy.step( 'Intercepting store update API request' );
            cy.intercept( 'PATCH', `/api/stores/${storeId}` ).as( 'updateStore' );

            adminSettingPage.goToSetting( storeId );
            adminSettingPage.updateStoreName( 'Updated Cypress Store' );
            adminSettingPage.clickOnSaveButton();

            cy.wait( '@updateStore' ).then( ( interception ) =>
            {
                expect( interception.response, 'API response should exist' ).to.exist;
                expect( interception.response.statusCode, 'Status code should be 202' ).to.eq( 202 );

                const updateCount = interception.response.body?.count;
                expect( updateCount, 'Update count should exist in response' ).to.exist;

                cy.url().should( 'include', storeId );
            } );

            // cy.verifyToastMessage('Store updated successfully'); // TODO: Implement this
        } );


        it( 'Delete Store Successfully', () =>
        {
            const storeId = Cypress.env( 'storeId' );

            cy.step( 'Intercepting store deletion API request' );
            cy.intercept( 'DELETE', `/api/stores/${storeId}` ).as( 'deleteStore' );

            adminSettingPage.goToSetting( storeId );
            adminSettingPage.deleteStore( true );

            cy.wait( '@deleteStore' ).then( ( interception ) =>
            {
                cy.step( `Intercepted Status Code: ${interception.response?.statusCode}` );
                expect( interception.response, 'API response should exist' ).to.exist;
                expect( interception.response.statusCode, 'Status code should be 200' ).to.eq( 200 );

                cy.step( `Intercepted Response Body: ${JSON.stringify( interception.response.body )}` );
                const responseBody = interception.response.body;

                expect( responseBody, 'Response body should exist for 200 status' ).to.exist;
                expect( responseBody.message, 'Response should contain "message"' ).to.equal( 'Deleted successfully' );
            } );

            cy.url().should( 'not.include', storeId );

            // cy.verifyToastMessage('Store deleted successfully'); // TODO: Implement this
        } );

    } );
} );
