import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

import prismadb from "@/lib/prismadb";


export async function GET (
    req: Request,
    { params }: { params: { categoryId: string; }; }
)
{
    try
    {
        if ( !params.categoryId )
        {
            return new NextResponse( "Categories id is required", { status: 400 } );
        }

        const category = await prismadb.categories.findUnique( {
            where: {
                id: params.categoryId
            }
        } );

        return NextResponse.json( category );
    } catch ( error )
    {
        console.log( '[CATEGORIES_GET]', error );
        return new NextResponse( "Internal error", { status: 500 } );
    }
};

export async function DELETE (
    req: Request,
    { params }: { params: { categoryId: string, storeId: string; }; }
)
{
    try
    {
        const { userId } = await auth();

        if ( !userId )
        {
            return new NextResponse( "Unauthenticated", { status: 403 } );
        }

        if ( !params.categoryId )
        {
            return new NextResponse( "Categories id is required", { status: 400 } );
        }

        const storeByUserId = await prismadb.stores.findFirst( {
            where: {
                id: params.storeId,
                userId,
            }
        } );

        if ( !storeByUserId )
        {
            return new NextResponse( "Unauthorized", { status: 405 } );
        }

        const category = await prismadb.categories.delete( {
            where: {
                id: params.categoryId,
            }
        } );

        if ( !category )
        {
            return new NextResponse( "Categories not found", { status: 204 } );
        }

        return NextResponse.json( category );
    } catch ( error )
    {
        console.log( '[CATEGORIES_DELETE]', error );
        return new NextResponse( "Internal error", { status: 500 } );
    }
};


export async function PATCH (
    req: Request,
    { params }: { params: { categoryId: string, storeId: string; }; }
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

        const { name, billboardId } = body;

        if ( !userId )
        {
            return new NextResponse( "Unauthenticated", { status: 403 } );
        }

        if ( !name )
        {
            return new NextResponse( "Name is required", { status: 400 } );
        }

        if ( !billboardId )
        {
            return new NextResponse( "BillboardId URL is required", { status: 400 } );
        }

        if ( !params.categoryId )
        {
            return new NextResponse( "Categories id is required", { status: 400 } );
        }

        const storeByUserId = await prismadb.stores.findFirst( {
            where: {
                id: params.storeId,
                userId,
            }
        } );

        if ( !storeByUserId )
        {
            return new NextResponse( "Unauthorized", { status: 405 } );
        }

        const category = await prismadb.categories.update( {
            where: {
                id: params.categoryId,
            },
            data: {
                name,
                billboardId
            }
        } );

        return NextResponse.json( category );
    } catch ( error )
    {
        console.log( '[CATEGORIES_PATCH]', error );
        return new NextResponse( "Internal error", { status: 500 } );
    }
};
