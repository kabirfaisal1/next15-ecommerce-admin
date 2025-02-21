// global import
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

// local import
import prismadb from "@/lib/prismadb";


// function to POST a new Categories record in the database
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
        const { name, value } = body;

        // If userId is not present, return a 403 Unauthenticated response
        if ( !userId ) return new NextResponse( "Unauthenticated", { status: 403 } );

        // If name is not present in the request body, return a 400 Bad Request response
        if ( !name ) return new NextResponse( "Color name is required", { status: 400 } );
        console.log( "name is: ", name );

        // If value is not present in the request body, return a 400 Bad Request response
        if ( !value ) return new NextResponse( "Color Value is required", { status: 400 } );

        const hexCodePattern = /^#[0-9A-Fa-f]{6}$/;
        if ( !hexCodePattern.test(value) ) {
            return new NextResponse( "Value must be a valid hex code (e.g., #FFFFFF). For more help, visit https://colorhunt.co/", { status: 400 } );
        }
        

        // If colorId is not present in the request body, return a 400 Bad Request response
        if ( !params.storeId ) return new NextResponse( "Store id is required", { status: 400 } );

        const storeByUserId = await prismadb.stores.findFirst( {
            where: {
                id: params.storeId,
                userId,
            }
        } );

        // If no store is found for the given colorId and userId, return a 401 Unauthorized response
        if ( !storeByUserId ) return new NextResponse( "Unauthorized", { status: 401 } );

        // Create a new Categories record in the database with the provided name and userId
        const color = await prismadb.colors.create( {
            data: {
                name,
                value,
                storeId: params.storeId,
            }
        } );

        return NextResponse.json( color );

    } catch ( error )
    {
        // Log the Categories to the console
        console.log( `[COLORS_POST] <==: ${error} ==>` );

        // Return a 500 Internal Server Error response with the error message in the response body
        if ( error instanceof Error )
        {
            return new NextResponse( `Internal error: ${error.message}`, { status: 500 } );
        }
        return new NextResponse( "Internal error", { status: 500 } );
    }
}

// function to GET a Categories record in the database
export async function GET (
    req: Request,
    { params }: { params: { storeId: string; }; }
)
{
    try
    {
        // If storeId is not present in the request body, return a 400 Bad Request response
        if ( !params.storeId ) return new NextResponse( "Store id is required", { status: 400 } );

        // Fetch all Categories associated with the given colorId from the database
        const colors = await prismadb.colors.findMany( {
            where: {
                storeId: params.storeId
            }
        } );

        // Return the fetched Categories as a JSON response
        return NextResponse.json( colors );
    } catch ( error )
    {
        // Log the Categories to the console
        console.log( `[COLORS_GET] <==: ${error} ==>` );

        // Return a 500 Internal Server Error response with the error message in the response body
        if ( error instanceof Error )
        {
            return new NextResponse( `Internal error: ${error.message}`, { status: 500 } );
        }
        return new NextResponse( "Internal error", { status: 500 } );
    }
}
