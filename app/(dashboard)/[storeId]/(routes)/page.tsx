import prismadb from '@/lib/prismadb';
import React from 'react';

interface DashboardPageProps {
	params: { storeId: string };
}

const DashboardPage: React.FC<DashboardPageProps> = async ({ params }) => {
	const store = await prismadb.stores.findUnique({
		where: { id: params.storeId },
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
