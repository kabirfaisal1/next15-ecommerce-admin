// global import
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

// local import
import prismadb from "@/lib/prismadb";


// function to POST a new billboards record in the database
export async function POST (
    req: Request,
    { params }: { params: { storeId: string; }; }
)
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
        console.log( "imageUrl is: ", imageUrl );
        // If imageUrl is not present in the request body, return a 400 Bad Request response
        if ( !imageUrl ) return new NextResponse( "imageUrl name is required", { status: 400 } );

        // If storeId is not present in the request body, return a 400 Bad Request response
        if ( !params.storeId ) return new NextResponse( "Store id is required", { status: 400 } );

        const storeByUserId = await prismadb.stores.findFirst( {
            where: {
                id: params.storeId,
                userId,
            }
        } );

        // If no store is found for the given storeId and userId, return a 401 Unauthorized response
        if ( !storeByUserId ) return new NextResponse( "Unauthorized", { status: 401 } );

        // Create a new billboards record in the database with the provided name and userId
        const billboard = await prismadb.billboards.create( {
            data: {
                label,
                imageUrl,
                storeId: params.storeId,
            }
        } );

        return NextResponse.json( billboard );

    } catch ( error )
    {
        // Log the billboards to the console
        console.log( `[BILLBOARDS_PATCH] <==: ${error} ==>` );

        // Return a 500 Internal Server Error response with the error message in the response body
        if ( error instanceof Error )
        {
            return new NextResponse( `Internal error: ${error.message}`, { status: 500 } );
        }
        return new NextResponse( "Internal error", { status: 500 } );
    }
}

// function to GET a billboards record in the database
export async function GET (
    req: Request,
    { params }: { params: { storeId: string; }; }
)
{
    try
    {
        // If storeId is not present in the request body, return a 400 Bad Request response
        if ( !params.storeId ) return new NextResponse( "Store id is required", { status: 400 } );

        // Fetch all billboards associated with the given storeId from the database
        const billboards = await prismadb.billboards.findMany( {
            where: {
                storeId: params.storeId
            }
        } );

        // Return the fetched billboards as a JSON response
        return NextResponse.json( billboards );
    } catch ( error )
    {
        // Log the billboards to the console
        console.log( `[BILLBOARDS_GET] <==: ${error} ==>` );

        // Return a 500 Internal Server Error response with the error message in the response body
        if ( error instanceof Error )
        {
            return new NextResponse( `Internal error: ${error.message}`, { status: 500 } );
        }
        return new NextResponse( "Internal error", { status: 500 } );
    }
}
