import { AdminAPIRequestKeys } from '@support/utilities/apiRequestKeys';
 /** Options for running tests.
 * - 'only': Run only this test.
 * - 'skip': Skip this test.
 */;
type TestRunnerOptions = 'only' | 'skip';

/**
 * Defines the structure of API test cases for Billboards.
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

// ✅ Extracting reusable constants for store ID and test image URL
const STORE_ID = 'f8c96f0e-daa1-4e61-9fe4-3d1caf5db964';
const TEST_IMAGE_URL = 'https://res.cloudinary.com/dzsguot60/image/upload/v1738955812/samples/nawg5xwt83sdkhdqjwus.png';

/**
 * List of test cases for testing the Billboards API.
 */
export const TestList: TestData[] = [
    {
        testDescription: 'Create new Billboard',
        endpoint: `/api/${STORE_ID}/billboards`,
        method: 'POST',
        requestKeys: [ new AdminAPIRequestKeys().billboardName, new AdminAPIRequestKeys().imageUrl ],
        requestValues: [ 'CypressAPIBillboards', TEST_IMAGE_URL ],
        expectedStatus: 200,
        expectedResponseKeys: [ 'id', 'storeId', 'label', 'imageUrl', 'createdAt', 'updatedAt' ],
        expectedResponseStoreId: STORE_ID,
        expectedResponseBillboardName: 'CypressAPIBillboards',
        expectedResponseImageUrl: TEST_IMAGE_URL,
        expectedResponseBillboardId: true,
    },
    {

        testDescription: 'Get all billboards for store',
        endpoint: `/api/${STORE_ID}/billboards`,
        method: 'GET',
        expectedStatus: 200,
    },
    {
        testDescription: 'Get a specific billboard for store',
        endpoint: 'dynamic',
        method: 'GET',
        queryStoreid: STORE_ID,
        expectedStatus: 200,
        expectedResponseKeys: [ 'id', 'storeId', 'label', 'imageUrl', 'createdAt', 'updatedAt' ],
    },
    {
        testDescription: 'Update Billboard',
        endpoint: 'dynamic',
        method: 'PATCH',
        queryStoreid: STORE_ID,
        requestKeys: [ new AdminAPIRequestKeys().billboardName, new AdminAPIRequestKeys().imageUrl ],
        requestValues: [ 'UpdateCypressAPIBillboards', TEST_IMAGE_URL ],
        expectedStatus: 200,
        expectedResponseKeys: [ 'id', 'storeId', 'label', 'imageUrl', 'createdAt', 'updatedAt' ],
        expectedResponseStoreId: STORE_ID,
        expectedResponseBillboardName: 'UpdateCypressAPIBillboards',
        expectedResponseImageUrl: TEST_IMAGE_URL,
    },
    {

        testDescription: 'Delete Billboard',
        endpoint: 'dynamic',
        queryStoreid: STORE_ID,
        method: 'DELETE',
        expectedStatus: 200,
    },
    {

        testDescription: 'Create Billboard without Label',
        endpoint: `/api/${STORE_ID}/billboards`,
        method: 'POST',
        requestKeys: [ new AdminAPIRequestKeys().imageUrl ],
        requestValues: [ TEST_IMAGE_URL ],
        expectedStatus: 400,
        expectedError: 'Label name is required',
    },
    {
        testDescription: 'Create Billboard without Image URL',
        endpoint: `/api/${STORE_ID}/billboards`,
        method: 'POST',
        requestKeys: [ new AdminAPIRequestKeys().billboardName ],
        requestValues: [ 'imgUrl is required' ],
        expectedStatus: 400,
        expectedError: 'imageUrl name is required',
    },
];
