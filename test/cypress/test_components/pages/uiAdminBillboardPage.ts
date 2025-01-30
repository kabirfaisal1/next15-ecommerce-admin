
class AdminBillboardPage
{
    elements: { [ key: string ]: () => Cypress.Chainable; } = {
        pageHeaders: () => cy.get( '[data-testid="heading-title"]' ),
        pageDescription: () => cy.get( '[data-testid="heading-description"]' ),
        addNewButton: () => cy.get( '[data-testid="add-billboardClient-button"]' ),

        // Create New Billboard Form
        billboard_uploadImageLabel: () => cy.get( '[data-testid="billboards-backgroundImage-label"]' ),
        billboard_uploadImageButton: () => cy.get( '[data-testid="upload-image"]' ),
        billboard_formInputLabel: () => cy.get( '[data-testid="billboards-labelSubtitle"]' ),
        billboard_formLabelInputField: () => cy.get( '[data-testid="billboards-labelInput"]' ),
        billboard_submitButtonButton: () => cy.get( '[data-testid="billboards-submitButton"]' ),
        cloudinary_uploadWidget: () => cy.get( '[data-test="upload_button_holder"]' ),

        cloudinary_uploadDone: () => cy.get( '[data-test="queue-done"]' ),

        //  TODO: add other page elements here
        settingAPI_Alert: () => cy.get( '[data-testid="api-alert_NEXT_PUBLIC_API_URL"]' ),
        settingAPI_AlertURI: () => cy.get( '[data-testid="api-alert_uri"]' ),
        settingAPI_AlertClipboard: () => cy.get( '[data-testid="api-alert_copyButton"]' ),
        form_ErrorMessage: () => cy.get( '[data-testid="FormMessage"]' ),
    };

    verifyBillboardHeaders ( storeId: string )
    {
        cy.step( 'Verifying Billboard Headers' );
        // let billboardsQuery: string;
        const billboardsQuery = `SELECT "label" FROM public."Billboards" where "storeId" = '${storeId}' ORDER by "createdAt" DESC;`;
        cy.task( 'queryDatabase', billboardsQuery ).then( ( rows ) =>
        {
            if ( rows.length > 0 )
            {
                const numberOfBillboards = rows.length; // Extract the store ID from the query result
                cy.step( `Checking billboard page headers for storeId:: ${storeId}` ); // Log the resolved storeID
                this.elements.pageHeaders().should( 'be.visible' ).should( 'include.text', `Billboards (${numberOfBillboards})` )
                    .and( 'include.text', 'API Routes' );
                cy.step( `Checking billboard page description for storeId: ${storeId}` ); // Log the resolved storeID
                this.elements.pageDescription().should( 'be.visible' ).should( 'include.text', 'Manage billboards for your store' ).and( 'include.text', 'API routes for managing billboards' );


            } else
            {
                throw new Error( 'No rows returned from query' );
            }
        } );

    }

    clickOnAddBillboardButton ( storeId: string )
    {
        cy.step( 'Clicking on Add Billboard button' );
        this.elements.addNewButton().should( 'be.visible' ).and( 'include.text', 'Add New' ).click();
        cy.step( 'Verify navigation was successful' );
        cy.url().should( 'include', `${storeId}/billboards/new` );
        cy.step( 'Verify Form Header' );
        this.elements.pageHeaders().should( 'be.visible' ).should( 'include.text', 'Create Billboard' );
        cy.step( 'Verify Form Header Description' );
        this.elements.pageDescription().should( 'be.visible' ).should( 'include.text', 'Add a new billboard' );
    }

    uploadImage ( imgUrl: string )
    {
        cy.step( 'Clicking on upload image button' );
        cy.get( '[data-testid="billboards-backgroundImage-label"]' ).should( 'be.visible' );
        cy.step( 'Click Uploading image' );
        this.elements.billboard_uploadImageButton().should( 'be.visible' ).click();

        cy.step( 'Verifying cloudinary upload widget' );
        const getIframeWindow = () =>
        {
            return cy
                .get( 'iframe[title="Upload Widget"]' )
                .its( '0.contentWindow' ).should( 'exist' );
        };
        getIframeWindow().then( ( win ) =>
        {
            cy.spy( win, 'fetch' ).as( 'fetch' );
        } );

        cy.getIframeBody().find( '[class="cloudinary_fileupload"]' ).should( 'be.visible' ).click();
        // // getIframeBody().find( 'input[class="cloudinary_fileupload""]' ).selectFile( imgUrl );

    }


    enterBillboardName ( label: string )
    {
        cy.step( 'Checking Billboard name input label' );
        this.elements.billboard_formInputLabel().should( 'be.visible' ).should( 'include.text', 'Label' );

        cy.step( `Entering Billboard name : ${label}` );
        this.elements.billboard_formLabelInputField().should( 'be.visible' ).type( label ).should( 'have.value', label );
    }

    clickOnSubmitButton ()
    {
        cy.step( 'Clicking on submit button' );

        cy.url().then( ( currentUrl ) =>
        {
            this.elements
                .billboard_submitButtonButton()
                .should( 'be.visible' )
                // .and( ( $el ) =>
                // {
                //     const text = $el.text();

                //     // Dynamically check the button text based on the URL
                //     if ( currentUrl.indexOf( 'new' ) !== -1 )
                //     {
                //         cy.step( 'Checking button title with current URL contain /new' );
                //         expect( text ).to.contain( 'Create billboard' ); // Use `.contain` for Chai assertions
                //     } else
                //     {
                //         cy.step( 'Checking button title with current URL does not contain new' );
                //         expect( text ).to.contain( 'Save changes' ); // Use `.contain` for Chai assertions
                //     }
                // } )
                .click();
        } );
    }

    verifyBillboardAPIRoute ( storeId: string, billboardLabel: string )
    {
        cy.url().then( ( currentUrl ) =>
        {
            cy.step( 'Checking API call' );

            // Determine the API action based on the URL or environment variables
            const action = currentUrl.includes( 'new' )
                ? 'create'
                : Cypress.env( 'newBillBoardID' )
                    ? currentUrl.includes( Cypress.env( 'newBillBoardID' ) )
                        ? 'update'
                        : 'delete'
                    : null;

            const billboardId = Cypress.env( 'newBillBoardID' );

            // Helper function to handle update and delete cases
            const handleUpdateOrDelete = ( method: 'PATCH' | 'DELETE', alias: string ) =>
            {
                cy.intercept( method, `/api/stores/${billboardId}` ).as( alias );
                cy.wait( `@${alias}` ).then( ( interception ) =>
                {
                    const { response } = interception;
                    expect( response.body.storeId ).to.equal( storeId );
                    expect( response.body.label ).to.equal( billboardLabel );
                    expect( response.body.id ).to.equal( billboardId );
                } );
            };

            // Handle each action dynamically
            switch ( action )
            {
                case 'create': {
                    // Intercept the store creation API call
                    cy.intercept( 'POST', '/api/stores' ).as( 'createBillboard' );
                    cy.wait( '@createBillboard' ).then( ( interception ) =>
                    {
                        const { response } = interception;
                        expect( response.body.storeId ).to.equal( storeId );
                        expect( response.body.label ).to.equal( billboardLabel );

                        // Extract and save the billboardId
                        const newBillboardId = response.body.id;
                        expect( newBillboardId ).to.exist;
                        Cypress.env( 'newBillBoardID', newBillboardId );
                    } );
                    break;
                }

                case 'update': {
                    handleUpdateOrDelete( 'PATCH', 'updateBillboard' );
                    break;
                }

                case 'delete': {
                    handleUpdateOrDelete( 'DELETE', 'deleteBillboard' );
                    break;
                }

                default: {
                    throw new Error( 'Unable to determine API action based on the current URL or environment state.' );
                }
            }
        } );
    }

}

export default AdminBillboardPage;

