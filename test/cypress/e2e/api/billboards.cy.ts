import { TestList } from './testData/billborads_data';
import { createRequestBody } from '../../support/utilities/globalHelpers';


describe( 'User Test billboards', () =>
{
    let token: string = '';

    beforeEach( () =>
    {
        // Navigate to the base URL of the application
        cy.visit( '/' );

        // Log in to the application using the Auth0 login method with the "Regular" user
        cy.loginToAuth0( "Regular" );

        // Retrieve the authentication tokens after logging in
        cy.step( 'Retrieving authentication tokens' );
        cy.getTokens().then( ( clerkToken: string ) =>
        {
            // Store the retrieved token in the `token` variable for later use
            token = clerkToken;
        } );
    } );

    TestList.forEach( ( test ) =>
    {
        it( test.testDescription, () =>
        {
            // Declare a variable to hold the request body (if applicable)
            let requestBody: Record<string, unknown> | null = null;

            // Dynamically resolve the endpoint using the custom Cypress command
            cy.generateBillboardAPIEndpoint( test.endpoint, test.queryStoreid, "DESC" ).then( ( resolvedEndpoint ) =>
            {
                // Log the resolved endpoint for debugging
                cy.step( `Performing API request to: ${resolvedEndpoint}` );

                // If both keys and values for the request body are provided, generate the request body
                if ( test.requestKeys?.length && test.requestValues?.length )
                {
                    requestBody = createRequestBody( test.requestKeys, test.requestValues );
                }

                // Perform the API request with the dynamically resolved endpoint
                cy.request( {
                    method: test.method as Cypress.HttpMethod, // Specify the HTTP method dynamically
                    url: resolvedEndpoint,                    // Use the resolved endpoint
                    body: requestBody,                        // Include the request body (if applicable)
                    headers: {
                        'Content-Type': 'application/json',   // Set the content type
                        Authorization: `Bearer ${token}`,     // Include the authorization token
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
