export class TestObjects
{
    // Property implementations that hold the key names for each piece of claim-related data
    testDescription: string; // Name of the store
    testId: string; // User identifier
    requestBody: string; // Identifier for the store
    expectedResponse: string; // Identifier for the billboard

    constructor ()
    {
        this.testDescription = '';
        this.testId = '';
        this.requestBody = '';
        this.expectedResponse = '';
    }
}
