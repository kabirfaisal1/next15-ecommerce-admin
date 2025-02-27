import { AdminAPIRequestKeys } from '@support/utilities/apiRequestKeys';
 /** Options for running tests.
 * - 'only': Run only this test.
 * - 'skip': Skip this test.
 */;
type TestRunnerOptions = 'only' | 'skip';

/**
 * Defines the structure of API test cases for new store users.
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
const USER_ID = 'user_2rfrlZzqrYe0y1BAXYVYHQRgn8W';

/**
 * List of test cases for testing the Store API (No Store User).
 */
export const TestList: TestData[] = [
    {
        testDescription: 'Create a new store for a user with no existing stores',
        endpoint: '/api/stores',
        method: 'POST',
        requestKeys: [ new AdminAPIRequestKeys().storeName ],
        requestValues: [ 'NO_STORE_USER' ],
        expectedStatus: 201,
        expectedResponseKeys: [ 'id', 'name', 'userId', 'createdAt', 'updatedAt' ],
        expectedResponseStoreId: true,
        expectedResponseStoreName: 'NO_STORE_USER',
        expectedResponseUseId: USER_ID,
    },
    {

        testDescription: 'Update store name for a user with no existing stores',
        endpoint: 'dynamic',
        method: 'PATCH',
        queryUser: USER_ID,
        requestKeys: [ new AdminAPIRequestKeys().storeName ],
        requestValues: [ 'UPDATED_STORE_NAME' ],
        expectedStatus: 202,
        expectedResponseKeys: [ 'count' ],
    },
    {
        testDescription: 'Delete store for a user with no existing stores',
        endpoint: 'dynamic',
        queryUser: USER_ID,
        method: 'DELETE',
        expectedStatus: 200,
        expectedResponseKeys: [ 'message' ],
        expectedResponseMessage: 'Deleted successfully',
    },
];
