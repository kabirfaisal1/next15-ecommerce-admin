import { TestList, TestData } from '@fixtures/aipTestData/categories_data';
import { createRequestBody } from '@support/utilities/globalHelpers';


/**
 * Performs an API request for a given test case.
 * 
 * @param test - The test case data containing endpoint, method, expected response, etc.
 * @param token - The authentication token retrieved from login.
 */
const performAPIRequest = ( test: TestData, token: string ) =>
{
    // Initialize requestBody as null, will be populated if needed
    let requestBody: Record<string, unknown> | null = null;

    // Generate the API endpoint dynamically based on the test case data
    cy.generateAPIEndpoint( 'categories', test.endpoint, test.queryStoreid, 'DESC' ).then( ( resolvedEndpoint ) =>
    {
        cy.step( `Performing API request to: ${resolvedEndpoint}` );

        // If request body keys and values are provided, generate the request body dynamically
        if ( test.requestKeys?.length && test.requestValues?.length )
        {
            requestBody = createRequestBody( test.requestKeys, test.requestValues );
        }

        // Execute the API request
        cy.request( {
            method: test.method as Cypress.HttpMethod, // Dynamically assign the HTTP method (GET, POST, PATCH, DELETE, etc.)
            url: resolvedEndpoint, // Use the dynamically resolved endpoint
            body: requestBody, // Include request body only if applicable
            headers: {
                'Content-Type': 'application/json', // Ensure the request is sent as JSON
                Authorization: `Bearer ${token}`, // Attach authorization token for authentication
            },
            failOnStatusCode: false, // Prevent Cypress from failing on non-2xx status codes
        } ).then( ( response ) =>
        {
            // Validate the response status code against the expected status
            cy.step( `Validate response status: ${test.expectedStatus}` );
            expect( response.status ).to.equal( test.expectedStatus );

            // If the response contains a body, validate it against expected test results
            if ( response.body )
            {
                cy.validateResponseBody( response.body, test );
            } else
            {
                cy.step( 'No data returned in the response body to validate' );
            }
        } );
    } );
};

// Main test suite for Billboard API tests
describe( 'User Test Category', () =>
{
    let token: string = ''; // Variable to store authentication token

    /**
     * Before each test, perform the following setup:
     * 1. Visit the application homepage.
     * 2. Log in using Auth0 authentication.
     * 3. Retrieve an authentication token.
     */
    beforeEach( () =>
    {
        cy.visit( '/' ); // Navigate to the application homepage
        cy.loginToAuth0( 'Regular' ); // Log in as a "Regular" user

        cy.step( 'Retrieving authentication tokens' );
        cy.getTokens().then( ( clerkToken: string ) =>
        {
            token = clerkToken; // Store retrieved token for use in API requests
        } );
    } );

    /**
     * API Test context: Runs all billboard-related API tests.
     */
    context( 'Categories API Test', () =>
    {
        // Check if any test is marked as `only`
        const hasOnlyTests = TestList.some( ( test ) => test.testRunner === 'only' );

        TestList.forEach( ( test ) =>
        {
            // Determine which Cypress test function to use
            let testRunner = it;
            if ( test.testRunner === 'skip' ) testRunner = it.skip;
            if ( hasOnlyTests && test.testRunner !== 'only' ) testRunner = it.skip;
            if ( test.testRunner === 'only' ) testRunner = it.only;

            testRunner( test.testDescription, () =>
            {
                performAPIRequest( test, token );
            } );
        } );
    } );
} );
