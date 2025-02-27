import AdminColorsPage from '@support/test_components/pages/uiAdminColorsPage';

const storeId = '00ea910b-ecf0-4d1e-bcb6-5cb72313bb46';
const adminColorsPage = new AdminColorsPage();

describe( 'Store Colors Management', () =>
{
    beforeEach( () =>
    {
        cy.visit( '/' );
        cy.loginToAuth0( 'Regular' );
    } );

    context( 'Store Color Admin Workflow UI', () =>
    {
        it( 'User navigates to Colors', () =>
        {
            cy.step( 'Navigating to Colors tab' );
            cy.navigateTabItem( 'Colors' );
        } );

        it( 'User creates a new Color', () =>
        {
            cy.step( 'Navigating to Colors page' );
            cy.visit( `/${storeId}/colors` );

            adminColorsPage.clickOnAddColorButton( storeId );
            adminColorsPage.enterColorName( 'cyCreateGreen' );
            adminColorsPage.enterColorValue( '#809D3C' );
            adminColorsPage.clickOnSubmitButton( storeId );
        } );

        it( 'User updates Color Name', () =>
        {
            cy.step( 'Navigating to Colors page' );
            cy.visit( `/${storeId}/colors` );

            const colorId = Cypress.env( 'colorId' );
            adminColorsPage.actionModifyColor( 'cyCreateGreen' );
            adminColorsPage.enterColorName( 'cyUpdateSage' );
            adminColorsPage.clickOnSubmitButton( storeId, colorId );
        } );

        it( 'User updates Color Value', () =>
        {
            cy.step( 'Navigating to Colors page' );
            cy.visit( `/${storeId}/colors` );

            const colorId = Cypress.env( 'colorId' );
            adminColorsPage.actionModifyColor( 'cyUpdateSage' );
            adminColorsPage.enterColorValue( '#8D77AB' );
            adminColorsPage.clickOnSubmitButton( storeId, colorId );
        } );

        it( 'User deletes a Color', () =>
        {
            cy.step( 'Navigating to Colors page' );
            cy.visit( `/${storeId}/colors` );

            adminColorsPage.actionDeleteColor( 'cyUpdateSage' );
        } );

        context( 'Error Validation Tests', () =>
        {
            it( 'Fails when creating a Color without a Color Value', () =>
            {
                cy.step( 'Navigating to new Color form' );
                cy.visit( `/${storeId}/colors/new` );

                adminColorsPage.enterColorName( 'noValue' );
                adminColorsPage.formErrorValidation( 'Value must be at least 4 characters long' );
            } );

            it( 'Fails when creating a Color without a Name', () =>
            {
                cy.step( 'Navigating to new Color form' );
                cy.visit( `/${storeId}/colors/new` );

                adminColorsPage.enterColorValue( 'noNme' );
                adminColorsPage.formErrorValidation( 'Name must be at least 3 characters long' );
            } );

            it( 'Fails when creating a Color with a 2-character Name', () =>
            {
                cy.step( 'Navigating to new Color form' );
                cy.visit( `/${storeId}/colors/new` );

                adminColorsPage.enterColorName( 'cy' );
                adminColorsPage.enterColorValue( '#F29F58' );
                adminColorsPage.formErrorValidation( 'Name must be at least 3 characters long' );
            } );

            it( 'Fails when creating a Color without value hex code (#)', () =>
            {
                cy.step( 'Navigating to new Color form' );
                cy.visit( `/${storeId}/colors/new` );

                adminColorsPage.enterColorName( 'withOut#' );
                adminColorsPage.enterColorValue( 'F29F58' );
                adminColorsPage.formErrorValidation( 'Value must be a valid hex code (e.g., #FFFFFF). For more help, visit https://colorhunt.co/' );
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
