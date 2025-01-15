
class StoreForm
{
    elements: { [ key: string ]: () => Cypress.Chainable; } = {
        modal_DialogTitle: () => cy.get( '[data-testid="modal_DialogTitle"]' ),
        modal_DialogDescription: () => cy.get( '[data-testid="modal_DialogDescription"]' ),
        storeModal_FormLabel: () => cy.get( '[data-testid="storeModal-FormLabel"]' ),
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
}

export default StoreForm;

