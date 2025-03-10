import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

import prismadb from "@/lib/prismadb";


export async function GET (
    req: Request,
    { params }: { params: { colorId: string; }; }
)
{
    try
    {
        if ( !params.colorId )
        {
            return new NextResponse( "ColorId  is required", { status: 400 } );
        }

        const color = await prismadb.colors.findUnique( {
            where: {
                id: params.colorId
            }
        } );

        return NextResponse.json( color );
    } catch ( error )
    {
        console.log( '[COLORS_GET]', error );
        return new NextResponse( "Internal error", { status: 500 } );
    }
};

export async function DELETE (
    req: Request,
    { params }: { params: { storeId: string, colorId: string; }; }
)
{
    try
    {
        const { userId } = await auth();

        if ( !userId )
        {
            return new NextResponse( "Unauthenticated", { status: 403 } );
        }

        if ( !params.colorId )
        {
            return new NextResponse( "Color ID is required", { status: 400 } );
        }

        const storeByUserId = await prismadb.stores.findFirst( {
            where: {
                id: params.storeId,
                userId,
            },
        } );

        if ( !storeByUserId )
        {
            return new NextResponse( "Unauthorized", { status: 405 } );
        }

        const size = await prismadb.colors.deleteMany( {
            where: {
                id: params.colorId,
            },
        } );

        if ( !size )
        {
            return new NextResponse( "Color not found", { status: 204 } );
        }

        return NextResponse.json( {
            message: "Successfully deleted",
            size,
        } );
    } catch ( error )
    {
        console.log( "[COLORS_DELETE]", error );
        return new NextResponse( "Internal error", { status: 500 } );
    }
};

export async function PATCH (
    req: Request,
    { params }: { params: { storeId: string, colorId: string; }; }
)
{
    try
    {
        const { userId } = await auth();

        if ( !userId )
        {
            return new NextResponse( "Unauthenticated", { status: 403 } );
        }

        const body = await req.json();
        const { name, value } = body;

        if ( !name )
        {
            return new NextResponse( "Name is required", { status: 400 } );
        }

        if ( !value )
        {
            return new NextResponse( "Value is required", { status: 400 } );
        }

        const hexCodePattern = /^#[0-9A-Fa-f]{6}$/;
        if ( !hexCodePattern.test( value ) )
        {
            return new NextResponse( "Value must be a valid hex code (e.g., #FFFFFF). For more help, visit https://colorhunt.co/", { status: 400 } );
        }


        if ( !params.colorId )
        {
            return new NextResponse( "Color ID is required", { status: 400 } );
        }

        const storeByUserId = await prismadb.stores.findFirst( {
            where: {
                id: params.storeId,
                userId,
            },
        } );

        if ( !storeByUserId )
        {
            return new NextResponse( "Unauthorized", { status: 405 } );
        }

        const size = await prismadb.colors.updateMany( {
            where: {
                id: params.colorId,
            },
            data: {
                name,
                value,
            },
        } );

        return NextResponse.json( {
            message: "Successfully Updated",
            size,
        } );
    } catch ( error )
    {
        console.log( "[COLORS_PATCH]", error );
        return new NextResponse( "Internal error", { status: 500 } );
    }
};
