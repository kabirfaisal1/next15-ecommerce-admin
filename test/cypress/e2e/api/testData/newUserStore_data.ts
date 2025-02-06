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
    expectedResponseStoreId?: string | boolean; // Expected store ID in response (optional)
    expectedResponseUseId?: string; // Expected user ID in response (optional)
    expectedResponseCreatedAt?: string; // Expected creation timestamp (optional)
    expectedResponseUpdatedAt?: string; // Expected update timestamp (optional)
    expectedResponseMessage?: string; // Expected update timestamp (optional)
}

/**
 * List of test cases for testing the Store API (No Store User).
 */
export const TestList: TestData[] = [
    {
        testDescription: 'Create new store for user with no existing stores',
        endpoint: '/api/stores', // API endpoint for store creation
        method: 'POST', // HTTP method: POST
        requestKeys: [ new AdminAPIRequestKeys().storeName ], // Required request key
        requestValues: [ 'NO_STORE_USER' ], // Store name value for creation
        expectedStatus: 201, // Expected status code for successful store creation
        expectedResponseKeys: [ 'id', 'name', 'userId', 'createdAt', 'updatedAt' ], // Expected response keys
        expectedResponseStoreId: true, // Expecting a valid store ID in response
        expectedResponseStoreName: 'NO_STORE_USER', // Expected store name in response
        expectedResponseUseId: 'user_2rfrlZzqrYe0y1BAXYVYHQRgn8W', // Expected user ID in response
    },
    {
        testDescription: 'Update store name for user with no existing stores',
        endpoint: 'dynamic', // API endpoint will be dynamically generated
        method: 'PATCH', // HTTP method: PATCH (for updating store name)
        queryUser: 'user_2rfrlZzqrYe0y1BAXYVYHQRgn8W', // User ID required for updating store
        requestKeys: [ new AdminAPIRequestKeys().storeName ], // Request key for store name update
        requestValues: [ 'UPDATED_STORE_NAME' ], // New store name value
        expectedStatus: 202, // Expected HTTP status code for successful update
        expectedResponseKeys: [ 'count' ], // Expected response contains a "count" field indicating the number of affected records
    },
    {
        testDescription: 'Delete store for user with no existing stores',
        endpoint: 'dynamic', // API endpoint will be dynamically generated
        queryUser: 'user_2rfrlZzqrYe0y1BAXYVYHQRgn8W', // User ID required for store deletion
        method: 'DELETE', // HTTP method: DELETE (for removing the store)
        expectedStatus: 200, // Expected HTTP status code for successful deletion
        expectedResponseKeys: [ 'message' ], // Expected response contains a "count" field indicating number of deleted records
        expectedResponseMessage: 'Deleted successfully', // Expected success message
    },
];
