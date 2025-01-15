import StoreForm from '../../components/modal-dialog/create_storeModal';

const storeForm = new StoreForm();
describe( 'Google', () =>
{
    beforeEach( () =>
    {
        // Visit the base URL set in your configuration
        cy.visit( '/' );

        cy.loginToAuth0();

    } );

    it( 'Create store for first time', () =>
    {

        storeForm.verifyModalDialogTitle();
        storeForm.verifyModalDescription();
        storeForm.verifyStoreFormLabel();
    } );
} );
