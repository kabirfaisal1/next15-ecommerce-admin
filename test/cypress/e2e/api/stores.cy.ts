
import { TestList } from './testData/createStore_data';
import { createRequestBody } from '../../support/utilities/globalHelpers';


describe( 'API Tests', () =>
{
    let token: string = '';

    beforeEach( () =>
    {
        cy.visit( '/' );
        cy.loginToAuth0();
        cy.getTokens().then( ( clerkToken: string ) =>
        {
            token = clerkToken;
        } );
    } );

    TestList.forEach( ( test ) =>
    {
        it( test.testDescription, () =>
        {
            // Generate the request body using the utility function
            const requestBody = createRequestBody( test.requestKeys, test.requestValues );

            // Perform the API request
            cy.request( {
                method: 'POST',
                url: '/api/stores', // Replace with your endpoint
                body: requestBody,
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                }
            } ).then( ( response ) =>
            {
                // Validate response status
                cy.step( `Validate response status ${test.expectedResponseKeys}` );
                expect( response.status ).to.equal( test.expectedStatus );

                if ( test.expectedResponseKeys )
                {
                    cy.step( `Validate response keys if provided: ${test.expectedResponseKeys}` );
                    test.expectedResponseKeys.forEach( ( key ) =>
                    {
                        expect( response.body ).to.have.property( key );
                    } );
                }
                if ( test.expectedResponseStoreName )
                {
                    cy.step( `Validate response Store Name ${test.expectedResponseStoreName}` );
                    expect( response.body.name ).to.equal( test.expectedResponseStoreName );
                }

                if ( test.expectedResponseStoreId === false )
                {
                    cy.step( `Validate response Store Id IsNull: ${test.expectedResponseStoreId}` );
                    expect( response.body.id ).to.not.be.empty;
                }

                if ( test.expectedResponseUseId === true || !test.expectedResponseUseId )
                {
                    cy.step( `Validate response user Id  ${test.expectedResponseUseId}` );
                    expect( response.body.userId ).to.equal( test.expectedResponseUseId );
                }
            } );
        } );
    } );
} );


