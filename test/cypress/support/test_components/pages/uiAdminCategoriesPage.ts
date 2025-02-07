
class AdminCategoriesPage
{
    elements: { [ key: string ]: () => Cypress.Chainable; } = {
        pageHeaders: () => cy.get( '[data-testid="heading-title"]' ),
        pageDescription: () => cy.get( '[data-testid="heading-description"]' ),
        addNewButton: () => cy.get( '[data-testid="add-categoryClient-button"]' ),

        // Create New Categories Form
        category_formInputLabel: () => cy.get( '[data-testid="Category-NameSubtitle"]' ),
        category_formLabelInputField: () => cy.get( '[data-testid="category-NameInput"]' ),
        category_billboardSelectLabel: () => cy.get( '[data-testid="category-BillboardSubtitle"]' ),
        category_billboardSelectTrigger: () => cy.get( '[data-testid="selectTrigger"]' ),
        category_billboardSelectOption: () => cy.get( 'select' ),
        category_submitButtonButton: () => cy.get( '[data-testid="category-submitButton"]' ),
        categoryDataTable: () => cy.get( '[data-testid="data-table"]' ),

        categoryActionColumn: () => cy.get( '[data-testid="cellAction-dropdownMenuTrigger"]' ),
        categoryActionItem: () => cy.get( 'div[data-side="bottom"][role="menu"]' ),
        settingAPI_Alert: () => cy.get( '[data-testid="api-alert_NEXT_PUBLIC_API_URL"]' ),
        settingAPI_AlertURI: () => cy.get( '[data-testid="api-alert_uri"]' ),
        settingAPI_AlertClipboard: () => cy.get( '[data-testid="api-alert_copyButton"]' ),
        form_errorMessage: () => cy.get( 'p' ),


    };

    verifyCategoryHeaders ( storeId: string )
    {
        cy.step( 'Verifying Categories Headers' );
        // let billboardsQuery: string;
        const billboardsQuery = `SELECT "label" FROM public."Categories" where "storeId" = '${storeId}' ORDER by "createdAt" DESC;`;
        cy.task( 'queryDatabase', billboardsQuery ).then( ( rows ) =>
        {
            if ( rows.length > 0 )
            {
                const numberOfBillboards = rows.length; // Extract the store ID from the query result
                cy.step( `Checking category page headers for storeId:: ${storeId}` ); // Log the resolved storeID
                this.elements.pageHeaders().should( 'be.visible' ).should( 'include.text', `Categories (${numberOfBillboards})` )
                    .and( 'include.text', 'API Routes' );
                cy.step( `Checking category page description for storeId: ${storeId}` ); // Log the resolved storeID
                this.elements.pageDescription().should( 'be.visible' ).should( 'include.text', 'Manage category for your store' ).and( 'include.text', 'API routes for managing category' );


            } else
            {
                throw new Error( 'No rows returned from query' );
            }
        } );

    }

    clickOnAddCategoryButton ( storeId: string )
    {
        cy.step( 'Clicking on Add Categories button' );
        this.elements.addNewButton().should( 'be.visible' ).and( 'include.text', 'Add New' ).click();
        cy.step( 'Verify navigation was successful' );
        cy.url().should( 'include', `${storeId}/categories/new` );
        cy.step( 'Verify Form Header' );
        this.elements.pageHeaders().should( 'be.visible' ).should( 'include.text', 'Create Category' );
        cy.step( 'Verify Form Header Description' );
        this.elements.pageDescription().should( 'be.visible' ).should( 'include.text', 'Add a new Category' );
    }

    enterCategoryName ( label: string )
    {
        cy.step( 'Checking Categories name input label' );
        this.elements.category_formInputLabel().should( 'be.visible' ).should( 'have.text', 'Name' );

        cy.step( `Entering Categories name : ${label}` );
        this.elements.category_formLabelInputField().should( 'be.visible' ).clear().type( label ).should( 'have.value', label );
    }

    selectBillboard ( billboard: string )
    {
        cy.step( 'Checking Categories billboard Select Label' );
        this.elements.category_billboardSelectLabel()
            .should( 'be.visible' )
            .and( 'have.text', 'Billboard' );

        cy.step( 'Fix pointer-events issue' ); //TODO: try with out this code
        cy.get( 'body' ).invoke( 'attr', 'style', 'pointer-events: auto' );

        cy.step( 'Trigger Categories billboard dropdown' );
        this.elements.category_billboardSelectTrigger()
            .should( 'be.visible' )
            .click( { force: true } );

        cy.step( 'Wait for dropdown options to be visible' );
        cy.get( '[role="option"]', { timeout: 5000 } ) // Adjust this selector if necessary
            .should( 'be.visible' );

        cy.step( 'Select Billboard from dropdown' );
        cy.contains( '[role="option"]', billboard ) // Ensure correct selector for dropdown items
            .should( 'be.visible' )
            .click( { force: true } );

        cy.step( 'Verify selection' );
        this.elements.category_billboardSelectTrigger()
            .find( '[data-testid="SelectValue"]' )
            .should( 'have.text', billboard );
    }

    clickOnSubmitButton ( storeId: string, billboardId: string, categoryId?: string )
    {
        cy.step( 'Determining whether to create or update a category' );

        cy.wrap( null ).then( () =>
        {
            return this.elements.category_submitButtonButton()
                .should( 'be.visible' )
                .invoke( 'text' );
        } ).then( ( buttonText ) =>
        {
            const isCreatingCategory = buttonText.includes( 'Create Category' );
            const method = isCreatingCategory ? 'POST' : 'PATCH';
            const endpoint = isCreatingCategory
                ? `/api/${storeId}/categories`
                : `/api/${storeId}/categories/${categoryId}`;
            const alias = isCreatingCategory ? 'createCategory' : 'updateCategory';

            cy.step( `Intercepting API call for ${isCreatingCategory ? 'creating' : 'updating'} category` );
            cy.intercept( method, endpoint ).as( alias );

            return cy.wrap( alias ); // Ensure alias is wrapped so Cypress properly chains it
        } ).then( ( alias ) =>
        {
            cy.step( 'Clicking on the submit button' );
            this.elements.category_submitButtonButton().click();

            cy.step( 'Waiting for the intercepted API response' );
            cy.wait( `@${alias}`, { timeout: 10000 } ).then( ( interception ) =>
            {
                expect( interception.response.statusCode ).to.eq( 200 );

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

    actionModifyCategory ( categoryName: string )
    {
        cy.step( `Going to Modify ${categoryName}` );

        cy.handlingTable(
            this.elements.categoryDataTable(),
            this.elements.categoryActionColumn(), // Passing as Cypress Chainable
            categoryName
        );

        cy.step( 'Click on modify from drop-down list' );

        // // Find the correct action item in the dropdown and click it
        this.elements.categoryActionItem().should( 'be.visible' )
            .contains( 'Modify' )
            .click( { force: true } );

        cy.step( `Checking correct Categories name : ${categoryName} was selected` );

        this.elements.category_formLabelInputField()
            .should( 'be.visible' )
            .and( 'have.value', categoryName );
    }

    actionCopyCategory ( categoryName: string )
    {

        //TODO: When we have time
    }
    actionDeleteCategory ( categoryName: string )
    {

        cy.step( `Going to Delete ${categoryName}` );

        cy.handlingTable(
            this.elements.categoryDataTable(),
            this.elements.categoryActionColumn(), // Passing as Cypress Chainable
            categoryName
        );

        cy.step( 'Click on modify from drop-down list' );

        // // Find the correct action item in the dropdown and click it
        this.elements.categoryActionItem().should( 'be.visible' )
            .contains( 'Delete' )
            .click( { force: true } );

        cy.deleteObjects( true );
    }

    formErrorValidation ( errorType: string )
    {
        cy.step( 'Clicking on the submit button' );
        this.elements.category_submitButtonButton().click();
        cy.step( `Checking '${errorType}'  error message` );

        this.elements.form_errorMessage().should( 'be.visible' ).contains( errorType );



    }
}

export default AdminCategoriesPage;

