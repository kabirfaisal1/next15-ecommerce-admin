
class AdminSizesPage
{
    elements: { [ key: string ]: () => Cypress.Chainable; } = {
        pageHeaders: () => cy.get( '[data-testid="heading-title"]' ),
        pageDescription: () => cy.get( '[data-testid="heading-description"]' ),
        addNewButton: () => cy.get( '[data-testid="add-sizeClient-button"]' ),

        // Create New Categories Form
        size_formInputLabel: () => cy.get( '[data-testid="Size-NameSubtitle"]' ),
        size_formLabelInputField: () => cy.get( '[data-testid="size-NameInput"]' ),
        size_valueSelectLabel: () => cy.get( '[data-testid="size-BillboardSubtitle"]' ),
        size_valueSelectTrigger: () => cy.get( '[data-testid="selectTrigger"]' ),
        size_valueSelectOption: () => cy.get( 'select' ),
        size_submitButtonButton: () => cy.get( '[data-testid="size-submitButton"]' ),
        sizeDataTable: () => cy.get( '[data-testid="data-table"]' ),

        sizeActionColumn: () => cy.get( '[data-testid="cellAction-dropdownMenuTrigger"]' ),
        sizeActionItem: () => cy.get( 'div[data-side="bottom"][role="menu"]' ),
        settingAPI_Alert: () => cy.get( '[data-testid="api-alert_NEXT_PUBLIC_API_URL"]' ),
        settingAPI_AlertURI: () => cy.get( '[data-testid="api-alert_uri"]' ),
        settingAPI_AlertClipboard: () => cy.get( '[data-testid="api-alert_copyButton"]' ),
        form_errorMessage: () => cy.get( 'p' ),


    };

    verifySizeHeaders ( storeId: string )
    {
        cy.step( 'Verifying Categories Headers' );
        // let valuesQuery: string;
        const valuesQuery = `SELECT "label" FROM public."Sizes" where "storeId" = '${storeId}' ORDER by "createdAt" DESC;`;
        cy.task( 'queryDatabase', valuesQuery ).then( ( rows ) =>
        {
            if ( rows.length > 0 )
            {
                const numberOfBillboards = rows.length; // Extract the store ID from the query result
                cy.step( `Checking size page headers for storeId:: ${storeId}` ); // Log the resolved storeID
                this.elements.pageHeaders().should( 'be.visible' ).should( 'include.text', `Categories (${numberOfBillboards})` )
                    .and( 'include.text', 'API Routes' );
                cy.step( `Checking size page description for storeId: ${storeId}` ); // Log the resolved storeID
                this.elements.pageDescription().should( 'be.visible' ).should( 'include.text', 'Manage size for your store' ).and( 'include.text', 'API routes for managing size' );


            } else
            {
                throw new Error( 'No rows returned from query' );
            }
        } );

    }

    clickOnAddSizeButton ( storeId: string )
    {
        cy.step( 'Clicking on Add Categories button' );
        this.elements.addNewButton().should( 'be.visible' ).and( 'include.text', 'Add New' ).click();
        cy.step( 'Verify navigation was successful' );
        cy.url().should( 'include', `${storeId}/sizes/new` );
        cy.step( 'Verify Form Header' );
        this.elements.pageHeaders().should( 'be.visible' ).should( 'include.text', 'Create Size' );
        cy.step( 'Verify Form Header Description' );
        this.elements.pageDescription().should( 'be.visible' ).should( 'include.text', 'Add a new Size' );
    }

    enterSizeName ( label: string )
    {
        cy.step( 'Checking Categories name input label' );
        this.elements.size_formInputLabel().should( 'be.visible' ).should( 'have.text', 'Name' );

        cy.step( `Entering Categories name : ${label}` );
        this.elements.size_formLabelInputField().should( 'be.visible' ).clear().type( label ).should( 'have.value', label );
    }

    selectBillboard ( value: string )
    {
        cy.step( 'Checking Categories value Select Label' );
        this.elements.size_valueSelectLabel()
            .should( 'be.visible' )
            .and( 'have.text', 'Billboard' );

        cy.step( 'Fix pointer-events issue' ); //TODO: try with out this code
        cy.get( 'body' ).invoke( 'attr', 'style', 'pointer-events: auto' );

        cy.step( 'Trigger Categories value dropdown' );
        this.elements.size_valueSelectTrigger()
            .should( 'be.visible' )
            .click( { force: true } );

        cy.step( 'Wait for dropdown options to be visible' );
        cy.get( '[role="option"]', { timeout: 5000 } ) // Adjust this selector if necessary
            .should( 'be.visible' );

        cy.step( 'Select Billboard from dropdown' );
        cy.contains( '[role="option"]', value ) // Ensure correct selector for dropdown items
            .should( 'be.visible' )
            .click( { force: true } );

        cy.step( 'Verify selection' );
        this.elements.size_valueSelectTrigger()
            .find( '[data-testid="SelectValue"]' )
            .should( 'have.text', value );
    }

    clickOnSubmitButton ( storeId: string, valueId: string, sizeId?: string )
    {
        cy.step( 'Determining whether to create or update a size' );

        cy.wrap( null ).then( () =>
        {
            return this.elements.size_submitButtonButton()
                .should( 'be.visible' )
                .invoke( 'text' );
        } ).then( ( buttonText ) =>
        {
            const isCreatingSize = buttonText.includes( 'Create Size' );
            const method = isCreatingSize ? 'POST' : 'PATCH';
            const endpoint = isCreatingSize
                ? `/api/${storeId}/sizes`
                : `/api/${storeId}/sizes/${sizeId}`;
            const alias = isCreatingSize ? 'createSize' : 'updateSize';

            cy.step( `Intercepting API call for ${isCreatingSize ? 'creating' : 'updating'} size` );
            cy.intercept( method, endpoint ).as( alias );

            return cy.wrap( alias ); // Ensure alias is wrapped so Cypress properly chains it
        } ).then( ( alias ) =>
        {
            cy.step( 'Clicking on the submit button' );
            this.elements.size_submitButtonButton().click();

            cy.step( 'Waiting for the intercepted API response' );
            cy.wait( `@${alias}`, { timeout: 10000 } ).then( ( interception ) =>
            {
                expect( interception.response.statusCode ).to.eq( 200 );

                const { storeId: xhrStoreId, id: xhrSizeId, valueId: xhrBillboardId } = interception.response.body;

                cy.step( 'Validating API response data' );
                expect( xhrStoreId ).to.eq( storeId );
                expect( xhrBillboardId ).to.eq( valueId );
                expect( xhrSizeId ).to.exist;

                if ( sizeId )
                {
                    expect( xhrSizeId ).to.eq( sizeId );
                }

                cy.log( 'Saving sizeId to Cypress environment' );
                Cypress.env( 'sizeId', xhrSizeId );

                cy.step( 'Verifying the new size page URL' );
                cy.visit( `/${storeId}/sizes/${xhrSizeId}` );
                cy.url().should( 'include', xhrSizeId );
            } );
        } );
    }

    actionModifySize ( sizeName: string )
    {
        cy.step( `Going to Modify ${sizeName}` );

        cy.handlingTable(
            this.elements.sizeDataTable(),
            this.elements.sizeActionColumn(), // Passing as Cypress Chainable
            sizeName
        );

        cy.step( 'Click on modify from drop-down list' );

        // // Find the correct action item in the dropdown and click it
        this.elements.sizeActionItem().should( 'be.visible' )
            .contains( 'Modify' )
            .click( { force: true } );

        cy.step( `Checking correct Categories name : ${sizeName} was selected` );

        this.elements.size_formLabelInputField()
            .should( 'be.visible' )
            .and( 'have.value', sizeName );
    }

    actionCopySize ( sizeName: string )
    {

        //TODO: When we have time
    }
    actionDeleteSize ( sizeName: string )
    {

        cy.step( `Going to Delete ${sizeName}` );

        cy.handlingTable(
            this.elements.sizeDataTable(),
            this.elements.sizeActionColumn(), // Passing as Cypress Chainable
            sizeName
        );

        cy.step( 'Click on modify from drop-down list' );

        // // Find the correct action item in the dropdown and click it
        this.elements.sizeActionItem().should( 'be.visible' )
            .contains( 'Delete' )
            .click( { force: true } );

        cy.deleteObjects( true );
    }

    formErrorValidation ( errorType: string )
    {
        cy.step( 'Clicking on the submit button' );
        this.elements.size_submitButtonButton().click();
        cy.step( `Checking '${errorType}'  error message` );

        this.elements.form_errorMessage().should( 'be.visible' ).contains( errorType );



    }
}

export default AdminSizesPage;

