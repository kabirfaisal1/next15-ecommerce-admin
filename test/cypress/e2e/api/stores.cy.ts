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
            // Dynamically resolve endpoint if needed
            cy.formatEndpoint( test.endpoint ).then( ( resolvedEndpoint ) =>
            {
                // Generate the request body
                const requestBody = createRequestBody( test.requestKeys, test.requestValues );

                // Perform the API request
                cy.request( {   // Use object literal to ensure correct typing  
                    method: test.method as Cypress.HttpMethod, // Now correctly typed
                    url: resolvedEndpoint,
                    body: requestBody,
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                }).then( ( response ) =>
                {
                    // Validate response status
                    cy.step( `Validate response status: ${test.expectedStatus}` );
                    expect( response.status ).to.equal( test.expectedStatus );

                    // Validate response body
                    if ( test.expectedResponseKeys )
                    {
                        test.expectedResponseKeys.forEach( ( key ) =>
                        {
                            expect( response.body ).to.have.property( key );
                        } );
                    }
                } );
            } );
        } );
    } );
} );
