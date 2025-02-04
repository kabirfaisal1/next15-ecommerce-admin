
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

    verifyModalDialogTitle ()
    {
        cy.step( 'Verifying Store form' );
        this.elements.modal_DialogTitle().should( 'be.visible' ).and( 'have.text', 'Create Store' );
    }

    verifyModalDescription ()
    {
        cy.step( 'Verifying Store form description' );
        this.elements.modal_DialogDescription().should( 'be.visible' ).and( 'have.text', 'Add a new store to manage products and categories' );
    }

    verifyStoreFormLabel ()
    {
        cy.step( 'Verifying Store form label' );
        this.elements.storeModal_FormLabel().should( 'be.visible' ).and( 'have.text', 'Name' );
    }
    enterStoreName ( storeName: string )
    {
        cy.step( `Entering store Name ${storeName}` );
        this.elements.storeModal_InputField().should( 'be.visible' ).type( storeName ).should( 'have.value', storeName );
    }
    clickOnContinueButton ()
    {
        cy.step( 'Clicking on store form continue button' );
        this.elements.form_ContinueButton().should( 'be.visible' ).should( 'have.text', 'Continue' ).click();
    }
    clickOnCancelButton ()
    {
        cy.step( 'Clicking on store form cancel button' );
        this.elements.form_CancelButton().should( 'be.visible' ).should( 'have.text', 'Cancel' ).click();
    }
    noNameError ( expectedError: string ) 
    {
        cy.step( `Verifying store name error: ${expectedError}` );
        this.elements.form_ErrorMessage().should( 'be.visible' ).and( 'have.text', expectedError );
    }

}

export default StoreForm;

