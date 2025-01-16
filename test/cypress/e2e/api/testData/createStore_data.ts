import { AdminAPIRequestKeys } from '../../../support/utilities/apiRequestKeys';


interface TestObjects
{
    testDescription: string;
    requestKeys: string[];
    requestValues: unknown[];
    expectedStatus: number;
    expectedResponseLength?: number;
    expectedResponseKeys?: string[];
    expectedResponseStoreId?: string | boolean;
    expectedResponseUseId?: string | boolean;
    expectedResponseStoreName?: string;
    expectedResponseLabel?: string;
    expectedResponseImageUrl?: string;
}

export const TestList: TestObjects[] = [
    {
        testDescription: 'Create new store',
        requestKeys: [ new AdminAPIRequestKeys().storeName ],
        requestValues: [ 'cypressTest' ],
        expectedStatus: 201,
        expectedResponseLength: 5,
        expectedResponseKeys: [ 'id', 'name', 'userId', 'createdAt', 'updatedAt' ],
        expectedResponseStoreId: false,
        expectedResponseUseId: "user_2rfrlZzqrYe0y1BAXYVYHQRgn8W",
        expectedResponseStoreName: 'cypressTest'
    }
];
