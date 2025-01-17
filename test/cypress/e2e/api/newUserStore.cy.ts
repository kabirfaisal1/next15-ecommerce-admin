import { TestList } from './testData/newUserStore_data';
import { createRequestBody } from '../../support/utilities/globalHelpers';

describe( 'New Admin User with no store', () =>
{
    let token: string = '';

    beforeEach( () =>
    {
        cy.visit( '/' );
        cy.loginToAuth0( "No Store" );
        cy.getTokens().then( ( clerkToken: string ) =>
        {
            token = clerkToken;
        } );
    } );

    TestList.forEach( ( test ) =>
    {
        it( test.testDescription, () =>
        {
            let requestBody: Record<string, unknown> | null = null;
            // Dynamically resolve endpoint if needed
            cy.apiStoreEndpoint( test.endpoint, test.queryUser, "DESC" ).then( ( resolvedEndpoint ) =>
            {
                cy.step( `Performing API request to: ${resolvedEndpoint}` );
                // Generate the request body if both keys and values exist and match
                if ( test.requestKeys?.length && test.requestValues?.length )
                {
                    requestBody = createRequestBody( test.requestKeys, test.requestValues );
                }


                // Perform the API request
                cy.request( {   // Use object literal to ensure correct typing  
                    method: test.method as Cypress.HttpMethod, // Now correctly typed
                    url: resolvedEndpoint,
                    body: requestBody,
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                } ).then( ( response ) =>
                {
                    // Validate response status
                    cy.step( `Validate response status: ${test.expectedStatus}` );
                    expect( response.status ).to.equal( test.expectedStatus );

                    const data = response.body;

                    if ( data )
                    {
                        cy.storeAPIValidations( data, test );
                    } else
                    {
                        cy.step( 'No data returned in the response body to validate' );
                    }


                } );

            } );
        } );
    } );
} );
