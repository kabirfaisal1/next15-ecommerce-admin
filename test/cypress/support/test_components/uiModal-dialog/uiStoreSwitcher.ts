/**
 * A Page Object Model for the Store Switcher component.
 */
class StoreSwitcher
{
    elements: { [ key: string ]: () => Cypress.Chainable; } = {
        storeSwitcherDropDown: () => cy.get( '[data-testid="store_switcher_trigger"]' ),
        storeSearch: () => cy.get( '[data-testid="store_switcher_input"]' ),
        storeList: () => cy.get( '[data-testid="store_switcher_group"]' ),
        createStoreButton: () => cy.get( '[data-value="Create Store"]' ),
        storeSearchInputError: () => cy.get( '[data-testid="store_switcher_input_error"]' ),
    };

    /**
     * Clicks on the store switcher dropdown and verifies that the list is visible.
     */
    clickOnStoreDropDown ()
    {
        cy.step( 'Click on storeSwitcherDropDown' );
        this.elements.storeSwitcherDropDown().should( 'be.visible' ).click();
        cy.step( 'Verify storeSwitcherDropDown is opened' );
        this.elements.storeList().should( 'be.visible' );
    }

    /**
     * Searches for a store by typing the given store name.
     * @param {string} storeName - The name of the store to search for.
     */
    searchForStore ( storeName: string )
    {
        cy.step( 'Searching for store' );
        this.elements.storeSearch()
            .should( 'be.visible' )
            .type( storeName )
            .should( 'have.value', storeName );
    }

    /**
     * Selects a store from the list based on the store name.
     * @param {string} storeName - The name of the store to select.
     */
    selectStore ( storeName: string )
    {
        cy.step( `Select Store ${storeName}` );
        this.elements.storeList()
            .should( 'be.visible', { timeout: 200 } )
            .find( `[data-value="${storeName.toUpperCase()}"]` )
            .should( 'have.text', storeName.toUpperCase() )
            .click();
        cy.step( 'Verify store name is updated in the store Switcher' );
        this.elements.storeSwitcherDropDown()
            .should( 'be.visible' )
            .and( 'have.text', storeName.toUpperCase() );
    }

    /**
     * Verifies the error message displayed on the store search input.
     * @param {string} storeError - The expected error message.
     */
    verifySearchStoreError ( storeError: string )
    {
        cy.step( 'verify Search Store Error' );
        this.elements.storeSearchInputError()
            .should( 'be.visible' )
            .should( 'have.text', storeError );
    }
}

export default StoreSwitcher;
