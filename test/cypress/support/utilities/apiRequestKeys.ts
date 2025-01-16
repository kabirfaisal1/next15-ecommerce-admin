// Interface defining a contract for a Spark API request key
interface IEcommerceAPIRequestKeys
{
    // Properties representing various keys that can be used in API requests
    storeName: string;
    userid: string;
    storeId: string;
    billboardID: string;
    billboardName: string;
    imageUrl: string;
}

// Class implementing the IEcommerceAPIRequestKeys interface
// This class defines the keys to be used in API requests (like storeId, storeName, etc.)
export class AdminAPIRequestKeys implements IEcommerceAPIRequestKeys
{
    // Property implementations that hold the key names for each piece of claim-related data
    storeName = "storeName"; // Name of the store
    userid = "userId"; // User identifier
    storeId = "storeId"; // Identifier for the store
    billboardID = "billboardID"; // Identifier for the billboard
    billboardName = "billboardName"; // Name of the billboard
    imageUrl = "imageUrl"; // URL for the image
}
