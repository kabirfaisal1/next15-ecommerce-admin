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
    expectedResponseSizeName?: string;
    expectedResponseSizeValue?: string;
    expectedResponseStoreId?: string;
    expectedResponseBillboardId?: string;
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

        testDescription: 'Create a new Size',
        endpoint: `/api/${STORE_ID}/sizes`,
        method: 'POST',
        requestKeys: [ new AdminAPIRequestKeys().sizeName, new AdminAPIRequestKeys().sizeValue ],
        requestValues: [ 'CypressSmall', 'Small' ],
        expectedStatus: 200,
        expectedResponseKeys: [ 'createdAt', 'id', 'name', 'storeId',
            'updatedAt', 'value' ],
        expectedResponseStoreId: STORE_ID,
        expectedResponseSizeName: 'CypressSmall',
        expectedResponseSizeValue: 'Small',
    },
    {
        testDescription: 'Get all sizes for a store',
        endpoint: `/api/${STORE_ID}/sizes`,
        method: 'GET',
        expectedStatus: 200,
    },
    {
        testDescription: 'Get a specific Size for a store',
        endpoint: 'dynamic',
        method: 'GET',
        queryStoreid: STORE_ID,
        expectedStatus: 200,
        expectedResponseKeys: [ 'createdAt', 'id', 'name', 'storeId',
            'updatedAt', 'value' ],
    },
    {
        testDescription: 'Update a Size',
        endpoint: 'dynamic',
        method: 'PATCH',
        queryStoreid: STORE_ID,
        requestKeys: [ new AdminAPIRequestKeys().sizeName, new AdminAPIRequestKeys().sizeValue ],
        requestValues: [ 'CypressUpdate', 'Medium' ],
        expectedStatus: 200,

    },
    {
        testDescription: 'Delete a Size',
        endpoint: 'dynamic',
        queryStoreid: STORE_ID,
        method: 'DELETE',
        expectedStatus: 200,
    },
    {
        testDescription: 'Create a Size without a name',
        endpoint: `/api/${STORE_ID}/sizes`,
        method: 'POST',
        requestKeys: [ new AdminAPIRequestKeys().sizeValue ],
        requestValues: [ "Large" ],
        expectedStatus: 400,
        expectedError: 'Size name is required',
    },
    {
        testDescription: 'Create a Size without a value',
        endpoint: `/api/${STORE_ID}/sizes`,
        method: 'POST',
        requestKeys: [ new AdminAPIRequestKeys().sizeName ],
        requestValues: [ 'CypressLarge' ],
        expectedStatus: 400,
        expectedError: 'Size Value is required',
    },
];
