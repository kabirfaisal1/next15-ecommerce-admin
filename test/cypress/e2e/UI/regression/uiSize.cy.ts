import AdminSizesPage from '@support/test_components/pages/uiAdminSizesPage';

const storeId = 'c936295f-6653-48f3-b0f4-be89bcc331b8';
const billboardId = 'a3e3e2ea-5707-45bb-a689-86dfb9d917d6';
const adminSizesPage = new AdminSizesPage();
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
        it( 'User navigate to Sizes', () =>
        {
            cy.log( 'Going to billboards from navigation tab' );
            cy.navigateTabItem( "Sizes" );

        } );
        it( 'User create new Sizes', () =>
        {
            cy.step( 'Going to billboards from navigation tab' );
            cy.visit( `/${storeId}/sizes` );
            adminSizesPage.clickOnAddSizeButton( storeId );
            adminSizesPage.enterSizeName( 'cyCreateSizes' );
            adminSizesPage.selectBillboard( 'Forever Billboard' );
            adminSizesPage.clickOnSubmitButton( storeId, billboardId );


        } );
        it( 'User update Sizes', () =>
        {
            cy.step( 'Going to billboards from navigation tab' );
            cy.visit( `/${storeId}/sizes` );
            const categoryId = Cypress.env( 'sizeId' );
            adminSizesPage.actionModifySize( 'cyCreateSizes' );
            adminSizesPage.enterSizeName( 'cyUpdatedSizes' );
            adminSizesPage.selectBillboard( 'Forever Billboard' );
            adminSizesPage.clickOnSubmitButton( storeId, billboardId, categoryId );
        } );
        it( 'User Delete Sizes', () =>
        {
            cy.step( 'Going to billboards from navigation tab' );
            cy.visit( `/${storeId}/sizes` );
            adminSizesPage.actionDeleteSize( 'cyUpdatedSizes' );
        } );
        it( 'User create Sizes without billboards', () =>
        {
            cy.step( 'Going to billboards from navigation tab' );
            cy.visit( `/${storeId}/sizes/new` );

            adminSizesPage.enterSizeName( 'noBillBillboard' );
            adminSizesPage.formErrorValidation( 'Billboard selection is required' );

        } );
        it( 'User create Sizes without Name', () =>
        {
            cy.step( 'Going to billboards from navigation tab' );
            cy.visit( `/${storeId}/sizes/new` );

            adminSizesPage.selectBillboard( 'Forever Billboard' );
            adminSizesPage.formErrorValidation( 'Name must be at least 3 characters long' );

        } );
        it( 'User create Sizes with 2 characters Name', () =>
        {
            cy.step( 'Going to billboards from navigation tab' );
            cy.visit( `/${storeId}/sizes/new` );
            adminSizesPage.enterSizeName( 'cy' );
            adminSizesPage.selectBillboard( 'Forever Billboard' );
            adminSizesPage.formErrorValidation( 'Name must be at least 3 characters long' );

        } );

    } );



} );
