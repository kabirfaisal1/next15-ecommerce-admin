import { TestList } from './testData/newUserStore_data';
import { createRequestBody } from '../../support/utilities/globalHelpers';

describe( 'New Admin User with no store', () =>
{
    let token: string = '';

    beforeEach( () =>
    {
        // Navigate to the base URL of the application
        cy.visit( '/' );

        // Log in to the application using the Auth0 login method with the "No Store" user
        cy.loginToAuth0( "No Store" );

        // Retrieve the authentication tokens after logging in
        cy.step( 'Retrieving authentication tokens' );
        cy.getTokens().then( ( clerkToken: string ) =>
        {
            // Store the retrieved token in the `token` variable for later use
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
                    // Validate the response status matches the expected status
                    cy.step( `Validate response status: ${test.expectedStatus}` );
                    expect( response.status ).to.equal( test.expectedStatus );

                    // Extract the response body data
                    const data = response.body;

                    // If the response body contains data, validate it
                    if ( data )
                    {
                        cy.validateStoreResponseBody( data, test );
                    } else
                    {
                        // Log a step if there is no data to validate
                        cy.step( 'No data returned in the response body to validate' );
                    }
                } );
            } );
        } );
    } );
} );
