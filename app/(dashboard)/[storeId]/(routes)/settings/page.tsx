//global import
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import React from 'react';

// local import
import prismadb from '@/lib/prismadb';
import { SettingForm } from './components/settings-form';

interface SettingPageProps {
	params: { storeId: string };
}
// This is a Server Component by default in the `app` directory
const SettingsPage: React.FC<SettingPageProps> = async ({
	params,
}: SettingPageProps) => {
	// Resolve the params promise to get the storeId
	const resolvedParams = await params;
	const { userId } = await auth();

	// Check if the user is authenticated
	if (!userId) {
		redirect('/sign-in');
	}

	// Fetch the store data from the database
	const store = await prismadb.stores.findUnique({
		where: {
			id: resolvedParams.storeId,
			userId,
		},
	});

	// If the store does not exist, redirect to the home page
	if (!store) {
		redirect('/');
	}

	return (
		<div className='flec-col'>
			<div className='flec-1 space-y-4 p-8 pt-6'>
				{/* This is the SettingForm content of the page */}
				<SettingForm initialData={store} />
			</div>
		</div>
	);
};

export default SettingsPage;
