import { AdminAPIRequestKeys } from '../../../support/utilities/apiRequestKeys';


interface TestObjects
{
    testDescription: string;
    requestKeys: string[];
    requestValues: unknown[];
    expectedStatus: number;
}

export const TestList: TestObjects[] = [
    {
        testDescription: 'Create new store',
        requestKeys: [ new AdminAPIRequestKeys().storeName ],
        requestValues: [ 'cypressTest' ],
        expectedStatus: 201
    }
];
