// Import the list of test cases and their type definitions
import { TestList, TestData } from '@fixtures/aipTestData/billborads_data';
import { createRequestBody } from '@support/utilities/globalHelpers';

/**
 * Performs an API request for a given test case.
 * 
 * @param test - The test case data containing endpoint, method, expected response, etc.
 * @param token - The authentication token retrieved from login.
 */
const performAPIRequest = ( test: TestData, token: string ) =>
{
    let requestBody: Record<string, unknown> | null = null;

    cy.generateAPIEndpoint( 'billboards', test.endpoint, test.queryStoreid, 'DESC' ).then( ( resolvedEndpoint ) =>
    {
        cy.step( `Performing API request to: ${resolvedEndpoint}` );

        if ( test.requestKeys?.length && test.requestValues?.length )
        {
            requestBody = createRequestBody( test.requestKeys, test.requestValues );
        }

        cy.request( {
            method: test.method as Cypress.HttpMethod,
            url: resolvedEndpoint,
            body: requestBody,
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            failOnStatusCode: false,
        } ).then( ( response ) =>
        {
            cy.step( `Validate response status: ${test.expectedStatus}` );
            expect( response.status ).to.equal( test.expectedStatus );

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
describe( 'User Test Billboards', () =>
{
    let token: string = '';

    beforeEach( () =>
    {
        cy.visit( '/' );
        cy.loginToAuth0( 'Regular' );

        cy.step( 'Retrieving authentication tokens' );
        cy.getTokens().then( ( clerkToken: string ) =>
        {
            token = clerkToken;
        } );
    } );

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
