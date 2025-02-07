import prismadb from '@/lib/prismadb';

import { SizeForm } from './components/size-form';

const SizePage = async ({
	params,
}: {
	params: { sizeId: string; storeId: string };
}) => {
	const size = await prismadb.sizes.findUnique({
		where: {
			id: params.sizeId,
		},
	});

	const billboards = await prismadb.billboards.findMany({
		where: {
			storeId: params.storeId,
		},
	});

	return (
		<div className='flex-col'>
			<div className='flex-1 space-y-4 p-8 pt-6'>
				<SizeForm billboards={billboards} initialData={size} />
			</div>
		</div>
	);
};

export default SizePage;
