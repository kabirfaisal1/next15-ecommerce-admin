import { TestList } from './testData/existingUserStore_data';
import { createRequestBody } from '../../support/utilities/globalHelpers';

describe( 'Existing Admin User adding store', () =>
{
    let token = '';

    beforeEach( () =>
    {
        // Navigate to the base URL and log in
        cy.visit( '/' );
        cy.loginToAuth0( 'Regular' );

        // Fetch and store the authentication token
        cy.step( 'Retrieving authentication tokens' );
        cy.getTokens().then( ( clerkToken ) =>
        {
            token = clerkToken;
        } );
    } );

    // Loop through each test in the TestList
    TestList.forEach( ( test ) =>
    {
        it( test.testDescription, () =>
        {
            cy.step( `Running test case: ${test.testDescription}` );

            // Resolve the API endpoint dynamically
            cy.generateStoreAPIEndpoint( test.endpoint, test.queryUser, 'DESC' ).then( ( resolvedEndpoint ) =>
            {
                cy.step( `Resolved API endpoint: ${resolvedEndpoint}` );

                // Create the request body if keys and values are provided
                const requestBody = test.requestKeys?.length && test.requestValues?.length
                    ? createRequestBody( test.requestKeys, test.requestValues )
                    : null;

                // Perform the API request
                cy.request( {
                    method: test.method as Cypress.HttpMethod,
                    url: resolvedEndpoint,
                    body: requestBody,
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                } ).then( ( response ) =>
                {
                    cy.step( `Validate response status: ${test.expectedStatus}` );
                    expect( response.status ).to.equal( test.expectedStatus );

                    const data = response.body;

                    if ( data )
                    {
                        cy.validateStoreResponseBody( data, test );
                    } else
                    {
                        cy.step( 'No data returned in the response body to validate' );
                    }
                } );
            } );
        } );
    } );
} );
