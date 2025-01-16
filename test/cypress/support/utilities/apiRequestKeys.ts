// Define an interface for the API request keys
export interface IEcommerceAPIRequestKeys
{
    storeName: string;
    userid: string;
    storeId: string;
    billboardID: string;
    billboardName: string;
    imageUrl: string;
}

// Class implementing the IEcommerceAPIRequestKeys interface
export class AdminAPIRequestKeys implements IEcommerceAPIRequestKeys
{
    storeName = 'name'; // Example key for the store name
    userid = 'userId'; // Example key for user ID
    storeId = 'storeId'; // Example key for the store ID
    billboardID = 'billboardID'; // Example key for billboard ID
    billboardName = 'billboardName'; // Example key for billboard name
    imageUrl = 'imageUrl'; // Example key for the image URL
}
