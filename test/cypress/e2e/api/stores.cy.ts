
import { TestList } from './testData/createStore_data';
import { createRequestBody } from '../../support/utilities/globalHelpers';
import exp = require( 'constants' );



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
            // Generate the request body synchronously using the utility function
            const requestBody = createRequestBody( test.requestKeys, test.requestValues );

            cy.request( {
                method: 'POST',
                url: '/api/stores', // Replace with your endpoint
                body: requestBody, // Use the JSON object directly
                headers: {
                    'Content-Type': 'application/json'
                }
            } ).then( ( response ) =>
            {
                expect( response.status ).to.equal( test.expectedStatus );

            } );
        } );
    } );
} );
