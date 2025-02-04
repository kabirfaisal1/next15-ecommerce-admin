export function createRequestBody (
    requestKeys: string[],
    requestValues: unknown[]
): Record<string, unknown>
{
    if ( requestKeys.length !== requestValues.length )
    {
        throw new Error( 'The number of keys must match the number of values.' );
    }

    const jsonBody: Record<string, unknown> = {};

    for ( let i = 0; i < requestKeys.length; i++ )
    {
        jsonBody[ requestKeys[ i ] ] = requestValues[ i ];
    }

    return jsonBody; // Return a valid JSON object
}
