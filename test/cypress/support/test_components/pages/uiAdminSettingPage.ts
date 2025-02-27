/**
 * A Page Object Model for the Admin Settings page.
 */
class AdminSettingPage
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

    /**
     * Navigates to the settings page and verifies the store ID in the URL.
     * @param {string} storeId - The store ID to verify in the URL.
     */
    goToSetting ( storeId: string )
    {
        cy.step( 'Click on navigation menu for Setting' );
        cy.navigateTabItem( 'Settings' );
        cy.step( 'Checking URL to include store ID' );
        cy.url().should( 'include', storeId );
    }

    /**
     * Updates the store name in the input field.
     * @param {string} storeName - The new store name to enter.
     */
    updateStoreName ( storeName: string )
    {
        cy.step( `Updating store Name: ${storeName}` );
        this.elements.setting_FormNameInputField()
            .should( 'be.visible' )
            .clear()
            .type( storeName )
            .should( 'have.value', storeName );
    }

    /**
     * Clicks on the Save button to save the updated store name.
     */
    clickOnSaveButton ()
    {
        cy.step( 'Clicking on store name Save button' );
        this.elements.settingForm_ContinueButton()
            .should( 'be.visible' )
            .should( 'have.text', 'Save Changes' )
            .click();
    }

    /**
     * Verifies the API alert section for the correct store ID.
     * @param {string} storeId - The expected store ID to check in the API alert.
     */
    verifyAPIAlert ( storeId: string )
    {
        cy.step( 'Verifying API Alert Header' );
        this.elements.settingAPI_Alert()
            .should( 'be.visible' )
            .should( 'have.text', 'NEXT_PUBLIC_API_URL' )
            .click();

        cy.step( 'Verifying API Alert URI' );
        this.elements.settingAPI_AlertURI()
            .should( 'be.visible' )
            .should( 'have.text', storeId );
    }

    /**
     * Verifies that the clipboard button correctly copies the store ID.
     * @param {string} storeId - The expected store ID to be copied.
     */
    verifyAlertClipboardButton ( storeId: string )
    {
        cy.step( 'Verifying API Alert Clipboard Button' );
        this.elements.settingAPI_AlertClipboard().should( 'be.visible' ).click();
        cy.assertValueCopiedToClipboard( storeId );
    }

    /**
     * Clicks the delete store button and confirms or cancels the deletion.
     * @param {boolean} confirm - Whether to confirm (`true`) or cancel (`false`) the deletion.
     */
    deleteStore ( confirm: boolean )
    {
        cy.step( 'Clicking on Trash Button' );
        this.elements.store_DeleteButton().should( 'be.visible' ).click();
        cy.deleteObjects( confirm );
    }

    /**
     * Verifies the error message when the store name is not provided.
     * @param {string} expectedError - The expected error message.
     */
    noNameError ( expectedError: string )
    {
        cy.step( `Verifying store name error: ${expectedError}` );
        this.elements.form_ErrorMessage()
            .should( 'be.visible' )
            .and( 'have.text', expectedError );
    }
}

export default AdminSettingPage;
