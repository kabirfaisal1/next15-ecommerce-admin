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
    expectedResponseBillboardName?: string;
    expectedResponseImageUrl?: string;
    expectedResponseStoreId?: string;
    expectedResponseBillboardId?: string | boolean;
    expectedResponseCreatedAt?: string;
    expectedResponseUpdatedAt?: string;
    expectedError?: string;
}

// Define the test list with the correct type
export const TestList: TestData[] = [
    {
        testDescription: 'Create new Billboard',
        endpoint: '/api/01e483bc-744d-477a-95bf-bc1e5db0cb55/billboards',
        method: 'POST',
        requestKeys: [ new AdminAPIRequestKeys().billboardName, new AdminAPIRequestKeys().imageUrl ],
        requestValues: [ 'CypressAPIBillboards', "https://res.cloudinary.com/dzsguot60/image/upload/v1736444639/iz0gqlh3fyelyxqzohnk.png" ],
        expectedStatus: 200,
        expectedResponseKeys: [ 'id', 'storeId', 'label', 'imageUrl', 'createdAt', 'updatedAt' ],
        expectedResponseStoreId: '01e483bc-744d-477a-95bf-bc1e5db0cb55',
        expectedResponseBillboardName: 'CypressAPIBillboards',
        expectedResponseImageUrl: 'https://res.cloudinary.com/dzsguot60/image/upload/v1736444639/iz0gqlh3fyelyxqzohnk.png',
        expectedResponseBillboardId: true,

    },
    {
        testDescription: 'Get All Billboard for store',
        endpoint: '/api/01e483bc-744d-477a-95bf-bc1e5db0cb55/billboards',
        method: 'GET',
        expectedStatus: 200,
    },
    {
        testDescription: 'Get Specific Billboard for store',
        endpoint: 'dynamic',
        method: 'GET',
        queryStoreid: '01e483bc-744d-477a-95bf-bc1e5db0cb55',
        expectedStatus: 200,
        expectedResponseKeys: [ 'id', 'storeId', 'label', 'imageUrl', 'createdAt', 'updatedAt' ],
    },
    {
        testDescription: 'Update Billboard',
        endpoint: 'dynamic',
        method: 'PATCH',
        queryStoreid: '01e483bc-744d-477a-95bf-bc1e5db0cb55',
        requestKeys: [ new AdminAPIRequestKeys().billboardName, new AdminAPIRequestKeys().imageUrl ],
        requestValues: [ 'UpdateCypressAPIBillboards', "https://res.cloudinary.com/dzsguot60/image/upload/v1736444639/iz0gqlh3fyelyxqzohnk.png" ],
        expectedStatus: 200,
        expectedResponseKeys: [ 'id', 'storeId', 'label', 'imageUrl', 'createdAt', 'updatedAt' ],
        expectedResponseStoreId: '01e483bc-744d-477a-95bf-bc1e5db0cb55',
        expectedResponseBillboardName: 'UpdateCypressAPIBillboards',
        expectedResponseImageUrl: 'https://res.cloudinary.com/dzsguot60/image/upload/v1736444639/iz0gqlh3fyelyxqzohnk.png',

    },
    {
        testDescription: 'Delete Billboard',
        endpoint: 'dynamic',
        queryStoreid: '01e483bc-744d-477a-95bf-bc1e5db0cb55',
        method: 'DELETE',
        expectedStatus: 200,

    },
    {
        testDescription: 'Create new Billboard with out label',
        endpoint: '/api/01e483bc-744d-477a-95bf-bc1e5db0cb55/billboards',
        method: 'POST',
        requestKeys: [ new AdminAPIRequestKeys().imageUrl ],
        requestValues: [ "https://res.cloudinary.com/dzsguot60/image/upload/v1736444639/iz0gqlh3fyelyxqzohnk.png" ],
        expectedStatus: 400,
        expectedError: 'Label name is required',

    },
    {
        testDescription: 'Create new Billboard with out imgUrl',
        endpoint: '/api/01e483bc-744d-477a-95bf-bc1e5db0cb55/billboards',
        method: 'POST',
        requestKeys: [ new AdminAPIRequestKeys().billboardName ],
        requestValues: [ "imgUrl is required" ],
        expectedStatus: 400,
        expectedError: 'imageUrl name is required',

    },

];
