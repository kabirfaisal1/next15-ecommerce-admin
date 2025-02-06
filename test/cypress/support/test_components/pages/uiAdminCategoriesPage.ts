
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
        categoryDataTableRow: () => cy.get( '[data-testid="data-tableBodyRows"]' ),
        categoryActionColumn: () => cy.get( '[data-testid="cellAction-dropdownMenuTrigger"]' ),
        billBoardActionItem: () => cy.get( '[data-testid="cellAction-dropdownMenuContent"]' ),
        settingAPI_Alert: () => cy.get( '[data-testid="api-alert_NEXT_PUBLIC_API_URL"]' ),
        settingAPI_AlertURI: () => cy.get( '[data-testid="api-alert_uri"]' ),
        settingAPI_AlertClipboard: () => cy.get( '[data-testid="api-alert_copyButton"]' ),
        form_ErrorMessage: () => cy.get( '[data-testid="FormMessage"]' ),

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
        this.elements.category_billboardSelectLabel().should( 'be.visible' ).and( 'have.text', 'Billboard' );

        cy.step( 'Trigger Categories billboard dropdown' );
        this.elements.category_billboardSelectTrigger().should( 'be.visible' ).click( { force: true } );



        cy.step( 'Manually set the hidden select value and trigger change event' );
        this.elements.category_billboardSelectOption().select( billboard, { force: true } ).invoke( 'val' )
            .should( 'eq', 'a3e3e2ea-5707-45bb-a689-86dfb9d917d6' );

    }

    clickOnSubmitButton ()
    {
        cy.step( 'Clicking on submit button' );

        cy.url().then( ( currentUrl ) =>
        {
            this.elements
                .category_submitButtonButton()
                .should( 'be.visible' )
                .click();
        } );
    }

    actionModifyCategory ( categoryName: string )
    {
        cy.step( `Going to Modify ${categoryName}` );

        cy.handlingTable(
            this.elements.billboardDataTableRow(),
            this.elements.billBoardActionColumn(), // Passing as Cypress Chainable
            categoryName
        );

        cy.step( 'Click on modify from drop-down list' );

        // // Find the correct action item in the dropdown and click it
        this.elements.billBoardActionItem().should( 'be.visible' )
            .contains( 'Modify' )
            .click( { force: true } );

        cy.step( `Checking correct Categories name : ${categoryName} was selected` );

        this.elements.billboard_formLabelInputField()
            .should( 'be.visible' )
            .and( 'have.value', categoryName );
    }

    actionCopyCategory ( categoryName: string )
    {

        //TODO: When we have time
    }
    actionDeleteCategory ( categoryName: string )
    {

        cy.step( `Going to Modify ${categoryName}` );

        cy.handlingTable(
            this.elements.categoryDataTableRow(),
            this.elements.categoryActionColumn(), // Passing as Cypress Chainable
            categoryName
        );

        cy.step( 'Click on modify from drop-down list' );

        // // Find the correct action item in the dropdown and click it
        this.elements.billBoardActionItem().should( 'be.visible' )
            .contains( 'Delete' )
            .click( { force: true } );

        cy.deleteObjects( true );
    }





}

export default AdminCategoriesPage;

