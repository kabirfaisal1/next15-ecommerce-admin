
import AdminCategoriesPage from '@support/test_components/pages/uiAdminCategoriesPage';



const storeId = '00ea910b-ecf0-4d1e-bcb6-5cb72313bb46';
const billboardId = '8cf24cca-eade-4952-961a-58d760b73fef';
const adminCategoriesPage = new AdminCategoriesPage();
describe( 'Store Billboard', () =>
{
    let token: string = '';
    beforeEach( () =>
    {
        cy.visit( '/' );
        cy.loginToAuth0( "Regular" );

    } );
    context( 'Store category Admin workflow UI', () =>
    {
        it( 'User navigate to Categories', () =>
        {
            cy.log( 'Going to categories from navigation tab' );
            cy.navigateTabItem( "Categories" );

        } );
        it( 'User create new Categories', () =>
        {
            cy.step( 'Going to categories from navigation tab' );
            cy.visit( `/${storeId}/categories` );
            adminCategoriesPage.clickOnAddCategoryButton( storeId );
            adminCategoriesPage.enterCategoryName( 'cyCreateCategories' );
            adminCategoriesPage.selectBillboard( 'Do not delete' );
            adminCategoriesPage.clickOnSubmitButton( storeId, billboardId );


        } );
        //TODO check why this failed
        it( 'User update Categories', () =>
        {
            cy.step( 'Going to categories from navigation tab' );
            cy.visit( `/${storeId}/categories` );
            const categoryId = Cypress.env( 'categoryId' );
            adminCategoriesPage.actionModifyCategory( 'cyCreateCategories' );
            adminCategoriesPage.enterCategoryName( 'cyUpdatedCategoriess' );
            adminCategoriesPage.selectBillboard( 'Do not delete' );
            adminCategoriesPage.clickOnSubmitButton( storeId, billboardId, categoryId );
        } );
        it( 'User Delete Categories', () =>
        {
            cy.step( 'Going to categories from navigation tab' );
            cy.visit( `/${storeId}/categories` );
            adminCategoriesPage.actionDeleteCategory( 'cyUpdatedCategoriess' );
        } );
        it( 'User create Categories without categories', () =>
        {
            cy.step( 'Going to categories from navigation tab' );
            cy.visit( `/${storeId}/categories/new` );

            adminCategoriesPage.enterCategoryName( 'noBillBillboard' );
            adminCategoriesPage.formErrorValidation( 'Billboard selection is required' );

        } );
        it( 'User create Categories without Name', () =>
        {
            cy.step( 'Going to categories from navigation tab' );
            cy.visit( `/${storeId}/categories/new` );

            adminCategoriesPage.selectBillboard( 'Do not delete' );
            adminCategoriesPage.formErrorValidation( 'Name must be at least 3 characters long' );

        } );
        it( 'User create Categories with 2 characters Name', () =>
        {
            cy.step( 'Going to categories from navigation tab' );
            cy.visit( `/${storeId}/categories/new` );
            adminCategoriesPage.enterCategoryName( 'cy' );
            adminCategoriesPage.selectBillboard( 'Do not delete' );
            adminCategoriesPage.formErrorValidation( 'Name must be at least 3 characters long' );

        } );

    } );



} );
