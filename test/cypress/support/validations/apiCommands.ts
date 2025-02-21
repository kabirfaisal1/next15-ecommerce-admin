/// <reference types="cypress" />

export { }; // Ensures this file is treated as a module

/* eslint-disable @typescript-eslint/no-namespace */
declare global
{
    namespace Cypress
    {
        interface Chainable
        {
            /**
             * Validates the response body against expected results.
             * @param {any} response - The actual API response body.
             * @param {any} expectedResults - The expected response values to validate.
             */
            validateResponseBody ( response: any, expectedResults: any ): void;

            /**
             * Generates an API endpoint dynamically based on provided parameters.
             * @param {'stores' | 'billboards' | 'categories' | 'sizes'} type - The type of API resource.
             * @param {string} testData - The test data, either a static value or 'dynamic' for database-driven values.
             * @param {string} [parentId] - Optional parent ID to fetch data dynamically.
             * @param {'ASC' | 'DESC'} [orderBy='DESC'] - The sorting order of fetched records.
             * @returns {Cypress.Chainable<string>} - The dynamically generated API endpoint.
             */
            generateAPIEndpoint (
                type: 'stores' | 'billboards' | 'categories' | 'sizes',
                testData: string,
                parentId?: string,
                orderBy?: 'ASC' | 'DESC'
            ): Chainable<string>;
        }
    }
}

/**
 * Generates a SQL query to fetch IDs from a given table.
 * @param {string} tableName - The database table name.
 * @param {string} parentColumn - The column name used to filter by parentId.
 * @param {string} [parentId] - Optional parent ID used to filter results.
 * @param {string} [orderBy='DESC'] - Sorting order ('ASC' or 'DESC').
 * @returns {string} - The SQL query string.
 */
const generateSQLQuery = ( tableName: string, parentColumn: string, parentId?: string, orderBy: string = 'DESC' ): string =>
    parentId
        ? `SELECT id FROM public."${tableName}" WHERE "${parentColumn}" = '${parentId}' ORDER BY "createdAt" ${orderBy};`
        : '';

// Mapping of API types to their corresponding table and endpoint details
const API_TABLE_MAP = {
    stores: { tableName: 'Stores', parentColumn: 'userId', endpoint: '/api/stores/' },
    billboards: { tableName: 'Billboards', parentColumn: 'storeId', endpoint: `/api/{parentId}/billboards/` },
    categories: { tableName: 'Categories', parentColumn: 'storeId', endpoint: `/api/{parentId}/categories/` },
    sizes: { tableName: 'Sizes', parentColumn: 'storeId', endpoint: `/api/{parentId}/sizes/` },
};

/**
 * Generates an API endpoint dynamically based on provided parameters.
 * @param {'stores' | 'billboards' | 'categories' | 'sizes'} type - The type of API resource.
 * @param {string} testData - The test data, either a static value or 'dynamic' for database-driven values.
 * @param {string} [parentId] - Optional parent ID to fetch data dynamically.
 * @param {'ASC' | 'DESC'} [orderBy='DESC'] - The sorting order of fetched records.
 * @returns {Cypress.Chainable<string>} - The dynamically generated API endpoint.
 */
Cypress.Commands.add( 'generateAPIEndpoint', ( type, testData, parentId, orderBy = 'DESC' ): Cypress.Chainable<string> =>
{
    const config = API_TABLE_MAP[ type ];
    if ( !config )
    {
        throw new Error( `Invalid API type: ${type}` );
    }

    const { tableName, parentColumn, endpoint } = config;
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
                return cy.wrap( endpoint.replace( '{parentId}', id ) );
            } else
            {
                throw new Error( `No ${type} ID found for the provided ${parentColumn}.` );
            }
        } );
    }

    cy.step( `Returning static testData for ${type}: ${testData}` );
    return cy.wrap( testData );
} );

/**
 * Validates the response body against expected results.
 * @param {any} response - The actual API response body.
 * @param {any} expectedResults - The expected response values to validate.
 */
Cypress.Commands.add( 'validateResponseBody', ( response, expectedResults ) =>
{
    cy.step( 'Validating response body' );

    Object.entries( expectedResults ).forEach( ( [ key, expectedValue ] ) =>
    {
        if ( key.startsWith( 'expectedResponse' ) )
        {
            const responseKey = key.replace( 'expectedResponse', '' ).toLowerCase();
            expect( response ).to.have.property( responseKey, expectedValue );
            cy.step( `Validated ${responseKey}: ${expectedValue}` );
        } else if ( key === 'expectedError' )
        {
            expect( response ).to.equal( expectedValue );
            cy.step( `Validated expected error: ${expectedValue}` );
        } else
        {
            cy.step( `No validation logic for key: ${key}` );
        }
    } );
} );
