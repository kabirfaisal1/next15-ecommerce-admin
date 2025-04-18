import { AdminAPIRequestKeys } from '@support/utilities/apiRequestKeys';

 /** Options for running tests.
 * - 'only': Run only this test.
 * - 'skip': Skip this test.
 */;
type TestRunnerOptions = 'only' | 'skip';

/**
 * Defines the structure of API test cases for Categories.
 */

export interface TestData
{
    /**
 * Optional: Specify if you want to run, skip, or mark the test as todo.
 */
    testRunner?: TestRunnerOptions;
    testDescription: string;
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
const STORE_ID = '88c76854-1b8b-4582-91b7-052e177a1b10';


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
        expectedError: 'Value must be a valid hex code (e.g., #FFFFFF). For more help, visit https://colorhunt.co/',
    },
];
