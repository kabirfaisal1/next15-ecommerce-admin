
class AdminBillboardPage
{
    elements: { [ key: string ]: () => Cypress.Chainable; } = {

        store_DeleteButton: () => cy.get( '[data-testid="store-delete-button"]' ),
        setting_FormNameInputField: () => cy.get( '[data-testid="setting-FormNameInput"]' ),
        settingForm_ContinueButton: () => cy.get( '[data-testid="settingForm-ContinueButtons"]' ),
        settingAPI_Alert: () => cy.get( '[data-testid="api-alert_NEXT_PUBLIC_API_URL"]' ),
        settingAPI_AlertURI: () => cy.get( '[data-testid="api-alert_uri"]' ),
        settingAPI_AlertClipboard: () => cy.get( '[data-testid="api-alert_copyButton"]' ),
        form_ErrorMessage: () => cy.get( '[data-testid="FormMessage"]' ),
    };

    goToSetting ( storeId: string )
    {
        cy.step( 'Click on navigation menu for Setting' );
        cy.navigateTabItem( 'Settings' );
        cy.step( 'Checking URL to include userID' );
        cy.url().should( 'include', storeId );
    }

    updateStoreName ( storeName: string )
    {
        cy.step( `Updating store Name ${storeName}` );
        this.elements.setting_FormNameInputField().should( 'be.visible' ).clear().type( storeName ).should( 'have.value', storeName );
    }
    clickOnSaveButton ()
    {
        cy.step( 'Clicking on store name Save button' );
        this.elements.settingForm_ContinueButton().should( 'be.visible' ).should( 'have.text', 'Save Changes' ).click();
    }
    verifyAPIAlert ( storeId: string )
    {
        cy.step( 'Verifying API Alert Header' );
        this.elements.settingAPI_Alert().should( 'be.visible' ).should( 'have.text', 'NEXT_PUBLIC_API_URL' ).click();
        cy.step( 'Verifying API Alert URI' );
        this.elements.settingAPI_Alert().should( 'be.visible' ).should( 'have.text', storeId ).click();
    }
    verifyAlertClipboardButton ( storeId: string )
    {
        cy.step( 'Verifying API Alert Header' );
        this.elements.settingAPI_AlertClipboard().should( 'be.visible' ).click();
        cy.assertValueCopiedToClipboard( storeId );

    }
    deleteStore ( confirm: boolean ) 
    {
        cy.step( `Clicking on Trash Button` );
        this.elements.store_DeleteButton().should( 'be.visible' ).click();
        cy.deleteObjects( confirm );
    }
    noNameError ( expectedError: string ) 
    {
        cy.step( `Verifying store name error: ${expectedError}` );
        this.elements.form_ErrorMessage().should( 'be.visible' ).and( 'have.text', expectedError );
    }

}

export default AdminBillboardPage;

