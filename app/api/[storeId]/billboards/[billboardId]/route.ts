// golbal import
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

// local import
import prismadb from "@/lib/prismadb";


// function to GET a new billboards record in the database
export async function GET ( req: Request,
    { params }: { params: { billboardsId: string; }; } )
{
    try
    {

        // Extract userId from the authentication function
        const { userId } = await auth();

        // If userId is not present, return a 403 Unauthenticated response
        if ( !userId ) return new NextResponse( "Unauthenticated", { status: 403 } );

        // If billboardsId is not present in the request body, return a 400 Bad Request response
        if ( !params.billboardsId ) return new NextResponse( "Store id is required", { status: 400 } );

        // Delete a new billboards record in the database with the provided name and userId
        const billboard = await prismadb.billboards.findUnique( {
            where: {
                id: params.billboardsId,
            }
        } );

        return NextResponse.json( billboard );

    } catch ( error )
    {
        // Log the error to the console
        console.log( `[BILLBOARDS_DELETE] <==: ${error} ==>` );

        // Return a 500 Internal Server Error response with the error message in the response body
        if ( error instanceof Error )
        {
            return new NextResponse( `Internal error: ${error.message}`, { status: 500 } );
        }

        // Return a 500 Internal Server Error response
        return new NextResponse( 'Internal error : ', { status: 500 } );
    }
}


// function to update a new billboards record in the database
export async function PATCH ( req: Request,
    { params }: { params: { storeId: string, billboardsId: string; }; } )
{
    try
    {

        // Extract userId from the authentication function
        const { userId } = await auth();

        // Parse the JSON body of the request
        const body = await req.json();

        // Destructure the 'label and imageUrl' property from the parsed body
        const { label, imageUrl } = body;

        // If userId is not present, return a 403 Unauthenticated response
        if ( !userId ) return new NextResponse( "Unauthenticated", { status: 403 } );

        // If label is not present in the request body, return a 400 Bad Request response
        if ( !label ) return new NextResponse( "Label name is required", { status: 400 } );

        // If imageUrl is not present in the request body, return a 400 Bad Request response
        if ( !imageUrl ) return new NextResponse( "ImageUrl name is required", { status: 400 } );

        // If storeId is not present in the request body, return a 400 Bad Request response
        if ( !params.storeId ) return new NextResponse( "Store id is required", { status: 400 } );

        /**
         * Retrieves the first store that matches the provided store ID and user ID.
         *
         * @constant {Object} storeByUserId - The store object retrieved from the database.
         * @property {string} storeByUserId.id - The ID of the store.
         * @property {string} storeByUserId.userId - The ID of the user associated with the store.
         *
         * @async
         * @function
         * @param {Object} params - The parameters containing the store ID.
         * @param {string} params.storeId - The ID of the store to retrieve.
         * @param {string} userId - The ID of the user to match with the store.
         * @returns {Promise<Object|null>} The store object if found, otherwise null.
         */
        const storeByUserId = await prismadb.stores.findFirst( {
            where: {
                id: params.storeId,
                userId,
            }
        } );

        // If no store is found for the given storeId and userId, return a 401 Unauthorized response
        if ( !storeByUserId ) return new NextResponse( "Unauthorized", { status: 401 } );

        // Update a new billboards record in the database with the provided name and userId
        const billboard = await prismadb.billboards.updateMany( {
            where: {
                id: params.billboardsId,
            },
            data: {
                label,
                imageUrl,
            }
        } );

        return NextResponse.json( billboard );

    } catch ( error )
    {
        // Log the error to the console
        console.log( `[BILLBOARDS_PATCH] <==: ${error} ==>` );

        // Return a 500 Internal Server Error response with the error message in the response body
        if ( error instanceof Error )
        {
            return new NextResponse( `Internal error: ${error.message}`, { status: 500 } );
        }

        // Return a 500 Internal Server Error response
        return new NextResponse( 'Internal error : ', { status: 500 } );
    }
}

export async function DELETE ( req: Request,
    { params }: { params: { storeId: string, billboardsId: string; }; } )
{
    try
    {
        // Extract userId from the authentication function
        const { userId } = await auth();

        // If userId is not present, return a 403 Unauthenticated response
        if ( !userId ) return new NextResponse( "Unauthenticated", { status: 403 } );

        // If billboardsId is not present in the request body, return a 400 Bad Request response
        if ( !params.billboardsId ) return new NextResponse( "Store id is required", { status: 400 } );

        // If storeId is not present in the request body, return a 400 Bad Request response
        if ( !params.storeId ) return new NextResponse( "Store id is required", { status: 400 } );

        /**
         * Retrieves the first store that matches the provided store ID and user ID.
         *
         * @constant {Object} storeByUserId - The store object retrieved from the database.
         * @property {string} storeByUserId.id - The ID of the store.
         * @property {string} storeByUserId.userId - The ID of the user associated with the store.
         *
         * @async
         * @function
         * @param {Object} params - The parameters containing the store ID.
         * @param {string} params.storeId - The ID of the store to retrieve.
         * @param {string} userId - The ID of the user to match with the store.
         * @returns {Promise<Object|null>} The store object if found, otherwise null.
         */
        const storeByUserId = await prismadb.stores.findFirst( {
            where: {
                id: params.storeId,
                userId,
            }
        } );

        // If no store is found for the given storeId and userId, return a 401 Unauthorized response
        if ( !storeByUserId ) return new NextResponse( "Unauthorized", { status: 401 } );

        // Delete a new billboards record in the database with the provided name and userId
        const billboard = await prismadb.billboards.deleteMany( {
            where: {
                id: params.billboardsId,
            }
        } );

        return NextResponse.json( billboard );

    } catch ( error )
    {
        // Log the error to the console
        console.log( `[BILLBOARDS_DELETE] <==: ${error} ==>` );

        // Return a 500 Internal Server Error response with the error message in the response body
        if ( error instanceof Error )
        {
            return new NextResponse( `Internal error: ${error.message}`, { status: 500 } );
        }

        // Return a 500 Internal Server Error response
        return new NextResponse( 'Internal error : ', { status: 500 } );
    }
}
