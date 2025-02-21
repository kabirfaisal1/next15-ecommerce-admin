import { createRequestBody } from '@support/utilities/globalHelpers';

class AdminBillboardPage
{
    /**
     * Page Elements: Organized as a dictionary for easier access.
     */
    elements: { [ key: string ]: () => Cypress.Chainable; } = {
        // Page Headers & Description
        pageHeaders: () => cy.get( '[data-testid="heading-title"]' ),
        pageDescription: () => cy.get( '[data-testid="heading-description"]' ),

        // Buttons & Actions
        addNewButton: () => cy.get( '[data-testid="add-billboardClient-button"]' ),
        billboard_submitButton: () => cy.get( '[data-testid="billboards-submitButton"]' ),

        // Billboard Form Fields
        billboard_uploadImageLabel: () => cy.get( '[data-testid="billboards-backgroundImage-label"]' ),
        billboard_uploadImageButton: () => cy.get( '[data-testid="upload-image"]' ),
        billboard_formInputLabel: () => cy.get( '[data-testid="billboards-labelSubtitle"]' ),
        billboard_formLabelInputField: () => cy.get( '[data-testid="billboards-labelInput"]' ),

        // Data Table
        billboardDataTable: () => cy.get( '[data-testid="data-table"]' ),
        billboardDataTableRow: () => cy.get( '[data-testid="data-tableBodyRows"]' ),
        billboardActionColumn: () => cy.get( '[data-testid="cellAction-dropdownMenuTrigger"]' ),
        billboardActionItem: () => cy.get( '[data-testid="cellAction-dropdownMenuContent"]' ),

        // API Settings
        settingAPI_Alert: () => cy.get( '[data-testid="api-alert_NEXT_PUBLIC_API_URL"]' ),
        settingAPI_AlertURI: () => cy.get( '[data-testid="api-alert_uri"]' ),
        settingAPI_AlertClipboard: () => cy.get( '[data-testid="api-alert_copyButton"]' ),

        // Form Errors
        form_ErrorMessage: () => cy.get( '[data-testid="FormMessage"]' ),

        // Cloudinary Elements
        cloudinary_uploadWidget: () => cy.get( '[data-test="upload_button_holder"]' ),
        cloudinary_uploadDone: () => cy.get( '[data-test="queue-done"]' ),

        // Cloudinary iFrame
        getIframeDocument: () =>
        {
            cy.log( 'Retrieving Cloudinary iframe document' );
            return cy.get( 'iframe[data-test="uw-iframe"]', { timeout: 20000 } )
                .should( 'be.visible' )
                .then( ( $iframe ) => cy.wrap( $iframe[ 0 ].contentDocument ).should( 'exist' ) );
        },
        getIframeBody: () =>
        {
            cy.log( 'Retrieving Cloudinary iframe body' );
            return cy.get( 'iframe[data-test="uw-iframe"]' ).its( '0.contentDocument' ).should( 'exist' );
        },
    };

    /**
     * Creates a billboard using an API request.
     * @param {string} storeId - The store ID.
     * @param {string} token - Authorization token.
     * @param {string[]} requestKeys - Keys for the request body.
     * @param {string[]} requestValues - Values for the request body.
     */
    createBillboardWithAPI ( storeId: string, token: string, requestKeys: string[], requestValues: string[] )
    {
        const requestBody = createRequestBody( requestKeys, requestValues );

        cy.request( {
            method: "POST",
            url: `/api/${storeId}/billboards`,
            body: requestBody,
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            failOnStatusCode: false
        } ).then( ( response ) =>
        {
            expect( response.status ).to.equal( 200 );
            const data = response.body;

            if ( data?.id )
            {
                cy.step( `Billboard created with ID: ${data.id}` );
                cy.wrap( data.id ).as( 'createdBillboardId' );
                cy.reload();
                this.elements.billboardDataTableRow().should( 'include.text', data.label );
            } else
            {
                cy.step( 'No valid data returned in response.' );
            }
        } );
    }

    /**
     * Verifies Billboard headers based on the database entries.
     * @param {string} storeId - The store ID.
     */
    verifyBillboardHeaders ( storeId: string )
    {
        cy.task( 'queryDatabase', `SELECT "label" FROM public."Billboards" WHERE "storeId" = '${storeId}' ORDER BY "createdAt" DESC;` )
            .then( ( rows ) =>
            {
                if ( rows.length > 0 )
                {
                    cy.log( `Verifying Billboard headers for storeId: ${storeId}` );
                    this.elements.pageHeaders().should( 'include.text', `Billboards (${rows.length})` );
                    this.elements.pageDescription().should( 'include.text', 'Manage billboards' );
                } else
                {
                    throw new Error( 'No rows returned from the database query' );
                }
            } );
    }

    /**
     * Clicks on the 'Add Billboard' button and verifies navigation.
     * @param {string} storeId - The store ID.
     */
    clickOnAddBillboardButton ( storeId: string )
    {
        this.elements.addNewButton().click();
        cy.url().should( 'include', `${storeId}/billboards/new` );
        this.elements.pageHeaders().should( 'include.text', 'Create Billboard' );
    }

    /**
     * Uploads an image using Cloudinary Upload Widget.
     * @param {string} imgPath - Path to the image file.
     */
    uploadImage ( imgPath: string )
    {
        this.elements.billboard_uploadImageButton().click();
        cy.origin( 'https://upload-widget.cloudinary.com', { args: [ imgPath ] }, ( imgPath ) =>
        {
            cy.get( '.upload_button_holder' ).click();
            cy.get( 'input[type="file"]' ).selectFile( imgPath, { force: true } );
        } );
        cy.step( 'Image uploaded successfully' );
    }

    /**
     * Enters a Billboard name into the form.
     * @param {string} label - The billboard name.
     */
    enterBillboardName ( label: string )
    {
        this.elements.billboard_formLabelInputField().clear().type( label ).should( 'have.value', label );
    }

    /**
     * Clicks on the submit button to create a billboard.
     */
    clickOnSubmitButton ()
    {
        this.elements.billboard_submitButton().click();
    }

    /**
     * Modifies a billboard by selecting it from the data table.
     * @param {string} billboardLabel - The label of the billboard to modify.
     */
    actionModifyBillboard ( billboardLabel: string )
    {
        cy.handlingTable( this.elements.billboardDataTableRow(), this.elements.billboardActionColumn(), billboardLabel );
        this.elements.billboardActionItem().contains( 'Modify' ).click( { force: true } );
        this.elements.billboard_formLabelInputField().should( 'have.value', billboardLabel );
    }

    /**
     * Deletes a billboard by selecting it from the data table.
     * @param {string} billboardLabel - The label of the billboard to delete.
     */
    actionDeleteBillboard ( billboardLabel: string )
    {
        cy.handlingTable( this.elements.billboardDataTableRow(), this.elements.billboardActionColumn(), billboardLabel );
        this.elements.billboardActionItem().contains( 'Delete' ).click( { force: true } );
        cy.deleteObjects( true );
    }

    /**
     * TODO: Implement copy billboard functionality.
     */
    actionCopyBillboard ( billboardLabel: string )
    {
        cy.step( `Copy functionality not implemented yet for ${billboardLabel}` );
    }

    /**
     * TODO: Verify API route for billboards.
     */
    verifyBillboardAPIRoute ( storeId: string, billboardLabel: string )
    {
        cy.step( 'API route verification not implemented yet' );
    }
}

export default AdminBillboardPage;
