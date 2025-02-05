
// Define an interface for the API request keys
export interface IEcommerceAPIRequestKeys
{
    storeName: string;
    categoryName: string;
    userid: string;
    storeId: string;
    billboardId: string;
    billboardName: string;
    imageUrl: string;
}

// Class implementing the IEcommerceAPIRequestKeys interface
export class AdminAPIRequestKeys implements IEcommerceAPIRequestKeys
{
    storeName = 'name'; // Example key for the store name
    categoryName = 'name'; // Example key for the category name
    userid = 'userId'; // Example key for user ID
    storeId = 'storeId'; // Example key for the store ID
    billboardId = 'billboardId'; // Example key for billboard ID
    billboardName = 'label'; // Example key for billboard name
    imageUrl = 'imageUrl'; // Example key for the image URL
}
