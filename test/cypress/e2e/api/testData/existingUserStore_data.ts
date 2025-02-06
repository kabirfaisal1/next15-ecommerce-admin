import { AdminAPIRequestKeys } from '../../../support/utilities/apiRequestKeys';

/**
 * Defines the structure of API test cases.
 */
export interface TestData
{
    testDescription: string; // Description of the test case
    endpoint: string; // API endpoint to test
    method: string; // HTTP method (GET, POST, PATCH, DELETE, etc.)
    requestKeys?: string[]; // List of request body keys (optional)
    requestValues?: string[]; // Corresponding values for request body keys (optional)
    queryUser?: string; // User ID for API requests that require it (optional)
    expectedStatus: number; // Expected HTTP status code in response
    expectedResponseKeys?: string[]; // Expected keys in the API response (optional)
    expectedResponseStoreName?: string; // Expected store name in response (optional)
    expectedResponseBillboardName?: string; // Expected billboard name in response (optional)
    expectedResponseStoreId?: string | boolean; // Expected store ID in response (optional)
    expectedResponseUseId?: string; // Expected user ID in response (optional)
    expectedResponseCreatedAt?: string; // Expected creation timestamp (optional)
    expectedResponseUpdatedAt?: string; // Expected update timestamp (optional)
    expectedResponseMessage?: string; // Expected update timestamp (optional)
}

/**
 * List of test cases for testing the Store API.
 */
export const TestList: TestData[] = [
    {
        testDescription: 'Create new store',
        endpoint: '/api/stores', // API endpoint to create a store
        method: 'POST', // HTTP method: POST
        requestKeys: [ new AdminAPIRequestKeys().storeName ], // Required request keys
        requestValues: [ 'Create new store' ], // Corresponding values for request keys
        expectedStatus: 201, // Expected status code for successful creation
        expectedResponseKeys: [ 'id', 'name', 'userId', 'createdAt', 'updatedAt' ], // Expected keys in response
        expectedResponseStoreId: true, // Expecting a valid store ID in response
        expectedResponseStoreName: 'Create new store', // Expected store name
        expectedResponseUseId: 'user_2qOt3xdN0TBsnKSVgczTsusMYZW', // Expected user ID associated with the store
    },
    {
        testDescription: 'Update store name',
        endpoint: 'dynamic', // API endpoint will be dynamically generated
        method: 'PATCH', // HTTP method: PATCH (for updating data)
        queryUser: 'user_2qOt3xdN0TBsnKSVgczTsusMYZW', // User ID for store lookup
        requestKeys: [ new AdminAPIRequestKeys().storeName ], // Request key for store name update
        requestValues: [ 'updating store' ], // New store name value
        expectedStatus: 202, // Expected HTTP status code for successful update
        expectedResponseKeys: [ 'count' ], // Expected response contains a "count" field indicating the number of affected records
    },
    {
        testDescription: 'Delete store for user',
        endpoint: 'dynamic', // API endpoint will be dynamically generated
        queryUser: 'user_2qOt3xdN0TBsnKSVgczTsusMYZW', // User ID for store lookup
        method: 'DELETE', // HTTP method: DELETE (for removing data)
        expectedStatus: 200, // Expected HTTP status code for successful deletion
        expectedResponseKeys: [ 'message' ], // Expected response contains a "count" field indicating number of deleted records
        expectedResponseMessage: 'Deleted successfully', // Expected success message
    },
];

