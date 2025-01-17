import StoreForm from '../../../components/modal-dialog/create_storeModal';



const storeForm = new StoreForm();
describe( 'No Store Admin User', () =>
{
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
    it.only( 'Create Store Successfully', () =>
    {
        // Access the storeId from Cypress environment
        const storeId = Cypress.env( 'storeId' );

        // Intercept the store creation API call before triggering it
        cy.intercept( 'PATCH', `/api/stores/${storeId}` ).as( 'updateStore' );

        // Enter the store name and submit the form
        storeForm.enterStoreName( 'cypressUITest' );
        storeForm.clickOnContinueButton();

        // Wait for the intercepted API call to complete
        cy.wait( '@updateStore' ).then( ( interception ) =>
        {
            // Assert that the response status code is 201
            expect( interception.response.statusCode ).to.eq( 201 );

            // Extract the storeId from the response body
            const updateCount = interception.response.body.count;

            // Assert that the storeId exists in the response
            expect( updateCount ).to.exist;

            // Wait for the page to reload and verify the URL contains the storeId
            cy.url().should( 'include', storeId );
        } );
    } );
} );
