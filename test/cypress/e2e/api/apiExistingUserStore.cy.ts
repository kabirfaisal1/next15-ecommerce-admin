import { TestList, TestData } from './testData/existingUserStore_data';
import { createRequestBody } from '@support/utilities/globalHelpers';

/**
 * Perform an API request for a given test case.
 * 
 * @param test - The test case data containing endpoint, method, expected response, etc.
 * @param token - The authentication token retrieved from login.
 */
const performAPIRequest = ( test: TestData, token: string ) =>
{
    cy.step( `Running test case: ${test.testDescription}` );

    // Generate the API endpoint dynamically based on the test case data
    cy.generateAPIEndpoint( 'stores', test.endpoint, test.queryUser, 'DESC' ).then( ( resolvedEndpoint ) =>
    {
        cy.step( `Resolved API endpoint: ${resolvedEndpoint}` );

        // Create the request body if request keys and values are provided
        const requestBody = test.requestKeys?.length && test.requestValues?.length
            ? createRequestBody( test.requestKeys, test.requestValues )
            : null;

        // Execute the API request
        cy.request( {
            method: test.method as Cypress.HttpMethod, // Dynamically set HTTP method (GET, POST, PATCH, DELETE, etc.)
            url: resolvedEndpoint, // Use the dynamically resolved endpoint
            body: requestBody, // Include request body only if applicable
            headers: {
                'Content-Type': 'application/json', // Ensure correct content type
                Authorization: `Bearer ${token}`, // Attach authentication token
            },
            failOnStatusCode: false, // Prevent Cypress from failing on non-2xx status codes
        } ).then( ( response ) =>
        {
            // Validate response status code against the expected status
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

// Main test suite for Store API tests
describe( 'Existing Admin User Adding Store', () =>
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
        cy.visit( '/' ); // Navigate to the homepage
        cy.loginToAuth0( 'Regular' ); // Log in as a "Regular" user

        cy.step( 'Retrieving authentication tokens' );
        cy.getTokens().then( ( clerkToken: string ) =>
        {
            token = clerkToken; // Store retrieved token for use in API requests
        } );
    } );

    /**
     * API Test context: Runs all store-related API tests.
     */
    context( 'Billboards API Test', () =>
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
