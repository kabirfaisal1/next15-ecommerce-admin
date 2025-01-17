
import { TestList } from './testData/createStore_data';
import { createRequestBody } from '../../support/utilities/globalHelpers';

describe( 'API Tests', () =>
{
    let token: string = '';

    const storeIDQuery =
        'SELECT id FROM public."Stores" WHERE "userId" = \'user_2rfrlZzqrYe0y1BAXYVYHQRgn8W\';';

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
            let endpointPromise: Cypress.Chainable<string>;
            if ( test.endpoint === 'dynamic' )
            {
                endpointPromise = cy.task( 'queryDatabase', storeIDQuery ).then( ( rows ) =>
                {
                    if ( rows.length > 0 )
                    {
                        return `/api/stores/${rows[ 0 ].id}`;
                    } else
                    {
                        throw new Error( 'No rows returned from query' );
                    }
                } );
            } else
            {
                endpointPromise = cy.wrap( test.endpoint ); // Wrap static endpoint
            }

            endpointPromise.then( ( resolvedEndpoint ) =>
            {
                // Generate the request body
                const requestBody = createRequestBody( test.requestKeys, test.requestValues );

                // Perform the API request
                cy.request( {
                    method: test.method,
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
