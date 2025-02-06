
import AdminCategoriesPage from '../../../support/test_components/pages/uiAdminCategoriesPage';



const storeId = 'c936295f-6653-48f3-b0f4-be89bcc331b8';
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
        it.only( 'User add Categories', () =>
        {
            cy.step( 'Going to billboards from navigation tab' );
            cy.visit( `/${storeId}/categories` );

            cy.step( 'Click on Add new' );
            adminCategoriesPage.clickOnAddCategoryButton( storeId );
            adminCategoriesPage.enterCategoryName( 'CypressUICategories' );
            adminCategoriesPage.selectBillboard('Forever Billboard');
            adminCategoriesPage.clickOnSubmitButton();
        } );

    } );



} );
