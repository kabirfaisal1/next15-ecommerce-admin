/// <reference types="cypress" />

export { }; // Ensures this file is treated as a module

/* eslint-disable @typescript-eslint/no-namespace */
declare global
{
    namespace Cypress
    {
        interface Chainable
        {
            validateResponseBody ( response: any, expectedResults: any ): void;
            generateAPIEndpoint ( type: 'stores' | 'billboards' | 'categories' | 'sizes', testData: string, parentId?: string, orderBy?: 'ASC' | 'DESC' ): Chainable;
        }
    }
}

// 🛠️ **Reusable SQL Query Generator**
const generateSQLQuery = ( tableName: string, parentColumn: string, parentId?: string, orderBy: string = 'DESC' ) =>
{
    return parentId
        ? `SELECT id FROM public."${tableName}" WHERE "${parentColumn}" = '${parentId}' ORDER BY "createdAt" ${orderBy};`
        : '';
};

// 🛠️ **Reusable API Endpoint Generator**
Cypress.Commands.add(
    'generateAPIEndpoint',
    ( type: 'stores' | 'billboards' | 'categories', testData: string, parentId?: string, orderBy: 'ASC' | 'DESC' = 'DESC' ): Cypress.Chainable<string> =>
    {
        const tableMap = {
            stores: { tableName: 'Stores', parentColumn: 'userId', endpoint: '/api/stores/' },
            billboards: { tableName: 'Billboards', parentColumn: 'storeId', endpoint: `/api/${parentId}/billboards/` },
            categories: { tableName: 'Categories', parentColumn: 'storeId', endpoint: `/api/${parentId}/categories/` },
            sizes: { tableName: 'Sizes', parentColumn: 'storeId', endpoint: `/api/${parentId}/sizes/` },
        };

        const { tableName, parentColumn, endpoint } = tableMap[ type ];

        const sqlQuery = generateSQLQuery( tableName, parentColumn, parentId, orderBy );

        cy.step( `Generated SQL Query for ${type}: ${sqlQuery}` );

        if ( testData === 'dynamic' && sqlQuery )
        {
            return cy.task( 'queryDatabase', sqlQuery ).then( ( rows ) =>
            {
                if ( rows?.length > 0 )
                {
                    const id = rows[ 0 ].id;
                    cy.step( `Resolved ${type} ID: ${id}` );
                    return cy.wrap( `${endpoint}${id}` );
                } else
                {
                    throw new Error( `No ${type} ID found for the provided ${parentColumn}.` );
                }
            } );
        }

        cy.step( `Returning static testData for ${type}: ${testData}` );
        return cy.wrap( testData );
    }
);

// 🛠️ **Reusable Response Body Validator**
Cypress.Commands.add( 'validateResponseBody', ( response: any, expectedResults: any ) =>
{
    cy.step( 'Validating response body' );

    Object.keys( expectedResults ).forEach( ( key ) =>
    {
        switch ( key )
        {
            case 'expectedResponseName':
                expect( response.name ).to.equal( expectedResults.expectedResponseName );
                cy.step( `Validated Name: ${expectedResults.expectedResponseName}` );
                break;

            case 'expectedResponseKeys':
                expectedResults.expectedResponseKeys.forEach( ( expectedKey: string ) =>
                {
                    expect( response ).to.have.property( expectedKey );
                } );
                cy.step( `Validated response keys: ${expectedResults.expectedResponseKeys}` );
                break;

            case 'expectedResponseId':
                expect( response.id ).to.not.be.empty;
                cy.step( `Validated ID exists: ${response.id}` );
                break;

            case 'expectedResponseParentId':
                expect( response.storeId ).to.equal( expectedResults.expectedResponseParentId );
                cy.step( `Validated Parent ID: ${expectedResults.expectedResponseParentId}` );
                break;

            case 'expectedResponseImageUrl':
                expect( response.imageUrl ).to.equal( expectedResults.expectedResponseImageUrl );
                cy.step( `Validated Image URL: ${expectedResults.expectedResponseImageUrl}` );
                break;

            case 'expectedResponseMessage':
                expect( response.message ).to.equal( expectedResults.expectedResponseMessage );
                cy.step( `Validated Message: ${expectedResults.expectedResponseMessage}` );
                break;
            case 'expectedError':
                expect( response ).to.equal( expectedResults.expectedError );
                cy.step( `Validated expected error: ${expectedResults.expectedError}` );
                break;

            default:
                cy.step( `No validation logic for key: ${key}` );
                break;
        }
    } );
} );
