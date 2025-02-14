import AdminSizesPage from '@support/test_components/pages/uiAdminSizesPage';

const storeId = '00ea910b-ecf0-4d1e-bcb6-5cb72313bb46';

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
            cy.log( 'Going to sizes from navigation tab' );
            cy.navigateTabItem( "Sizes" );

        } );
        it( 'User create new Sizes', () =>
        {
            cy.step( 'Going to sizes from navigation tab' );
            cy.visit( `/${storeId}/sizes` );
            adminSizesPage.clickOnAddSizeButton( storeId );
            adminSizesPage.enterSizeName( 'cyCreateSizes' );
            adminSizesPage.enterSizeValue( 'cyCreateSmall' );
            adminSizesPage.clickOnSubmitButton( storeId, billboardId );


        } );
        it( 'User update Sizes Name', () =>
        {
            cy.step( 'Going to sizes from navigation tab' );
            cy.visit( `/${storeId}/sizes` );
            const sizeId = Cypress.env( 'sizeId' );
            adminSizesPage.actionModifySize( 'cyCreateSizes' );
            adminSizesPage.enterSizeName( 'cyUpdatedSizes' );
            adminSizesPage.clickOnSubmitButton( storeId, sizeId );
        } );
        it( 'User update Sizes Value', () =>
        {
            cy.step( 'Going to sizes from navigation tab' );
            cy.visit( `/${storeId}/sizes` );
            const sizeId = Cypress.env( 'sizeId' );
            adminSizesPage.actionModifySize( 'cyUpdatedSizes' );
            adminSizesPage.enterSizeValue( 'cyUpdatedValue' );
            adminSizesPage.clickOnSubmitButton( storeId, sizeId );
        } );
        it( 'User Delete Sizes', () =>
        {
            cy.step( 'Going to sizes from navigation tab' );
            cy.visit( `/${storeId}/sizes` );
            adminSizesPage.actionDeleteSize( 'cyUpdatedSizes' );
        } );
        it.only( 'User create Sizes without sizes name', () =>
        {
            cy.step( 'Going to sizes from navigation tab' );
            cy.visit( `/${storeId}/sizes/new` );

            adminSizesPage.enterSizeName( 'noValue' );
            adminSizesPage.formErrorValidation( 'Value must be at least 3 characters long' );

        } );
        it.only( 'User create Sizes without vale', () =>
        {
            cy.step( 'Going to sizes from navigation tab' );
            cy.visit( `/${storeId}/sizes/new` );

            adminSizesPage.enterSizeValue( 'noNme' );
            adminSizesPage.formErrorValidation( 'Name must be at least 3 characters long' );

        } );
        it.only( 'User create Sizes with 2 characters Name', () =>
        {
            cy.step( 'Going to sizes from navigation tab' );
            cy.visit( `/${storeId}/sizes/new` );
            adminSizesPage.enterSizeName( 'cy' );
            adminSizesPage.enterSizeValue( 'LessThenThree' );
            adminSizesPage.formErrorValidation( 'Name must be at least 3 characters long' );

        } );

    } );



} );
