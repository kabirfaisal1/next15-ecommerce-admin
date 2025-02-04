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

export async function DELETE ( req: Request,
    { params }: { params: { storeId: string; }; } )
{
    try
    {
        // Extract userId from the authentication function
        const { userId } = await auth();

        // If userId is not present, return a 401 Unauthenticated response
        if ( !userId ) return new NextResponse( 'Unauthenticated', { status: 403 } );

        // Find the store record with the provided storeId
        if ( !params.storeId ) return new NextResponse( 'Store ID is required', { status: 400 } );

        const store = await prismadb.stores.deleteMany( {
            where: { id: params.storeId, userId }
        } );
        // Return the created store record as a JSON response with a 200 (DELETE) updated status
        return NextResponse.json( store, { status: 200 } );

    } catch ( error )
    {
        // Log the error to the console
        console.log( `[Store_DELETE] <==: ${error} ==>` );

        // Return a 500 Internal Server Error response with the error message in the response body
        if ( error instanceof Error )
        {
            return new NextResponse( `Internal error: ${error.message}`, { status: 500 } );
        }

        // Return a 500 Internal Server Error response
        return new NextResponse( 'Internal error : ', { status: 500 } );
    }
}
