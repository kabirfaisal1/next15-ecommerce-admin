import { AdminAPIRequestKeys } from '@support/utilities/apiRequestKeys';

/**
 * Defines the structure of API test cases for Categories.
 */
export interface TestData
{
    testDescription: string;
    testRunner?: string;
    endpoint: string;
    method: string;
    requestKeys?: string[];
    requestValues?: string[];
    queryStoreid?: string;
    expectedStatus: number;
    expectedResponseKeys?: string[];
    expectedResponseColorName?: string;
    expectedResponseColorValue?: string;
    expectedResponseStoreId?: string;
    expectedResponseCreatedAt?: string;
    expectedResponseUpdatedAt?: string;
    expectedError?: string;
}

// ✅ Extracting reusable constants for store and billboard IDs
const STORE_ID = 'f8c96f0e-daa1-4e61-9fe4-3d1caf5db964';


/**
 * List of test cases for testing the Categories API.
 */
export const TestList: TestData[] = [
    {

        testDescription: 'Create a new Color',
        endpoint: `/api/${STORE_ID}/colors`,
        method: 'POST',
        requestKeys: [ new AdminAPIRequestKeys().colorName, new AdminAPIRequestKeys().colorValue ],
        requestValues: [ 'cyAPIColore', '#D69ADE' ],
        expectedStatus: 200,
        expectedResponseKeys: [ 'createdAt', 'id', 'name', 'storeId',
            'updatedAt', 'value' ],
        expectedResponseStoreId: STORE_ID,
        expectedResponseColorName: 'cyAPIColore',
        expectedResponseColorValue: '#D69ADE',
    },
    {
        testDescription: 'Get all colors for a store',
        endpoint: `/api/${STORE_ID}/colors`,
        method: 'GET',
        expectedStatus: 200,
    },
    {
        testDescription: 'Get a specific Color for a store',
        endpoint: 'dynamic',
        method: 'GET',
        queryStoreid: STORE_ID,
        expectedStatus: 200,
        expectedResponseKeys: [ 'createdAt', 'id', 'name', 'storeId',
            'updatedAt', 'value' ],
    },
    {
        testDescription: 'Update a Color',
        endpoint: 'dynamic',
        method: 'PATCH',
        queryStoreid: STORE_ID,
        requestKeys: [ new AdminAPIRequestKeys().colorName, new AdminAPIRequestKeys().colorValue ],
        requestValues: [ 'CypressUpdate', '#A31D1D' ],
        expectedStatus: 200,

    },
    {
        testDescription: 'Delete a Color',
        endpoint: 'dynamic',
        queryStoreid: STORE_ID,
        method: 'DELETE',
        expectedStatus: 200,
    },
    {
        testDescription: 'Create a Color without a name',
        endpoint: `/api/${STORE_ID}/colors`,
        method: 'POST',
        requestKeys: [ new AdminAPIRequestKeys().colorValue ],
        requestValues: [ "#D69ADE" ],
        expectedStatus: 400,
        expectedError: 'Color name is required',
    },
    {
        testDescription: 'Create a Color without a value ',
        endpoint: `/api/${STORE_ID}/colors`,
        method: 'POST',
        requestKeys: [ new AdminAPIRequestKeys().colorName ],
        requestValues: [ 'CypressLarge' ],
        expectedStatus: 400,
        expectedError: 'Color Value is required',
    },
    {
        testDescription: 'Create a Color without a HEX value ',
        endpoint: `/api/${STORE_ID}/colors`,
        method: 'POST',
        requestKeys: [ new AdminAPIRequestKeys().colorName, new AdminAPIRequestKeys().colorValue ],
        requestValues: [ 'cyAPIColore', 'D69ADE' ],
        expectedStatus: 400,
        expectedError: 'Value must be a valid hex code (e.g., #FFFFFF).',
    },
];
