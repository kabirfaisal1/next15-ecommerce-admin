/**
 * A Page Object Model for the Admin Colors page.
 */
class AdminColorsPage
{
    elements: { [ key: string ]: () => Cypress.Chainable; } = {
        pageHeaders: () => cy.get( '[data-testid="heading-title"]' ),
        pageDescription: () => cy.get( '[data-testid="heading-description"]' ),
        addNewButton: () => cy.get( '[data-testid="add-colorsClient-button"]' ),

        // Form Elements
        color_formInputLabel: () => cy.get( 'label[data-testid="color-NameSubtitle"]' ),
        color_formInputField: () => cy.get( '[data-testid="color-NameInput"]' ),
        color_valueLabel: () => cy.get( '[data-testid="color-valueSubtitle"]' ),
        color_valueInput: () => cy.get( '[data-testid="color-valueInput"]' ),

        color_submitButton: () => cy.get( '[data-testid="color-submitButton"]' ),
        colorDataTable: () => cy.get( '[data-testid="data-table"]' ),

        colorActionColumn: () => cy.get( '[data-testid="cellAction-dropdownMenuTrigger"]' ),
        colorActionItem: () => cy.get( 'div[data-testid="cellAction-dropdownMenuContent"]' ),
        form_errorMessage: () => cy.get( '[data-testid="FormMessage"]' ),
    };

    /**
     * Clicks on the "Add Color" button and verifies navigation.
     * @param {string} storeId - The store ID.
     */
    clickOnAddColorButton ( storeId: string )
    {
        cy.step( 'Clicking on Add Color button' );
        this.elements.addNewButton().click();
        cy.url().should( 'include', `${storeId}/colors/new` );
        this.elements.pageHeaders().should( 'include.text', 'Create Color' );
    }

    /**
     * Enters a Color name in the input field.
     * @param {string} name - The color name.
     */
    enterColorName ( name: string )
    {
        cy.step( 'Verifying the color name input label' );
        this.elements.color_formInputLabel().should( 'have.text', 'Name' );
        cy.step( `Entering color name: ${name}` );
        this.elements.color_formInputField().clear().type( name ).should( 'have.value', name );
    }

    /**
     * Enters a Color value in the input field.
     * @param {string} value - The color value.
     */
    enterColorValue ( value: string )
    {
        cy.step( `Entering color value Label` );
        this.elements.color_valueLabel().should( 'have.text', 'Color Value' );

        cy.step( `Entering color value: ${value}` );
        this.elements.color_valueInput().clear().type( value ).should( 'have.value', value );
    }

    /**
     * Clicks the submit button and waits for the API response.
     * @param {string} storeId - The store ID.
     * @param {string} [colorId] - The Color ID (optional, used when updating).
     */
    clickOnSubmitButton ( storeId: string, colorId?: string )
    {
        cy.step( 'Determining create or update action' );

        cy.wrap( null )
            .then( () => this.elements.color_submitButton().invoke( 'text' ) )
            .then( ( buttonText ) =>
            {
                const isCreating = buttonText.includes( 'Create Color' );
                const method = isCreating ? 'POST' : 'PATCH';
                const endpoint = isCreating
                    ? `/api/${storeId}/colors`
                    : `/api/${storeId}/colors/${colorId}`;
                const alias = isCreating ? 'createColor' : 'updateColor';

                cy.step( `Intercepting API call for ${isCreating ? 'creating' : 'updating'} color` );
                cy.intercept( method, endpoint ).as( alias );

                return cy.wrap( alias );
            } )
            .then( ( alias ) =>
            {
                this.elements.color_submitButton().click();
                cy.wait( `@${alias}` ).then( ( interception ) =>
                {
                    expect( interception.response.statusCode ).to.eq( 200 );

                    if ( alias === 'updateColor' )
                    {
                        expect( interception.response.body ).to.have.property( 'message', 'Successfully Updated' );
                    } else
                    {
                        const { storeId: xhrStoreId, id: xhrColorId } = interception.response.body;

                        cy.step( 'Validating API response data' );
                        expect( xhrStoreId ).to.eq( storeId );
                        expect( xhrColorId ).to.exist;

                        cy.log( 'Saving colorId to Cypress environment' );
                        Cypress.env( 'colorId', xhrColorId );

                        cy.step( 'Verifying the new color page URL' );
                        cy.visit( `/${storeId}/colors/${xhrColorId}` );
                        cy.url().should( 'include', xhrColorId );
                    }
                } );
            } );
    }

    /**
       * Modifies a color by selecting it from the table and opening the edit form.
       * @param {string} colorName - The name of the color to modify.
       */
    actionModifyColor ( colorName: string )
    {
        cy.step( `Going to Modify ${colorName}` );

        cy.handlingTable(
            this.elements.colorDataTable(),
            this.elements.colorActionColumn(), // Passing as Cypress Chainable
            colorName
        );

        cy.step( 'Clicking on modify from dropdown list' );
        this.elements.colorActionItem()
            .should( 'be.visible' )
            .contains( 'Modify' )
            .click( { force: true } );

        cy.step( `Verifying correct color name: ${colorName} was selected` );

        this.elements.color_formInputField()
            .should( 'be.visible' )
            .and( 'have.value', colorName );
    }

    /**
     * Copies a color by selecting it from the table.
     * @param {string} colorName - The name of the color to copy.
     */
    actionCopyColor ( colorName: string )
    {
        // TODO: Implement copy color functionality
    }

    /**
     * Deletes a color by selecting it from the table.
     * @param {string} colorName - The name of the color to delete.
     */
    actionDeleteColor ( colorName: string )
    {
        cy.step( `Going to Delete ${colorName}` );

        cy.handlingTable(
            this.elements.colorDataTable(),
            this.elements.colorActionColumn(), // Passing as Cypress Chainable
            colorName
        );

        cy.step( 'Clicking on Delete from dropdown list' );

        // Select "Delete" from the dropdown menu
        this.elements.colorActionItem()
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
        this.elements.color_submitButton().click();

        cy.step( `Checking for error message: '${errorType}'` );
        this.elements.form_errorMessage().should( 'be.visible' ).contains( errorType );
    }
}

export default AdminColorsPage;
