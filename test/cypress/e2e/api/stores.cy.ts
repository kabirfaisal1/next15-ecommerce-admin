describe( 'New User create store', () =>
{
    let token: string = '';
    beforeEach( () =>
    {
        cy.visit( '/' );
        cy.loginToAuth0();
        cy.getTokens().then( ( clerkToken ) =>
        {
            token = clerkToken;
        } );
    } );


    it( 'Create store for first time', () =>
    {

        cy.request( {
            method: 'POST',
            url: '/api/stores',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: { name: 'cypressTest242' },
        } ).then( ( response ) =>
        {
            cy.log( response.body );
        } );

    } );
} );
