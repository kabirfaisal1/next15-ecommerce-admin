import prismadb from '@/lib/prismadb';

/**
 * Props for the DashboardPage component.
 *
 * @interface DashboardPageProps
 * @property {Object} params - The parameters for the dashboard page.
 * @property {string} params.storeId - The unique identifier for the store.
 */
interface DashboardPageProps {
	params: { storeId: string };
}
// This is a Server Component by default in the `app` directory
const DashboardPage = async ({ params }: DashboardPageProps) => {
	// Fetch the store details from the database using the storeId parameter
	const { storeId } = await params;
	const store = await prismadb.stores.findUnique({
		where: {
			id: storeId,
		},
	});

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
