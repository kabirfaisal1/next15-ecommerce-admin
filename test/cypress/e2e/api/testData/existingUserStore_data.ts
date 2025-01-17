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
        requestValues: [ 'Add New STORE' ],
        expectedStatus: 201,
        expectedResponseKeys: [ 'id', 'name', 'userId', 'createdAt', 'updatedAt' ],
        expectedResponseStoreId: true,
        expectedResponseStoreName: 'NO_STORE_USER',
        expectedResponseUseId: 'user_2qOt3xdN0TBsnKSVgczTsusMYZW',
    },
    {
        testDescription: 'Update store name',
        endpoint: 'dynamic',
        method: 'PATCH',
        queryUser: 'user_2qOt3xdN0TBsnKSVgczTsusMYZW',
        requestKeys: [ new AdminAPIRequestKeys().storeName ],
        requestValues: [ 'updating store' ],
        expectedStatus: 202,
        expectedResponseKeys: [ 'count' ],
    },
    {
        testDescription: 'Delete store for user',
        endpoint: 'dynamic',
        queryUser: 'user_2qOt3xdN0TBsnKSVgczTsusMYZW',
        method: 'DELETE',
        expectedStatus: 200,
        expectedResponseKeys: [ 'count' ],
    },
];
