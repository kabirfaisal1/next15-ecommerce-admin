import { AdminAPIRequestKeys } from '../../../support/utilities/apiRequestKeys';

// Explicitly define the shape of your test data
export interface TestData
{
    testDescription: string;
    endpoint: string;
    method: string; // Use HttpMethod to ensure valid methods
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

// Define the test list with the correct type
export const TestList: TestData[] = [
    {
        testDescription: 'Create new category',
        endpoint: '/api/01e483bc-744d-477a-95bf-bc1e5db0cb55/categories',
        method: 'POST',
        requestKeys: [ new AdminAPIRequestKeys().categoryName, new AdminAPIRequestKeys().billboardId ],
        requestValues: [ 'CypressAPIcategory', "84eaf450-6525-4681-8751-42f4a156820f" ],
        expectedStatus: 200,
        expectedResponseKeys: [ 'billboardId', 'createdAt', 'id', 'name', 'storeId', 'updatedAt' ],
        expectedResponseStoreId: '01e483bc-744d-477a-95bf-bc1e5db0cb55',
        expectedResponseCategoryName: 'CypressAPIBillboards',

        expectedResponseBillboardId: "84eaf450- 6525 - 4681 - 8751 - 42f4a156820f",

    },
    {
        testDescription: 'Get All Category for store',
        endpoint: '/api/01e483bc-744d-477a-95bf-bc1e5db0cb55/categories',
        method: 'GET',
        expectedStatus: 200,
    },
    {
        testDescription: 'Get Specific Category for store',
        endpoint: 'dynamic',
        method: 'GET',
        queryStoreid: '01e483bc-744d-477a-95bf-bc1e5db0cb55',
        expectedStatus: 200,
        expectedResponseKeys: [ 'billboardId', 'createdAt', 'id', 'name', 'storeId', 'updatedAt' ],
    },
    {
        testDescription: 'Update Category',
        endpoint: 'dynamic',
        method: 'PATCH',
        queryStoreid: '01e483bc-744d-477a-95bf-bc1e5db0cb55',
        requestKeys: [ new AdminAPIRequestKeys().categoryName, new AdminAPIRequestKeys().billboardId ],
        requestValues: [ 'UpdateCypressAPICategory', "84eaf450-6525-4681-8751-42f4a156820f" ],
        expectedStatus: 200,
        expectedResponseKeys: [ 'billboardId', 'createdAt', 'id', 'name', 'storeId', 'updatedAt' ],
        expectedResponseStoreId: '01e483bc-744d-477a-95bf-bc1e5db0cb55',
        expectedResponseCategoryName: 'UpdateCypressAPICategory',


    },
    {
        testDescription: 'Delete Category',
        endpoint: 'dynamic',
        queryStoreid: '01e483bc-744d-477a-95bf-bc1e5db0cb55',
        method: 'DELETE',
        expectedStatus: 200,

    },
    {
        testDescription: 'Create new Category with out name',
        endpoint: '/api/01e483bc-744d-477a-95bf-bc1e5db0cb55/categories',
        method: 'POST',
        requestKeys: [ new AdminAPIRequestKeys().billboardId ],
        requestValues: [ "84eaf450-6525-4681-8751-42f4a156820f" ],
        expectedStatus: 400,
        expectedError: 'billboardId name is required',

    },
    {
        testDescription: 'Create new Category with out imgUrl',
        endpoint: '/api/01e483bc-744d-477a-95bf-bc1e5db0cb55/categories',
        method: 'POST',
        requestKeys: [ new AdminAPIRequestKeys().categoryName ],
        requestValues: [ "categoryName is required" ],
        expectedStatus: 400,
        expectedError: 'imageUrl name is required',

    },

];
