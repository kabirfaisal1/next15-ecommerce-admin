
class StoreSwitcher
{
    elements: { [ key: string ]: () => Cypress.Chainable; } = {
        storeSwitcherDropDown: () => cy.get( '[data-testid="store_switcher_trigger"]' ),
        storeSearch: () => cy.get( '[data-testid="store_switcher_input"]' ),
        storeList: () => cy.get( '[data-testid="store_switcher_group"]' ),
        createStoreButton: () => cy.get( '[data-value="Create Store"]' ),
        storeSearchInputError: () => cy.get( '[data-testid="store_switcher_input_error"]' ),

    };

    clickOnStoreDropDown ()
    {
        cy.step( 'Click on storeSwitcherDropDown' );
        this.elements.storeSwitcherDropDown().should( 'be.visible' ).click();
        cy.step( 'Verify storeSwitcherDropDown is opened' );
        this.elements.storeList().should( 'be.visible' );
    }

    searchForStore ( storeName: string )
    {
        cy.step( 'Searching for store' );
        this.elements.storeSearch().should( 'be.visible' ).type( storeName ).should( 'have.value', storeName );

    }

    selectStore ( storeName: string )
    {
        cy.step( `Select Store ${storeName}` );
        this.elements.storeList().should( 'be.visible', { timeout: 200 } ).find( `[data-value="${storeName.toUpperCase()}"]` ).should( 'have.text', storeName.toUpperCase() ).click();
        cy.step( 'Verify store name is updated in the store Switcher' );
        this.elements.storeSwitcherDropDown().should( 'be.visible' ).and( 'have.text', storeName.toUpperCase() );

    }
    verifySearchStoreError ( storeError: string )
    {
        cy.step( 'verify Search Store Error' );
        this.elements.storeSearchInputError().should( 'be.visible' ).should( 'have.text', storeError );
    }

}

export default StoreSwitcher;

