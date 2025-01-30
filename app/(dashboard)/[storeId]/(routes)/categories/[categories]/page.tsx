// global imports
import prismadb from '@/lib/prismadb';
import { BillboardForm } from './components/category-form';

const BillboardPage = async ({
	params,
}: {
	params: { billboardId: string };
}) => {
	const billboard = await prismadb.billboards.findUnique({
		where: {
			id: params.billboardId,
		},
	});

	return (
		<div className='flex-clo'>
			<div className='flex-1 space-y-4 p-8 pt-6'>
				<BillboardForm initialData={billboard} />
			</div>
		</div>
	);
};

export default BillboardPage;
