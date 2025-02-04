import { AdminAPIRequestKeys } from '../../../support/utilities/apiRequestKeys';

// Explicitly define the shape of your test data
export interface TestData
{
    testDescription: string;
    endpoint: string;
    method: string; // Use HttpMethod to ensure valid methods
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
}

// Define the test list with the correct type
export const TestList: TestData[] = [
    {
        testDescription: 'Create new store',
        endpoint: '/api/stores',
        method: 'POST',
        requestKeys: [ new AdminAPIRequestKeys().storeName ],
        requestValues: [ 'NO_STORE_USER' ],
        expectedStatus: 201,
        expectedResponseKeys: [ 'id', 'name', 'userId', 'createdAt', 'updatedAt' ],
        expectedResponseStoreId: true,
        expectedResponseStoreName: 'NO_STORE_USER',
        expectedResponseUseId: 'user_2rfrlZzqrYe0y1BAXYVYHQRgn8W',
    },
    {
        testDescription: 'Update store name',
        endpoint: 'dynamic',
        method: 'PATCH',
        queryUser: 'user_2rfrlZzqrYe0y1BAXYVYHQRgn8W',
        requestKeys: [ new AdminAPIRequestKeys().storeName ],
        requestValues: [ 'UPDATED_STORE_NAME' ],
        expectedStatus: 202,
        expectedResponseKeys: [ 'count' ],
    },
    {
        testDescription: 'Delete store for user',
        endpoint: 'dynamic',
        queryUser: 'user_2rfrlZzqrYe0y1BAXYVYHQRgn8W',
        method: 'DELETE',
        expectedStatus: 200,
        expectedResponseKeys: [ 'count' ],
    },
];
