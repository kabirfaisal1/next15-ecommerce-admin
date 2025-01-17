// golbal import
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

// local import
import prismadb from "@/lib/prismadb";

// function to POST a new store record in the database
export async function POST ( req: Request )
{
    try
    {
        // Extract userId from the authentication function
        const { userId } = await auth();

        // Parse the JSON body of the request
        const body = await req.json();

        // Destructure the 'name' property from the parsed body
        const { name } = body;


        // If userId is not present, return a 403 Unauthenticated response
        if ( !userId ) return new NextResponse( "Unauthenticated", { status: 403 } );

        // If name is not present in the request body, return a 400 Bad Request response
        if ( !name ) return new NextResponse( 'Store name is required', { status: 400 } );
        // Check if a store with the same name already exists for this user
        const existingStore = await prismadb.stores.findFirst({
            where: {
                name,
                userId
            }
        });

        // If a store with the same name already exists, return a 409 Conflict response
        if (existingStore) {
            return new NextResponse('Store name already exists', { status: 409 });
        }
        // Create a new store record in the database with the provided name and userId
        const store = await prismadb.stores.create( { data: { name, userId } } );

        // Return the created store record as a JSON response with a 201 Created status
        return NextResponse.json( store, { status: 201 } );

    } catch ( error )
    {
        // Log the error to the console
        console.log( `[Store_POST] <==: ${error} ==>` );

        // Return a 500 Internal Server Error response with the error message in the response body
        if ( error instanceof Error )
        {
            return new NextResponse( `Internal error: ${error.message}`, { status: 500 } );
        }

        // Return a 500 Internal Server Error response
        return new NextResponse( 'Internal error : ', { status: 500 } );
    }
}

