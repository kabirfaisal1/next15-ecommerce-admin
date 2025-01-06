import { redirect } from 'next/navigation';
import { auth } from '@clerk/nextjs/server';

import prismadb from '@/lib/prismadb';

/**
 * Asynchronous function that sets up the layout for the application.
 * It checks the authentication status of the user and redirects them
 * to the sign-in page if they are not authenticated. If the user is
 * authenticated and has an associated store, it redirects them to
 * their store page. Otherwise, it renders the children components.
 *
 * @param {Object} props - The properties object.
 * @param {React.ReactNode} props.children - The child components to be rendered.
 * @returns {JSX.Element} The rendered children components or a redirection.
 */
export default async function SetupLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const { userId } = await auth();

	if (!userId) {
		redirect('/sign-in');
	}

	const store = await prismadb.stores.findFirst({
		where: {
			userId,
		},
	});

	if (store) {
		redirect(`/${store.id}`);
	}

	return <>{children}</>;
}
