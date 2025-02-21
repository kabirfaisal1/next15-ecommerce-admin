/**
 * A Page Object Model for the Store Form modal.
 */
class StoreForm
{
    elements: { [ key: string ]: () => Cypress.Chainable; } = {
        modal_DialogTitle: () => cy.get( '[data-testid="modal_DialogTitle"]' ),
        modal_DialogDescription: () => cy.get( '[data-testid="modal_DialogDescription"]' ),
        storeModal_FormLabel: () => cy.get( '[data-testid="storeModal-FormLabel"]' ),
        storeModal_InputField: () => cy.get( '[data-testid="storeModal-FormInput"]' ),
        form_ContinueButton: () => cy.get( '[data-testid="form-ContinueButtons"]' ),
        form_CancelButton: () => cy.get( '[data-testid="form-CancelButtons"]' ),
        form_ErrorMessage: () => cy.get( '[data-testid="FormMessage"]' ),
    };

    /**
     * Verifies the modal title for the Store Form.
     */
    verifyModalDialogTitle ()
    {
        cy.step( 'Verifying Store form title' );
        this.elements.modal_DialogTitle()
            .should( 'be.visible' )
            .and( 'have.text', 'Create Store' );
    }

    /**
     * Verifies the modal description for the Store Form.
     */
    verifyModalDescription ()
    {
        cy.step( 'Verifying Store form description' );
        this.elements.modal_DialogDescription()
            .should( 'be.visible' )
            .and( 'have.text', 'Add a new store to manage products and categories' );
    }

    /**
     * Verifies the label of the Store Form input field.
     */
    verifyStoreFormLabel ()
    {
        cy.step( 'Verifying Store form label' );
        this.elements.storeModal_FormLabel()
            .should( 'be.visible' )
            .and( 'have.text', 'Name' );
    }

    /**
     * Enters a store name into the input field.
     * @param {string} storeName - The name of the store to enter.
     */
    enterStoreName ( storeName: string )
    {
        cy.step( `Entering store Name: ${storeName}` );
        this.elements.storeModal_InputField()
            .should( 'be.visible' )
            .type( storeName )
            .should( 'have.value', storeName );
    }

    /**
     * Clicks on the Continue button to proceed with store creation.
     */
    clickOnContinueButton ()
    {
        cy.step( 'Clicking on store form continue button' );
        this.elements.form_ContinueButton()
            .should( 'be.visible' )
            .should( 'have.text', 'Continue' )
            .click();
    }

    /**
     * Clicks on the Cancel button to exit store creation.
     */
    clickOnCancelButton ()
    {
        cy.step( 'Clicking on store form cancel button' );
        this.elements.form_CancelButton()
            .should( 'be.visible' )
            .should( 'have.text', 'Cancel' )
            .click();
    }

    /**
     * Verifies the error message displayed when no store name is entered.
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

export default StoreForm;
