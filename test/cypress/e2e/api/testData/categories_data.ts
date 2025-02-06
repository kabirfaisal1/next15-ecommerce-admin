import { AdminAPIRequestKeys } from '../../../support/utilities/apiRequestKeys';

/**
 * Defines the structure of API test cases for Categories.
 */
export interface TestData
{
    testDescription: string; // Description of the test case
    endpoint: string; // API endpoint to test
    method: string; // HTTP method (GET, POST, PATCH, DELETE, etc.)
    requestKeys?: string[]; // List of request body keys (optional)
    requestValues?: string[]; // Corresponding values for request body keys (optional)
    queryStoreid?: string; // Store ID for API requests requiring it (optional)
    expectedStatus: number; // Expected HTTP status code in response
    expectedResponseKeys?: string[]; // Expected keys in the API response (optional)
    expectedResponseCategoryName?: string; // Expected category name in response (optional)
    expectedResponseStoreId?: string; // Expected store ID in response (optional)
    expectedResponseBillboardId?: string; // Expected billboard ID in response (optional)
    expectedResponseCreatedAt?: string; // Expected creation timestamp (optional)
    expectedResponseUpdatedAt?: string; // Expected update timestamp (optional)
    expectedError?: string; // Expected error message in response (optional)
}

/**
 * List of test cases for testing the Categories API.
 */
export const TestList: TestData[] = [
    {
        testDescription: 'Create a new category',
        endpoint: '/api/01e483bc-744d-477a-95bf-bc1e5db0cb55/categories', // API endpoint for creating a category
        method: 'POST', // HTTP method: POST
        requestKeys: [ new AdminAPIRequestKeys().categoryName, new AdminAPIRequestKeys().billboardId ], // Required request keys
        requestValues: [ 'CypressAPIcategory', '84eaf450-6525-4681-8751-42f4a156820f' ], // Values for request keys
        expectedStatus: 200, // Expected HTTP status code for successful category creation
        expectedResponseKeys: [ 'billboardId', 'createdAt', 'id', 'name', 'storeId', 'updatedAt' ], // Expected response keys
        expectedResponseStoreId: '01e483bc-744d-477a-95bf-bc1e5db0cb55', // Expected store ID in response
        expectedResponseCategoryName: 'CypressAPIcategory', // Expected category name in response
        expectedResponseBillboardId: '84eaf450-6525-4681-8751-42f4a156820f', // Expected billboard ID in response
    },
    {
        testDescription: 'Get all categories for a store',
        endpoint: '/api/01e483bc-744d-477a-95bf-bc1e5db0cb55/categories', // API endpoint for retrieving all categories in a store
        method: 'GET', // HTTP method: GET
        expectedStatus: 200, // Expected HTTP status code for successful retrieval
    },
    {
        testDescription: 'Get a specific category for a store',
        endpoint: 'dynamic', // API endpoint will be dynamically generated
        method: 'GET', // HTTP method: GET
        queryStoreid: '01e483bc-744d-477a-95bf-bc1e5db0cb55', // Store ID needed to find category
        expectedStatus: 200, // Expected HTTP status code for successful retrieval
        expectedResponseKeys: [ 'billboardId', 'createdAt', 'id', 'name', 'storeId', 'updatedAt' ], // Expected response keys
    },
    {
        testDescription: 'Update a category',
        endpoint: 'dynamic', // API endpoint will be dynamically generated
        method: 'PATCH', // HTTP method: PATCH (for updating a category)
        queryStoreid: '01e483bc-744d-477a-95bf-bc1e5db0cb55', // Store ID required for updating category
        requestKeys: [ new AdminAPIRequestKeys().categoryName, new AdminAPIRequestKeys().billboardId ], // Request keys for updating
        requestValues: [ 'UpdateCypressAPICategory', '84eaf450-6525-4681-8751-42f4a156820f' ], // Updated values
        expectedStatus: 200, // Expected HTTP status code for successful update
        expectedResponseKeys: [ 'billboardId', 'createdAt', 'id', 'name', 'storeId', 'updatedAt' ], // Expected response keys
        expectedResponseStoreId: '01e483bc-744d-477a-95bf-bc1e5db0cb55', // Expected store ID in response
        expectedResponseCategoryName: 'UpdateCypressAPICategory', // Expected updated category name in response
    },
    {
        testDescription: 'Delete a category',
        endpoint: 'dynamic', // API endpoint will be dynamically generated
        queryStoreid: '01e483bc-744d-477a-95bf-bc1e5db0cb55', // Store ID required to delete category
        method: 'DELETE', // HTTP method: DELETE (for removing category)
        expectedStatus: 200, // Expected HTTP status code for successful deletion
    },
    {
        testDescription: 'Create a new category without a name',
        endpoint: '/api/01e483bc-744d-477a-95bf-bc1e5db0cb55/categories', // API endpoint for category creation
        method: 'POST', // HTTP method: POST
        requestKeys: [ new AdminAPIRequestKeys().billboardId ], // Only billboardId is provided
        requestValues: [ '84eaf450-6525-4681-8751-42f4a156820f' ], // No category name provided
        expectedStatus: 400, // Expected HTTP status code for validation failure
        expectedError: 'Category name is required', // Expected error message in response
    },
    {
        testDescription: 'Create a new category without a billboard ID',
        endpoint: '/api/01e483bc-744d-477a-95bf-bc1e5db0cb55/categories', // API endpoint for category creation
        method: 'POST', // HTTP method: POST
        requestKeys: [ new AdminAPIRequestKeys().categoryName ], // Only category name is provided
        requestValues: [ 'billboardIdRequired' ], // No billboardId provided
        expectedStatus: 400, // Expected HTTP status code for validation failure
        expectedError: 'BillboardId URL is required', // Expected error message in response (possible typo: should be "billboardId is required")
    },
];
