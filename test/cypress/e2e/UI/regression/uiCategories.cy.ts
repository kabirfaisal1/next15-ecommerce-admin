import AdminCategoriesPage from '@support/test_components/pages/uiAdminCategoriesPage';

const storeId = '00ea910b-ecf0-4d1e-bcb6-5cb72313bb46';
const billboardId = '8cf24cca-eade-4952-961a-58d760b73fef';
const updatedBillboardId = 'e63f7f1f-887b-4fd0-bbd5-690da885a34d';
;
const adminCategoriesPage = new AdminCategoriesPage();

describe( 'Store Billboard', () =>
{


    beforeEach( () =>
    {
        cy.visit( '/' );
        cy.loginToAuth0( 'Regular' );

        cy.step( 'Retrieving authentication tokens' );

    } );

    context( 'Store Category Admin Workflow UI', () =>
    {
        it( 'User navigates to Categories', () =>
        {
            cy.step( 'Navigating to Categories tab' );
            cy.navigateTabItem( 'Categories' );
        } );

        it( 'User creates a new Category', () =>
        {
            cy.step( 'Navigating to Categories page' );
            cy.visit( `/${storeId}/categories` );

            adminCategoriesPage.clickOnAddCategoryButton( storeId );
            adminCategoriesPage.enterCategoryName( 'cyCreateCategories' );
            adminCategoriesPage.selectBillboard( 'Do not delete' );
            adminCategoriesPage.clickOnSubmitButton( storeId, billboardId );
        } );

        it( 'User updates an existing Category', () =>
        {
            cy.step( 'Navigating to Categories page' );
            cy.visit( `/${storeId}/categories` );

            const categoryId = Cypress.env( 'categoryId' );

            adminCategoriesPage.actionModifyCategory( 'cyCreateCategories' );
            adminCategoriesPage.enterCategoryName( 'cyUpdatedCategories' );
            adminCategoriesPage.selectBillboard( 'Forever Billboard' );
            adminCategoriesPage.clickOnSubmitButton( storeId, updatedBillboardId, categoryId );
        } );

        it( 'User deletes a Category', () =>
        {
            cy.step( 'Navigating to Categories page' );
            cy.visit( `/${storeId}/categories` );

            adminCategoriesPage.actionDeleteCategory( 'cyUpdatedCategories' );
        } );

        context( 'Error Validation Tests', () =>
        {
            it( 'Fails when creating a Category without selecting a Billboard', () =>
            {
                cy.step( 'Navigating to new Category form' );
                cy.visit( `/${storeId}/categories/new` );

                adminCategoriesPage.enterCategoryName( 'noBillboardCategory' );
                adminCategoriesPage.formErrorValidation( 'Billboard selection is required' );
            } );

            it( 'Fails when creating a Category without a Name', () =>
            {
                cy.step( 'Navigating to new Category form' );
                cy.visit( `/${storeId}/categories/new` );

                adminCategoriesPage.selectBillboard( 'Do not delete' );
                adminCategoriesPage.formErrorValidation( 'Name must be at least 3 characters long' );
            } );

            it( 'Fails when creating a Category with a 2-character Name', () =>
            {
                cy.step( 'Navigating to new Category form' );
                cy.visit( `/${storeId}/categories/new` );

                adminCategoriesPage.enterCategoryName( 'cy' );
                adminCategoriesPage.selectBillboard( 'Do not delete' );
                adminCategoriesPage.formErrorValidation( 'Name must be at least 3 characters long' );
            } );
        } );
    } );
    afterEach( () =>
    {
        cy.step( 'Cleaning up test data' );
        cy.clearCookies();
        cy.clearLocalStorage();
    }
    );
} );
