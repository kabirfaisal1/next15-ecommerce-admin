import { AdminAPIRequestKeys } from '../../../support/utilities/apiRequestKeys';

// Explicitly define the shape of your test data
export interface TestData
{
    testDescription: string;
    endpoint: string;
    method: string; // Use HttpMethod to ensure valid methods
    requestKeys: string[];
    requestValues: string[];
    expectedStatus: number;
    expectedResponseKeys?: string[];
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
        expectedResponseKeys: [ 'name' ], // Only provide keys
    },
    {
        testDescription: 'Update store name',
        endpoint: 'dynamic', // Placeholder for dynamic resolution
        method: 'PATCH',
        requestKeys: [ new AdminAPIRequestKeys().storeName ],
        requestValues: [ 'UPDATED_STORE_NAME' ],
        expectedStatus: 202,
        expectedResponseKeys: [ 'count' ], // Ensure keys are valid
    },
];
