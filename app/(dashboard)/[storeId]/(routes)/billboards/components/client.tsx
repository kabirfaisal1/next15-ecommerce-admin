'use client';
//global inports
import React from 'react';
import { Plus } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';

//local imports
import Heading from '@/components/ui/heading';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { BillboardColumn, columns } from './columns';
import { DataTable } from '@/components/ui/data-table';
import { ApiList } from '@/components/ui/api-list';

interface BillboardClientProps {
	data: BillboardColumn[];
}

export const BillboardClient: React.FC<BillboardClientProps> = ({ data }) => {
	const router = useRouter();
	const params = useParams();
	return (
		<React.Fragment>
			<div className='flex items-center justify-between'>
				<Heading
					title={`Billboards (${data.length})`}
					description='Manage billboards for your store'
				/>
				<Button
					data-testid='add-billboardClient-button'
					onClick={() => router.push(`/${params.storeId}/billboards/new`)}
				>
					<Plus className='mr-2 h-4 w-4' />
					Add New
				</Button>
			</div>
			<Separator />
			<DataTable searchKey='label' columns={columns} data={data} />
			<Heading
				title='API Routes'
				description='API routes for managing billboards'
			/>
			<Separator />
			<ApiList entityName='billboards' entityIdName='billboardId' />
		</React.Fragment>
	);
};
