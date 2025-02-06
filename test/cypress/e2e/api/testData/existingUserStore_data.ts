import { AdminAPIRequestKeys } from '../../../support/utilities/apiRequestKeys';

/**
 * Defines the structure of API test cases for Stores.
 */
export interface TestData
{
    testDescription: string;
    endpoint: string;
    method: string;
    requestKeys?: string[];
    requestValues?: string[];
    queryUser?: string;
    expectedStatus: number;
    expectedResponseKeys?: string[];
    expectedResponseStoreName?: string;
    expectedResponseStoreId?: string | boolean;
    expectedResponseUseId?: string;
    expectedResponseCreatedAt?: string;
    expectedResponseUpdatedAt?: string;
    expectedResponseMessage?: string;
}

// ✅ Extracting reusable constants for User ID
const USER_ID = 'user_2qOt3xdN0TBsnKSVgczTsusMYZW';

/**
 * List of test cases for testing the Store API.
 */
export const TestList: TestData[] = [
    {
        testDescription: 'Create a new store',
        endpoint: '/api/stores',
        method: 'POST',
        requestKeys: [ new AdminAPIRequestKeys().storeName ],
        requestValues: [ 'Create new store' ],
        expectedStatus: 201,
        expectedResponseKeys: [ 'id', 'name', 'userId', 'createdAt', 'updatedAt' ],
        expectedResponseStoreId: true,
        expectedResponseStoreName: 'Create new store',
        expectedResponseUseId: USER_ID,
    },
    {
        testDescription: 'Update store name',
        endpoint: 'dynamic',
        method: 'PATCH',
        queryUser: USER_ID,
        requestKeys: [ new AdminAPIRequestKeys().storeName ],
        requestValues: [ 'Updating store' ],
        expectedStatus: 202,
        expectedResponseKeys: [ 'count' ],
    },
    {
        testDescription: 'Delete store for user',
        endpoint: 'dynamic',
        queryUser: USER_ID,
        method: 'DELETE',
        expectedStatus: 200,
        expectedResponseKeys: [ 'message' ],
        expectedResponseMessage: 'Deleted successfully',
    },
];
