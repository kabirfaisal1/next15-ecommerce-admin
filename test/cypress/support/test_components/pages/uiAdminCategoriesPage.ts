class AdminCategoriesPage
{
    elements: { [ key: string ]: () => Cypress.Chainable; } = {
        pageHeaders: () => cy.get( '[data-testid="heading-title"]' ),
        pageDescription: () => cy.get( '[data-testid="heading-description"]' ),
        addNewButton: () => cy.get( '[data-testid="add-categoryClient-button"]' ),

        // Form Elements
        category_formInputLabel: () => cy.get( '[data-testid="Category-NameSubtitle"]' ),
        category_formLabelInputField: () => cy.get( '[data-testid="category-NameInput"]' ),
        category_billboardSelectLabel: () => cy.get( '[data-testid="category-BillboardSubtitle"]' ),
        category_billboardSelectTrigger: () => cy.get( '[data-testid="selectTrigger"]' ),
        category_submitButton: () => cy.get( '[data-testid="category-submitButton"]' ),
        form_errorMessage: () => cy.get( 'p' ),

        // Data Table
        categoryDataTable: () => cy.get( '[data-testid="data-table"]' ),
        categoryDataTableRow: () => cy.get( '[data-testid="data-tableBodyRows"]' ),
        categoryActionColumn: () => cy.get( '[data-testid="cellAction-dropdownMenuTrigger"]' ),
        categoryActionItem: () => cy.get( '[data-testid="cellAction-dropdownMenuContent"]', { timeout: 1000 } ),
    };

    /**
     * Clicks on the "Add Category" button and verifies navigation.
     */
    clickOnAddCategoryButton ( storeId: string )
    {
        cy.step( 'Clicking on Add Category button' );
        this.elements.addNewButton().click();
        cy.url().should( 'include', `${storeId}/categories/new` );
        this.elements.pageHeaders().should( 'include.text', 'Create Category' );
    }

    /**
     * Enters a Category name in the input field.
     * @param {string} name - The category name.
     */
    enterCategoryName ( name: string )
    {
        cy.step( `Entering category name: ${name}` );
        this.elements.category_formLabelInputField().clear().type( name ).should( 'have.value', name );
    }

    /**
     * Selects a Billboard from the dropdown.
     * @param {string} billboard - The Billboard name.
     */
    selectBillboard ( billboard: string )
    {
        cy.step( 'Opening Billboard dropdown' );
        this.elements.category_billboardSelectTrigger().click();

        cy.step( `Selecting Billboard: ${billboard}` );
        cy.contains( '[role="option"]', billboard ).click( { force: true } );

        this.elements.category_billboardSelectTrigger()
            .find( '[data-testid="SelectValue"]' )
            .should( 'have.text', billboard );
    }

    /**
  * Clicks the submit button and waits for the API response.
  * Only executes API response validation when creating a category.
  * @param {string} storeId - The store ID.
  * @param {string} billboardId - The Billboard ID.
  * @param {string} [categoryId] - The Category ID (optional, used when updating).
  */
    clickOnSubmitButton ( storeId: string, billboardId: string, categoryId?: string )
    {
        cy.step( 'Determining whether to create or update a size' );

        cy.wrap( null ).then( () =>
        {
            return this.elements.category_submitButton()
                .should( 'be.visible' )
                .invoke( 'text' );
        } ).then( ( buttonText ) =>
        {
            const isCreatingSize = buttonText.includes( 'Create Category' );
            cy.step( `Button text is: ${buttonText}` );
            const method = isCreatingSize ? 'POST' : 'PATCH';
            cy.step( `categoryId text is: ${categoryId}` );
            const endpoint = isCreatingSize
                ? `/api/${storeId}/categories`
                : `/api/${storeId}/categories/${categoryId}`;
            const alias = isCreatingSize ? 'createCategory' : 'updateCategory';

            cy.step( `Intercepting API call for ${isCreatingSize ? 'creating' : 'updating'} category` );
            cy.intercept( method, endpoint ).as( alias );

            return cy.wrap( alias ); // Ensure alias is wrapped so Cypress properly chains it
        } ).then( ( alias ) =>
        {
            cy.step( 'Clicking on the submit button' );
            this.elements.category_submitButton().click();

            cy.step( 'Waiting for the intercepted API response' );
            cy.wait( `@${alias}`, { timeout: 10000 } ).then( ( interception ) =>
            {

                const { storeId: xhrStoreId, id: xhrCategoryId, billboardId: xhrBillboardId } = interception.response.body;

                cy.step( 'Validating API response data' );
                expect( xhrStoreId ).to.eq( storeId );
                expect( xhrBillboardId ).to.eq( billboardId );
                expect( xhrCategoryId ).to.exist;

                if ( categoryId )
                {
                    expect( xhrCategoryId ).to.eq( categoryId );
                }

                cy.log( 'Saving categoryId to Cypress environment' );
                Cypress.env( 'categoryId', xhrCategoryId );

                cy.step( 'Verifying the new category page URL' );
                cy.visit( `/${storeId}/categories/${xhrCategoryId}` );
                cy.url().should( 'include', xhrCategoryId );


            } );
        } );
    }


    /**
 * Modifies a category by selecting it from the table and opening the edit form.
 * @param {string} categoryName - The name of the category to modify.
 */
    actionModifyCategory ( categoryName: string )
    {
        cy.step( `Going to Modify: ${categoryName}` );
        cy.handlingTable(
            this.elements.categoryDataTableRow(),
            this.elements.categoryActionColumn(),
            categoryName
        );

        cy.step( 'Clicking on modify from dropdown list' );
        this.elements.categoryActionItem()
            .should( 'be.visible' )
            .contains( 'Modify' )
            .click( { force: true } );

        cy.step( `Verifying correct category name: ${categoryName} was selected` );
        this.elements.category_formLabelInputField()
            .should( 'be.visible' )
            .and( 'have.value', categoryName );
    }

    /**
     * Deletes a category by selecting it from the table.
     * @param {string} categoryName - The name of the category to delete.
     */
    actionDeleteCategory ( categoryName: string )
    {
        cy.step( `Deleting category: ${categoryName}` );
        cy.handlingTable(
            this.elements.categoryDataTableRow(),
            this.elements.categoryActionColumn(),
            categoryName );

        cy.step( 'Clicking on Delete from dropdown list' );

        // this.elements.categoryActionItem()
        //     .should( 'be.visible' )
        //     .contains( 'Delete' )
        //     .click( { force: true } );

        this.elements.categoryActionItem().should( 'be.visible' )
            .contains( 'Delete' )
            .click( { force: true } );

        cy.step( 'Confirming deletion' );
        cy.deleteObjects( true );
    }

    /**
     * Validates form error messages.
     * @param {string} errorMessage - The expected error message.
     */
    formErrorValidation ( errorMessage: string )
    {
        cy.step( `Verifying error: ${errorMessage}` );
        this.elements.category_submitButton().click();
        this.elements.form_errorMessage().should( 'contain.text', errorMessage );
    }
}

export default AdminCategoriesPage;
