import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

import prismadb from "@/lib/prismadb";


export async function GET (
    req: Request,
    { params }: { params: { sizeId: string; }; }
)
{
    try
    {
        if ( !params.sizeId )
        {
            return new NextResponse( "SizeId  is required", { status: 400 } );
        }

        const size = await prismadb.sizes.findUnique( {
            where: {
                id: params.sizeId
            }
        } );

        return NextResponse.json( size );
    } catch ( error )
    {
        console.log( '[SIZES_GET]', error );
        return new NextResponse( "Internal error", { status: 500 } );
    }
};

export async function DELETE (
    req: Request,
    { params }: { params: { storeId: string, sizeId: string; }; }
)
{
    try
    {
        const { userId } = await auth();

        if ( !userId )
        {
            return new NextResponse( "Unauthenticated", { status: 403 } );
        }

        if ( !params.sizeId )
        {
            return new NextResponse( "Size ID is required", { status: 400 } );
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

        const size = await prismadb.sizes.deleteMany( {
            where: {
                id: params.sizeId,
            },
        } );

        if ( !size )
        {
            return new NextResponse( "Size not found", { status: 204 } );
        }

        return NextResponse.json( {
            message: "Successfully deleted",
            size,
        } );
    } catch ( error )
    {
        console.log( "[SIZES_DELETE]", error );
        return new NextResponse( "Internal error", { status: 500 } );
    }
};

export async function PATCH (
    req: Request,
    { params }: { params: { storeId: string, sizeId: string; }; }
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

        if ( !params.sizeId )
        {
            return new NextResponse( "Size ID is required", { status: 400 } );
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

        const size = await prismadb.sizes.updateMany( {
            where: {
                id: params.sizeId,
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
        console.log( "[SIZES_PATCH]", error );
        return new NextResponse( "Internal error", { status: 500 } );
    }
};
