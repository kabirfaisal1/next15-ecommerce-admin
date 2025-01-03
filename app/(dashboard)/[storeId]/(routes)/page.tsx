import prismadb from '@/lib/prismadb';

interface DashboardPageProps {
	params: { storeId: string };
}

// This is a Server Component by default in the `app` directory
const DashboardPage = async ({ params }: DashboardPageProps) => {
	const store = await prismadb.stores.findFirst({
		where: { id: params.storeId },
	});
	// const { userId } = await auth();

	// if (!userId) {
	// 	redirect('/sign-in');
	// }

	// const stores = await params.stores.findFirst({
	// 	where: {
	// 		userId,
	// 	},
	// });
	return (
		<div>
			<h1>
				This is Dashboard Page! StoreName: {store?.name} and storeID:{' '}
				{store?.id}
			</h1>
		</div>
	);
};

export default DashboardPage;
