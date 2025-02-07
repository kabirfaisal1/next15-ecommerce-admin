import { createRequestBody } from '../../utilities/globalHelpers';
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
        billboardDataTable: () => cy.get( '[data-testid="data-table"]' ),
        billboardDataTableRow: () => cy.get( '[data-testid="data-tableBodyRows"]' ),
        billBoardActionColumn: () => cy.get( '[data-testid="cellAction-dropdownMenuTrigger"]' ),
        billBoardActionItem: () => cy.get( '[data-testid="cellAction-dropdownMenuContent"]' ),
        settingAPI_Alert: () => cy.get( '[data-testid="api-alert_NEXT_PUBLIC_API_URL"]' ),
        settingAPI_AlertURI: () => cy.get( '[data-testid="api-alert_uri"]' ),
        settingAPI_AlertClipboard: () => cy.get( '[data-testid="api-alert_copyButton"]' ),
        form_ErrorMessage: () => cy.get( '[data-testid="FormMessage"]' ),

        //* cloudinary elements
        cloudinary_uploadWidget: () => cy.get( '[data-test="upload_button_holder"]' ),
        cloudinary_uploadDone: () => cy.get( '[data-test="queue-done"]' ),
        getIframeDocument: () =>
        {
            cy.log( 'Getting getIframeDocument' );
            return cy.get( 'iframe[data-test="uw-iframe"]', { timeout: 20000 } )
                .should( 'be.visible' )
                .then( ( $iframe ) =>
                {
                    return cy.wrap( $iframe[ 0 ].contentDocument ).should( 'exist' );
                } );
        },
        getIframeBody: () =>
        {
            cy.log( 'Getting getIframeDocument' );
            return cy
                .get( 'iframe[data-test="uw-iframe"]' )
                .its( '0.contentDocument' ).should( 'exist' );
        },

    };
    // TODO: Delete this after figuring out upload in cloudinary from UI
    createBillboardWithAPI ( storeId: string, token: string, requestKeys: string[], requestValues: string[] )
    {
        // Generate request body
        const requestBody = createRequestBody( requestKeys, requestValues );

        cy.request( {
            method: "POST",
            url: `/api/${storeId}/billboards`,
            body: requestBody,
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            failOnStatusCode: false // Allow handling errors manually
        } ).then( ( response ) =>
        {
            // Validate response status
            cy.step( `Validate response status: 200` );
            expect( response.status ).to.equal( 200 );

            // Extract response data
            const data = response.body;

            if ( data && data.id )
            {
                expect( data.id ).to.exist;
                cy.step( `Created Billboard ID: ${data.id} and saved in env file as CypressUIBillboard` );

                // Optionally store in Cypress alias for use in the same test
                cy.wrap( data.id ).as( 'createdBillboardId' );
                cy.reload();
                this.elements.billboardDataTableRow().wait( 500 ).should( 'include.text', data.label );
            } else
            {
                cy.step( 'No valid data returned in response.' );
            }
        } );
    }
    verifyBillboardHeaders ( storeId: string )
    {
        cy.log( 'Verifying Billboard Headers' );
        // let billboardsQuery: string;
        const billboardsQuery = `SELECT "label" FROM public."Billboards" where "storeId" = '${storeId}' ORDER by "createdAt" DESC;`;
        cy.task( 'queryDatabase', billboardsQuery ).then( ( rows ) =>
        {
            if ( rows.length > 0 )
            {
                const numberOfBillboards = rows.length; // Extract the store ID from the query result
                cy.log( `Checking billboard page headers for storeId:: ${storeId}` ); // Log the resolved storeID
                this.elements.pageHeaders().should( 'be.visible' ).should( 'include.text', `Billboards (${numberOfBillboards})` )
                    .and( 'include.text', 'API Routes' );
                cy.log( `Checking billboard page description for storeId: ${storeId}` ); // Log the resolved storeID
                this.elements.pageDescription().should( 'be.visible' ).should( 'include.text', 'Manage billboards for your store' ).and( 'include.text', 'API routes for managing billboards' );


            } else
            {
                throw new Error( 'No rows returned from query' );
            }
        } );

    }

    clickOnAddBillboardButton ( storeId: string )
    {
        cy.log( 'Clicking on Add Billboard button' );
        this.elements.addNewButton().should( 'be.visible' ).and( 'include.text', 'Add New' ).click();
        cy.log( 'Verify navigation was successful' );
        cy.url().should( 'include', `${storeId}/billboards/new` );
        cy.log( 'Verify Form Header' );
        this.elements.pageHeaders().should( 'be.visible' ).should( 'include.text', 'Create Billboard' );
        cy.log( 'Verify Form Header Description' );
        this.elements.pageDescription().should( 'be.visible' ).should( 'include.text', 'Add a new billboard' );
    }

    // TODO: having issue uploading from UI in cloudinary iFrame
    uploadImage ( imgPath: string )
    {
        cy.step( 'Clicking on upload image button' );
        this.elements.billboard_uploadImageButton().should( 'be.visible' ).click();

        // Ensure the iframe is loaded before switching origins
        cy.get( 'iframe[data-test="uw-iframe"]', { timeout: 30000 } )
            .should( 'be.visible' )
            .then( ( $iframe ) =>
            {
                const iframeSrc = $iframe.attr( 'src' );
                cy.log( `Found iframe with src: ${iframeSrc}` );
            } );

        // Switch to Cloudinary Upload Widget's correct origin
        cy.origin( 'https://upload-widget.cloudinary.com', { args: [ imgPath ] }, ( imgPath ) =>
        {
            cy.log( 'Switched to Cloudinary Upload Widget' );

            // Wait for the upload button inside the iframe
            cy.get( '.upload_button_holder', { timeout: 15000 } )
                .should( 'be.visible' )
                .click();

            // Upload file
            cy.get( 'input[type="file"]' ).selectFile( imgPath, { force: true } );

            cy.log( 'File uploaded' );
        } );

        cy.step( 'Image upload completed' );
    }


    enterBillboardName ( label: string )
    {
        cy.log( 'Checking Billboard name input label' );
        this.elements.billboard_formInputLabel().should( 'be.visible' ).should( 'include.text', 'Label' );

        cy.log( `Entering Billboard name : ${label}` );
        this.elements.billboard_formLabelInputField().should( 'be.visible' ).clear().type( label ).should( 'have.value', label );
    }

    clickOnSubmitButton ()
    {
        cy.log( 'Clicking on submit button' );

        cy.url().then( ( currentUrl ) =>
        {
            this.elements
                .billboard_submitButtonButton()
                .should( 'be.visible' )
                .click();
        } );
    }

    actionModifyBillboard ( billboardLabel: string )
    {
        cy.step( `Going to Modify ${billboardLabel}` );

        cy.handlingTable(
            this.elements.billboardDataTableRow(),
            this.elements.billBoardActionColumn(), // Passing as Cypress Chainable
            billboardLabel
        );

        cy.step( 'Click on modify from drop-down list' );

        // // Find the correct action item in the dropdown and click it
        this.elements.billBoardActionItem().should( 'be.visible' )
            .contains( 'Modify' )
            .click( { force: true } );

        cy.step( `Checking correct Billboard name : ${billboardLabel} was selected` );

        this.elements.billboard_formLabelInputField()
            .should( 'be.visible' )
            .and( 'have.value', billboardLabel );
    }

    actionCopyBillboard ( billboardLabel: string )
    {

        //TODO: When we have time
    }
    actionDeleteBillboard ( billboardLabel: string )
    {

        cy.step( `Going to Modify ${billboardLabel}` );

        cy.handlingTable(
            this.elements.billboardDataTableRow(),
            this.elements.billBoardActionColumn(), // Passing as Cypress Chainable
            billboardLabel
        );

        cy.step( 'Click on modify from drop-down list' );

        // // Find the correct action item in the dropdown and click it
        this.elements.billBoardActionItem().should( 'be.visible' )
            .contains( 'Delete' )
            .click( { force: true } );

        cy.deleteObjects( true );
    }
    verifyBillboardAPIRoute ( storeId: string, billboardLabel: string )
    {
        //TODO: When we have time
    }





}

export default AdminBillboardPage;

