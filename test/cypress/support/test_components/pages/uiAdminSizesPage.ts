/**
 * A Page Object Model for the Admin Sizes page.
 */
class AdminSizesPage
{
    elements: { [ key: string ]: () => Cypress.Chainable; } = {
        pageHeaders: () => cy.get( '[data-testid="heading-title"]' ),
        pageDescription: () => cy.get( '[data-testid="heading-description"]' ),
        addNewButton: () => cy.get( '[data-testid="add-sizesClient-button"]' ),

        // Form Elements
        size_formInputLabel: () => cy.get( 'label[data-testid="size-NameSubtitle"]' ),
        size_formInputField: () => cy.get( '[data-testid="size-NameInput"]' ),
        size_valueLabel: () => cy.get( '[data-testid="size-valueSubtitle"]' ),
        size_valueInput: () => cy.get( '[data-testid="size-valueInput"]' ),

        size_submitButton: () => cy.get( '[data-testid="size-submitButton"]' ),
        sizeDataTable: () => cy.get( '[data-testid="data-table"]' ),

        sizeActionColumn: () => cy.get( '[data-testid="cellAction-dropdownMenuTrigger"]' ),
        sizeActionItem: () => cy.get( 'div[data-testid="cellAction-dropdownMenuContent"]' ),
        form_errorMessage: () => cy.get( '[data-testid="FormMessage"]' ),
    };

    /**
     * Clicks on the "Add Size" button and verifies navigation.
     * @param {string} storeId - The store ID.
     */
    clickOnAddSizeButton ( storeId: string )
    {
        cy.step( 'Clicking on Add Size button' );
        this.elements.addNewButton().click();
        cy.url().should( 'include', `${storeId}/sizes/new` );
        this.elements.pageHeaders().should( 'include.text', 'Create Size' );
    }

    /**
     * Enters a Size name in the input field.
     * @param {string} name - The size name.
     */
    enterSizeName ( name: string )
    {
        cy.step( 'Verifying the size name input label' );
        this.elements.size_formInputLabel().should( 'have.text', 'Name' );
        cy.step( `Entering size name: ${name}` );
        this.elements.size_formInputField().clear().type( name ).should( 'have.value', name );
    }

    /**
     * Enters a Size value in the input field.
     * @param {string} value - The size value.
     */
    enterSizeValue ( value: string )
    {
        cy.step( `Entering size value Label` );
        this.elements.size_valueLabel().should( 'have.text', 'Size Value' );

        cy.step( `Entering size value: ${value}` );
        this.elements.size_valueInput().clear().type( value ).should( 'have.value', value );
    }

    /**
     * Clicks the submit button and waits for the API response.
     * @param {string} storeId - The store ID.
     * @param {string} [sizeId] - The Size ID (optional, used when updating).
     */
    clickOnSubmitButton ( storeId: string, sizeId?: string )
    {
        cy.step( 'Determining create or update action' );

        cy.wrap( null )
            .then( () => this.elements.size_submitButton().invoke( 'text' ) )
            .then( ( buttonText ) =>
            {
                const isCreating = buttonText.includes( 'Create Size' );
                const method = isCreating ? 'POST' : 'PATCH';
                const endpoint = isCreating
                    ? `/api/${storeId}/sizes`
                    : `/api/${storeId}/sizes/${sizeId}`;
                const alias = isCreating ? 'createSize' : 'updateSize';

                cy.step( `Intercepting API call for ${isCreating ? 'creating' : 'updating'} size` );
                cy.intercept( method, endpoint ).as( alias );

                return cy.wrap( alias );
            } )
            .then( ( alias ) =>
            {
                this.elements.size_submitButton().click();
                cy.wait( `@${alias}` ).then( ( interception ) =>
                {
                    expect( interception.response.statusCode ).to.eq( 200 );

                    if ( alias === 'updateSize' )
                    {
                        expect( interception.response.body ).to.have.property( 'message', 'Successfully Updated' );
                    } else
                    {
                        const { storeId: xhrStoreId, id: xhrSizeId } = interception.response.body;

                        cy.step( 'Validating API response data' );
                        expect( xhrStoreId ).to.eq( storeId );
                        expect( xhrSizeId ).to.exist;

                        cy.log( 'Saving sizeId to Cypress environment' );
                        Cypress.env( 'sizeId', xhrSizeId );

                        cy.step( 'Verifying the new size page URL' );
                        cy.visit( `/${storeId}/sizes/${xhrSizeId}` );
                        cy.url().should( 'include', xhrSizeId );
                    }
                } );
            } );
    }

    /**
       * Modifies a size by selecting it from the table and opening the edit form.
       * @param {string} sizeName - The name of the size to modify.
       */
    actionModifySize ( sizeName: string )
    {
        cy.step( `Going to Modify ${sizeName}` );

        cy.handlingTable(
            this.elements.sizeDataTable(),
            this.elements.sizeActionColumn(), // Passing as Cypress Chainable
            sizeName
        );

        cy.step( 'Clicking on modify from dropdown list' );
        this.elements.sizeActionItem()
            .should( 'be.visible' )
            .contains( 'Modify' )
            .click( { force: true } );

        cy.step( `Verifying correct size name: ${sizeName} was selected` );

        this.elements.size_formInputField()
            .should( 'be.visible' )
            .and( 'have.value', sizeName );
    }

    /**
     * Copies a size by selecting it from the table.
     * @param {string} sizeName - The name of the size to copy.
     */
    actionCopySize ( sizeName: string )
    {
        // TODO: Implement copy size functionality
    }

    /**
     * Deletes a size by selecting it from the table.
     * @param {string} sizeName - The name of the size to delete.
     */
    actionDeleteSize ( sizeName: string )
    {
        cy.step( `Going to Delete ${sizeName}` );

        cy.handlingTable(
            this.elements.sizeDataTable(),
            this.elements.sizeActionColumn(), // Passing as Cypress Chainable
            sizeName
        );

        cy.step( 'Clicking on Delete from dropdown list' );

        // Select "Delete" from the dropdown menu
        this.elements.sizeActionItem()
            .should( 'be.visible' )
            .contains( 'Delete' )
            .click( { force: true } );

        cy.deleteObjects( true );
    }

    /**
     * Validates error messages on the form submission.
     * @param {string} errorType - The expected error message.
     */
    formErrorValidation ( errorType: string )
    {
        cy.step( 'Clicking on the submit button' );
        this.elements.size_submitButton().click();

        cy.step( `Checking for error message: '${errorType}'` );
        this.elements.form_errorMessage().should( 'be.visible' ).contains( errorType );
    }
}

export default AdminSizesPage;
