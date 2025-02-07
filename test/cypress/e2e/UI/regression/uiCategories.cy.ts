
import AdminCategoriesPage from '../../../support/test_components/pages/uiAdminCategoriesPage';



const storeId = 'c936295f-6653-48f3-b0f4-be89bcc331b8';
const billboardId = 'a3e3e2ea-5707-45bb-a689-86dfb9d917d6';
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
            cy.log( 'Going to billboards from navigation tab' );
            cy.navigateTabItem( "Categories" );

        } );
        it( 'User create new Categories', () =>
        {
            cy.step( 'Going to billboards from navigation tab' );
            cy.visit( `/${storeId}/categories` );
            adminCategoriesPage.clickOnAddCategoryButton( storeId );
            adminCategoriesPage.enterCategoryName( 'cyCreateCategories' );
            adminCategoriesPage.selectBillboard( 'Forever Billboard' );
            adminCategoriesPage.clickOnSubmitButton( storeId, billboardId );


        } );
        it( 'User update Categories', () =>
        {
            cy.step( 'Going to billboards from navigation tab' );
            cy.visit( `/${storeId}/categories` );
            const categoryId = Cypress.env( 'categoryId' );
            adminCategoriesPage.actionModifyCategory( 'cyCreateCategories' );
            adminCategoriesPage.enterCategoryName( 'cyUpdatedCategoriess' );
            adminCategoriesPage.selectBillboard( 'Forever Billboard' );
            adminCategoriesPage.clickOnSubmitButton( storeId, billboardId, categoryId );
        } );
        it( 'User Delete Categories', () =>
        {
            cy.step( 'Going to billboards from navigation tab' );
            cy.visit( `/${storeId}/categories` );
            adminCategoriesPage.actionDeleteCategory( 'cyUpdatedCategoriess' );
        } );
        it( 'User create Categories without billboards', () =>
        {
            cy.step( 'Going to billboards from navigation tab' );
            cy.visit( `/${storeId}/categories/new` );

            adminCategoriesPage.enterCategoryName( 'noBillBillboard' );
            adminCategoriesPage.formErrorValidation( 'Billboard selection is required' );

        } );
        it( 'User create Categories without Name', () =>
        {
            cy.step( 'Going to billboards from navigation tab' );
            cy.visit( `/${storeId}/categories/new` );

            adminCategoriesPage.selectBillboard( 'Forever Billboard' );
            adminCategoriesPage.formErrorValidation( 'Name must be at least 3 characters long' );

        } );
        it( 'User create Categories with 2 characters Name', () =>
        {
            cy.step( 'Going to billboards from navigation tab' );
            cy.visit( `/${storeId}/categories/new` );
            adminCategoriesPage.enterCategoryName( 'cy' );
            adminCategoriesPage.selectBillboard( 'Forever Billboard' );
            adminCategoriesPage.formErrorValidation( 'Name must be at least 3 characters long' );

        } );

    } );



} );
