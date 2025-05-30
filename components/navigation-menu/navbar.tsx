import { UserButton } from '@clerk/nextjs';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

import StoreSwitcher from '@/components/navigation-menu/store-switcher';
import { MainNav } from '@/components/navigation-menu/main-nav';
import prismadb from '@/lib/prismadb';

const Navbar = async () => {
	// Get the authenticated user's ID
	const { userId } = await auth();

	// Redirect to sign-in page if user is not authenticated
	if (!userId) {
		redirect('/sign-in');
	}

	// Fetch stores associated with the authenticated user
	const stores = await prismadb.stores.findMany({
		where: {
			userId,
		},
	});

	return (
		<div className='border-b'>
			<div className='flex h-16 items-center px-4'>
				<StoreSwitcher items={stores} />
				<MainNav className='mx-6' />

				<div className='ml-auto flex items-center space-x-4'>
					<UserButton />
				</div>
			</div>
		</div>
	);
};

export default Navbar;
