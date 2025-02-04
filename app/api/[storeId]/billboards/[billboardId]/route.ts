import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

import prismadb from "@/lib/prismadb";

export async function GET (
    req: Request,
    { params }: { params: { billboardId: string; }; }
)
{
    try
    {
        if ( !params.billboardId )
        {
            return new NextResponse( "Billboard id is required", { status: 400 } );
        }

        const billboard = await prismadb.billboards.findUnique( {
            where: {
                id: params.billboardId
            }
        } );

        return NextResponse.json( billboard );
    } catch ( error )
    {
        console.log( '[BILLBOARD_GET]', error );
        return new NextResponse( "Internal error", { status: 500 } );
    }
};

export async function DELETE (
    req: Request,
    { params }: { params: { billboardId: string; storeId: string; }; }
)
{
    try
    {
        const { userId } = await auth();

        if ( !userId )
        {
            return new NextResponse( "Unauthenticated", { status: 403 } );
        }

        if ( !params.billboardId )
        {
            return new NextResponse( "Billboard id is required", { status: 400 } );
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

        // Check if there are any categories linked to this billboard
        const categoryCount = await prismadb.categories.count( {
            where: {
                billboardId: params.billboardId,
            }
        } );

        if ( categoryCount > 0 )
        {
            return new NextResponse(
                `Make sure you remove all categories linked to this billboard before deleting.`,
                { status: 400 }
            );
        }

        // Delete the billboard
        const billboard = await prismadb.billboards.delete( {
            where: {
                id: params.billboardId,
            }
        } );

        if ( !billboard )
        {
            return new NextResponse( "Billboard not found", { status: 204 } );
        }

        return NextResponse.json( billboard );
    } catch ( error )
    {
        console.log( "[BILLBOARD_DELETE]", error );
        return new NextResponse( "Internal error", { status: 500 } );
    }
}


export async function PATCH (
    req: Request,
    { params }: { params: { billboardId: string, storeId: string; }; }
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

        const { label, imageUrl } = body;

        if ( !userId )
        {
            return new NextResponse( "Unauthenticated", { status: 403 } );
        }

        if ( !label )
        {
            return new NextResponse( "Label is required", { status: 400 } );
        }

        if ( !imageUrl )
        {
            return new NextResponse( "Image URL is required", { status: 400 } );
        }

        if ( !params.billboardId )
        {
            return new NextResponse( "Billboard id is required", { status: 400 } );
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

        const billboard = await prismadb.billboards.update( {
            where: {
                id: params.billboardId,
            },
            data: {
                label,
                imageUrl
            }
        } );

        return NextResponse.json( billboard );
    } catch ( error )
    {
        console.log( '[BILLBOARD_PATCH]', error );
        return new NextResponse( "Internal error", { status: 500 } );
    }
};
