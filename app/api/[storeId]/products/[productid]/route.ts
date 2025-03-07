// global import
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

// local import
import prismadb from "@/lib/prismadb";

export async function GET (
    req: Request,
    { params }: { params: { productId: string; }; }
)
{
    try
    {
        if ( !params.productId )
        {
            return new NextResponse( "Product ID is required", { status: 400 } );
        }

        const product = await prismadb.products.findUnique( {
            where: { id: params.productId },
            include: {
                images: true,
                category: true,
                size: true,
                color: true,
            }
        } );

        if ( !product )
        {
            return new NextResponse( "Product not found", { status: 404 } );
        }


        const formattedProduct = {
            id: product.id,
            storeId: product.storeId,
            categoryId: product.categoryId,
            name: product.name,
            price: product.price.toNumber(), // Convert Decimal to Number
            isFeatured: product.isFeatured,
            isArchived: product.isArchived,
            sizeId: product.sizeId,
            colorId: product.colorId,
            createdAt: product.createdAt.toISOString(), // Convert Date to String
            updatedAt: product.updatedAt.toISOString(), // Convert Date to String


            images: product.images.map( ( image ) => ( {
                id: image.id,
                productId: image.productId,
                url: image.url,
                createdAt: image.createdAt.toISOString(),
                updatedAt: image.updatedAt.toISOString(),
            } ) ),


            category: product.category
                ? { id: product.category.id, name: product.category.name }
                : null,
            size: product.size ? { id: product.size.id, name: product.size.name } : null,
            color: product.color ? { id: product.color.id, name: product.color.name } : null,
        };

        return NextResponse.json( formattedProduct );

    } catch ( error )
    {
        console.error( '[PRODUCT_GET]', error );
        return new NextResponse( "Internal error", { status: 500 } );
    }
};



export async function DELETE (
    req: Request,
    { params }: { params: { productId: string, storeId: string; }; }
)
{
    console.log( "Params in component:", params );
    try
    {
        // Extract userId from the authentication function
        const { userId } = await auth();

        if ( !userId )
        {
            return new NextResponse( "Unauthenticated", { status: 403 } );
        }

        if ( !params.productId )
        {
            return new NextResponse( "Product id is required", { status: 400 } );
        }

        const storeByUserId = await prismadb.stores.findFirst( {
            where: {
                id: params.storeId,
                userId
            }
        } );

        if ( !storeByUserId )
        {
            return new NextResponse( "Unauthorized", { status: 405 } );
        }

        const products = await prismadb.products.delete( {
            where: {
                id: params.productId
            },
        } );

        return NextResponse.json( products );
    } catch ( error )
    {
        console.log( '[PRODUCT_DELETE]', error );
        return new NextResponse( "Internal error", { status: 500 } );
    }
};


export async function PATCH (
    req: Request,
    { params }: { params: { productId: string, storeId: string; }; }
)
{
    try
    {
        // Extract userId from the authentication function
        const { userId } = await auth();

        const body = await req.json();

        const { name, price, categoryId, images, colorId, sizeId, isFeatured, isArchived } = body;

        if ( !userId )
        {
            return new NextResponse( "Unauthenticated", { status: 403 } );
        }

        if ( !params.productId )
        {
            return new NextResponse( "Product id is required", { status: 400 } );
        }

        if ( !name )
        {
            return new NextResponse( "Name is required", { status: 400 } );
        }

        if ( !images || !images.length )
        {
            return new NextResponse( "Images are required", { status: 400 } );
        }

        if ( !price )
        {
            return new NextResponse( "Price is required", { status: 400 } );
        }

        if ( !categoryId )
        {
            return new NextResponse( "Category id is required", { status: 400 } );
        }

        if ( !colorId )
        {
            return new NextResponse( "Color id is required", { status: 400 } );
        }

        if ( !sizeId )
        {
            return new NextResponse( "Size id is required", { status: 400 } );
        }

        const storeByUserId = await prismadb.stores.findFirst( {
            where: {
                id: params.storeId,
                userId
            }
        } );

        if ( !storeByUserId )
        {
            return new NextResponse( "Unauthorized", { status: 405 } );
        }

        await prismadb.products.update( {
            where: {
                id: params.productId
            },
            data: {
                name,
                price,
                categoryId,
                colorId,
                sizeId,
                images: {
                    deleteMany: {},
                },
                isFeatured,
                isArchived,
            },
        } );

        const products = await prismadb.products.update( {
            where: {
                id: params.productId
            },
            data: {
                images: {
                    createMany: {
                        data: [
                            ...images.map( ( image: { url: string; } ) => image ),
                        ],
                    },
                },
            },
        } );

        return NextResponse.json( products );
    } catch ( error )
    {
        console.log( '[PRODUCT_PATCH]', error );
        return new NextResponse( "Internal error", { status: 500 } );
    }
};
