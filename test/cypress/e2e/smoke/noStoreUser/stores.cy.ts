import StoreForm from '../../../components/modal-dialog/create_storeModal';


const storeForm = new StoreForm();
describe( 'Google', () =>
{
    beforeEach( () =>
    {

        // Visit the base URL set in your configuration
        cy.visit( '/' );



    } );

    it( 'Create store for first time', () =>
    {
        cy.loginToAuth0();
        storeForm.verifyModalDialogTitle();
        storeForm.verifyModalDescription();
        storeForm.verifyStoreFormLabel();
    } );
} );
