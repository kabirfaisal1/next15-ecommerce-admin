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
    expectedResponseCategoryName?: string;
    expectedResponseStoreId?: string;
    expectedResponseBillboardId?: string;
    expectedResponseCreatedAt?: string;
    expectedResponseUpdatedAt?: string;
    expectedError?: string;
}

// ✅ Extracting reusable constants for store and billboard IDs
const STORE_ID = 'f8c96f0e-daa1-4e61-9fe4-3d1caf5db964';
const BILLBOARD_ID = '84eaf450-6525-4681-8751-42f4a156820f';

/**
 * List of test cases for testing the Categories API.
 */
export const TestList: TestData[] = [
    {

        testDescription: 'Create a new category',
        endpoint: `/api/${STORE_ID}/categories`,
        method: 'POST',
        requestKeys: [ new AdminAPIRequestKeys().categoryName, new AdminAPIRequestKeys().billboardId ],
        requestValues: [ 'CypressAPIcategory', BILLBOARD_ID ],
        expectedStatus: 200,
        expectedResponseKeys: [ 'billboardId', 'createdAt', 'id', 'name', 'storeId', 'updatedAt' ],
        expectedResponseStoreId: STORE_ID,
        expectedResponseCategoryName: 'CypressAPIcategory',
        expectedResponseBillboardId: BILLBOARD_ID,
    },
    {
        testDescription: 'Get all categories for a store',
        endpoint: `/api/${STORE_ID}/categories`,
        method: 'GET',
        expectedStatus: 200,
    },
    {
        testDescription: 'Get a specific category for a store',
        endpoint: 'dynamic',
        method: 'GET',
        queryStoreid: STORE_ID,
        expectedStatus: 200,
        expectedResponseKeys: [ 'billboardId', 'createdAt', 'id', 'name', 'storeId', 'updatedAt' ],
    },
    {
        testDescription: 'Update a category',
        endpoint: 'dynamic',
        method: 'PATCH',
        queryStoreid: STORE_ID,
        requestKeys: [ new AdminAPIRequestKeys().categoryName, new AdminAPIRequestKeys().billboardId ],
        requestValues: [ 'UpdateCypressAPICategory', BILLBOARD_ID ],
        expectedStatus: 200,
        expectedResponseKeys: [ 'billboardId', 'createdAt', 'id', 'name', 'storeId', 'updatedAt' ],
        expectedResponseStoreId: STORE_ID,
        expectedResponseCategoryName: 'UpdateCypressAPICategory',
    },
    {
        testDescription: 'Delete a category',
        endpoint: 'dynamic',
        queryStoreid: STORE_ID,
        method: 'DELETE',
        expectedStatus: 200,
    },
    {
        testDescription: 'Create a category without a name',
        endpoint: `/api/${STORE_ID}/categories`,
        method: 'POST',
        requestKeys: [ new AdminAPIRequestKeys().billboardId ],
        requestValues: [ BILLBOARD_ID ],
        expectedStatus: 400,
        expectedError: 'Category name is required',
    },
    {
        testDescription: 'Create a category without a billboard ID',
        endpoint: `/api/${STORE_ID}/categories`,
        method: 'POST',
        requestKeys: [ new AdminAPIRequestKeys().categoryName ],
        requestValues: [ 'billboardIdRequired' ],
        expectedStatus: 400,
        expectedError: 'BillboardId is required',
    },
];
