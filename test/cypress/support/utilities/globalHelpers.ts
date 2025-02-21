/**
 * Creates a request body object from an array of keys and values.
 * 
 * @param {string[]} requestKeys - The array of keys to be used in the request body.
 * @param {unknown[]} requestValues - The array of values corresponding to the keys.
 * @returns {Record<string, unknown>} - A JSON object constructed from the provided keys and values.
 * @throws {Error} - Throws an error if the number of keys and values do not match.
 */
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
