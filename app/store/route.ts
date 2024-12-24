import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import prismadb from "@/app/lib/prismadb";

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

    // If userId is not present, return a 401 Unauthorized response
    if ( !userId ) return new NextResponse( 'Unauthorized', { status: 401 } );

    // If name is not present in the request body, return a 400 Bad Request response
    if ( !name ) return new NextResponse( 'Store name is required', { status: 400 } );

    // Create a new store record in the database with the provided name and userId
    const store = await prismadb.store.create( { data: { name, userId } } );

    // Return the created store record as a JSON response with a 201 Created status
    return NextResponse.json( store, { status: 201 } );
  } catch ( error )
  {
    // Log the error to the console
    console.log( `[Stores_Post] <==: ${error} ==>` );

    // Log an error message to the console
    console.error( 'Error in POST /api/store' );

    // Return a 500 Internal Server Error response
    return new NextResponse( 'Internal error : ', { status: 500 } );
  }
}

