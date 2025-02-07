//global imports
import { format } from 'date-fns';

//local imports
import prismadb from '@/lib/prismadb';
import { SizeClient } from './components/client';
import { SizeColumn } from './components/columns';

const SizePage = async ({ params }: { params: { storeId: string } }) => {
	const sizes = await prismadb.sizes.findMany({
		where: {
			storeId: params.storeId,
		},
		include: {
			billboard: true,
		},
		orderBy: {
			createdAt: 'desc',
		},
	});

	const formattedSize: SizeColumn[] = sizes.map(item => ({
		id: item.id,
		name: item.name,
		billboardLabel: item.billboard.label,
		createdAt: format(item.createdAt, 'MMMM do, yyyy'),
		updatedAt: format(item.updatedAt, 'MMMM do, yyyy'),
	}));

	return (
		<div className='flex-col'>
			<div className='flex-1 space-y-4 p-8 pt-6'>
				<SizeClient data={formattedSize} />
			</div>
		</div>
	);
};

export default SizePage;
