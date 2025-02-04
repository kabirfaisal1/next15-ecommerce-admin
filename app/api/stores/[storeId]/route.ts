// golbal import
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

// local import
import prismadb from "@/lib/prismadb";

export async function PATCH ( req: Request,
    { params }: { params: { storeId: string; }; } )
{
    try
    {
        // Extract userId from the authentication function
        const { userId } = await auth();

        // Parse the JSON body of the request
        const body = await req.json();

        // Destructure the 'name' property from the parsed body
        const { name } = body;

        // If userId is not present, return a 401 Unauthenticated response
        if ( !userId ) return new NextResponse( 'Unauthenticated', { status: 401 } );

        // If name is not present in the request body, return a 400 Bad Request response
        if ( !name ) return new NextResponse( 'Name is required', { status: 400 } );

        // Find the store record with the provided storeId
        if ( !params.storeId ) return new NextResponse( 'Store ID is required', { status: 400 } );

        const store = await prismadb.stores.updateMany( {
            where: { id: params.storeId, userId },
            data: { name },
        } );

        // Return the created store record as a JSON response with a 202 (Accepted) updated status
        return NextResponse.json( store, { status: 202 } );

    } catch ( error )
    {
        // Log the error to the console
        console.log( `[Store_PATCH] <==: ${error} ==>` );

        // Return a 500 Internal Server Error response with the error message in the response body
        if ( error instanceof Error )
        {
            return new NextResponse( `Internal error: ${error.message}`, { status: 500 } );
        }

        // Return a 500 Internal Server Error response
        return new NextResponse( 'Internal error : ', { status: 500 } );
    }
}

export async function DELETE (
    req: Request,
    { params }: { params: { storeId: string; }; }
)
{
    try
    {
        // Authenticate user
        const { userId } = await auth();
        if ( !userId ) return new NextResponse( "Unauthenticated", { status: 403 } );

        // Validate storeId
        if ( !params.storeId ) return new NextResponse( "Store ID is required", { status: 400 } );

        // Find the store associated with the user
        const store = await prismadb.stores.findFirst( {
            where: { id: params.storeId, userId },
        } );

        if ( !store ) return new NextResponse( "Store not found or unauthorized", { status: 404 } );

        // Check if the store has any billboards
        const billboardCount = await prismadb.billboards.count( {
            where: { storeId: params.storeId },
        } );

        if ( billboardCount > 0 )
        {
            return new NextResponse(
                "Make sure you remove all billboards before deleting the store.",
                { status: 400 }
            );
        }

        // Check if the store has any categories
        const categoryCount = await prismadb.categories.count( {
            where: { storeId: params.storeId },
        } );

        if ( categoryCount > 0 )
        {
            return new NextResponse(
                "Make sure you remove all categories before deleting the store.",
                { status: 400 }
            );
        }

        // // Check if the store has any products (if your schema includes a `Products` model)
        // const productCount = await prismadb.products?.count( {
        //     where: { storeId: params.storeId },
        // } );

        // if ( productCount > 0 )
        // {
        //     return new NextResponse(
        //         "Make sure you remove all products before deleting the store.",
        //         { status: 400 }
        //     );
        // }

        // Delete the store since it has no dependencies
        const deletedStore = await prismadb.stores.delete( {
            where: { id: params.storeId },
        } );

        return NextResponse.json( deletedStore, { status: 200 } );

    } catch ( error )
    {
        console.log( `[Store_DELETE] <==: ${error} ==>` );
        return new NextResponse(
            `Internal error: ${error instanceof Error ? error.message : "Unknown error"}`,
            { status: 500 }
        );
    }
}
