import { PrismaClient } from '@prisma/client';

/**
 * Declares a global variable `prisma` of type `PrismaClient` or `undefined`.
 * This allows the `prisma` client to be accessed globally within the application,
 * preventing the need to import it in every file where it is used.
 * 
 * @global
 * @var {PrismaClient | undefined} prisma - The Prisma client instance or undefined.
 */
/* eslint-disable no-var */
declare global
{
    var prisma: PrismaClient | undefined;
}
/* eslint-enable no-var */

const prismadb = global.prisma || new PrismaClient();

if ( process.env.NODE_ENV !== 'production' )
{
    global.prisma = prismadb;
}

export default prismadb;
