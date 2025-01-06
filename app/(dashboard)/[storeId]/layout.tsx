//global import
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import React from 'react';

// local import
import Navbar from '@/components/navigation-menu/navbar';
import prismadb from '@/lib/prismadb';

/**
 * DashboardLayout is an asynchronous React component that serves as the layout for the dashboard page.
 * It ensures that the user is authenticated and has access to the specified store.
 * If the user is not authenticated, they are redirected to the sign-in page.
 * If the store is not found or the user does not have access to it, they are redirected to the home page.
 *
 * @param {Object} props - The properties object.
 * @param {React.ReactNode} props.children - The child components to be rendered within the layout.
 * @param {Promise<{ storeId: string }>} props.params - A promise that resolves to an object containing the storeId.
 *
 * @returns {JSX.Element} The rendered layout component.
 */
export default async function DashboardLayout({
	children,
	params,
}: {
	children: React.ReactNode;
	params: Promise<{ storeId: string }>;
}) {
	// Resolve the params promise to get the storeId
	const resolvedParams = await params;
	const { userId } = await auth();

	if (!userId) {
		redirect('/sign-in');
	}

	const store = await prismadb.stores.findUnique({
		where: {
			id: resolvedParams.storeId,
			userId,
		},
	});

	if (!store) {
		redirect('/');
	}

	return (
		<React.Fragment>
			<Navbar />
			{children}
		</React.Fragment>
	);
}
