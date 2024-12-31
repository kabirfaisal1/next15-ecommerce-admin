//global import
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import React from 'react';

// local import
import prismadb from '@/lib/prismadb';
import Navbar from '@/components/custom/navbar';

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
