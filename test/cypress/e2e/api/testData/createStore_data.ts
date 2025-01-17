import { AdminAPIRequestKeys } from '../../../support/utilities/apiRequestKeys';

const storeIDQuery = 'SELECT id FROM public."Stores" WHERE userId = \'user_2rfrlZzqrYe0y1BAXYVYHQRgn8W\';';

export const TestList = [
    {
        testDescription: 'Create new store',
        endpoint: '/api/stores',
        method: 'POST',
        requestKeys: [ new AdminAPIRequestKeys().storeName ],
        requestValues: [ 'cypressTest' ],
        expectedStatus: 201,
        expectedResponseKeys: [ 'name : cypressTest' ],
        expectedResponseStoreName: 'cypressTest',
    },
    {
        testDescription: 'Update store name',
        endpoint: 'dynamic', // Placeholder for dynamic resolution
        method: 'PATCH',
        requestKeys: [ new AdminAPIRequestKeys().storeName ],
        requestValues: [ 'cypressTestWorld' ],
        expectedStatus: 202,
        expectedResponseKeys: [ 'count : 1' ],

    },
];
