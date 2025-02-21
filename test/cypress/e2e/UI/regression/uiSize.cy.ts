import AdminSizesPage from '@support/test_components/pages/uiAdminSizesPage';

const storeId = '00ea910b-ecf0-4d1e-bcb6-5cb72313bb46';
const adminSizesPage = new AdminSizesPage();

describe( 'Store Sizes Management', () =>
{
    before( () =>
    {
        cy.visit( '/' );
        cy.loginToAuth0( 'Regular' );
    } );

    context( 'Store Size Admin Workflow UI', () =>
    {
        it.only( 'User navigates to Sizes', () =>
        {
            cy.step( 'Navigating to Sizes tab' );
            cy.navigateTabItem( 'Sizes' );
        } );

        it( 'User creates a new Size', () =>
        {
            cy.step( 'Navigating to Sizes page' );
            cy.visit( `/${storeId}/sizes` );

            adminSizesPage.clickOnAddSizeButton( storeId );
            adminSizesPage.enterSizeName( 'cyCreateSizes' );
            adminSizesPage.enterSizeValue( 'cyCreateSmall' );
            adminSizesPage.clickOnSubmitButton( storeId );
        } );

        it( 'User updates Size Name', () =>
        {
            cy.step( 'Navigating to Sizes page' );
            cy.visit( `/${storeId}/sizes` );

            const sizeId = Cypress.env( 'sizeId' );
            adminSizesPage.actionModifySize( 'cyCreateSizes' );
            adminSizesPage.enterSizeName( 'cyUpdatedSizes' );
            adminSizesPage.clickOnSubmitButton( storeId, sizeId );
        } );

        it( 'User updates Size Value', () =>
        {
            cy.step( 'Navigating to Sizes page' );
            cy.visit( `/${storeId}/sizes` );

            const sizeId = Cypress.env( 'sizeId' );
            adminSizesPage.actionModifySize( 'cyUpdatedSizes' );
            adminSizesPage.enterSizeValue( 'cyUpdatedValue' );
            adminSizesPage.clickOnSubmitButton( storeId, sizeId );
        } );

        it( 'User deletes a Size', () =>
        {
            cy.step( 'Navigating to Sizes page' );
            cy.visit( `/${storeId}/sizes` );

            adminSizesPage.actionDeleteSize( 'cyUpdatedSizes' );
        } );

        context( 'Error Validation Tests', () =>
        {
            it( 'Fails when creating a Size without a Size Value', () =>
            {
                cy.step( 'Navigating to new Size form' );
                cy.visit( `/${storeId}/sizes/new` );

                adminSizesPage.enterSizeName( 'noValue' );
                adminSizesPage.formErrorValidation( 'Value must be at least 3 characters long' );
            } );

            it( 'Fails when creating a Size without a Name', () =>
            {
                cy.step( 'Navigating to new Size form' );
                cy.visit( `/${storeId}/sizes/new` );

                adminSizesPage.enterSizeValue( 'noNme' );
                adminSizesPage.formErrorValidation( 'Name must be at least 3 characters long' );
            } );

            it( 'Fails when creating a Size with a 2-character Name', () =>
            {
                cy.step( 'Navigating to new Size form' );
                cy.visit( `/${storeId}/sizes/new` );

                adminSizesPage.enterSizeName( 'cy' );
                adminSizesPage.enterSizeValue( 'LessThanThree' );
                adminSizesPage.formErrorValidation( 'Name must be at least 3 characters long' );
            } );

            it( 'Fails when creating a Size Value > 15 characters', () =>
            {
                cy.step( 'Navigating to new Size form' );
                cy.visit( `/${storeId}/sizes/new` );

                adminSizesPage.enterSizeName( 'cyBoundary' );
                adminSizesPage.enterSizeValue( 'thisIsCypressTest' );
                adminSizesPage.formErrorValidation( 'Value must not exceed 15 characters' );
            } );
        } );
    } );
} );
