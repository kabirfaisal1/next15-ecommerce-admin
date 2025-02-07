'use client';
//global inports
import React from 'react';
import { Plus } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';

//local imports
import Heading from '@/components/ui/heading';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { SizeColumn, columns } from './columns';
import { DataTable } from '@/components/ui/data-table';
import { ApiList } from '@/components/ui/api-list';

interface SizeClientProps {
	data: SizeColumn[];
}

export const SizesClient: React.FC<SizeClientProps> = ({ data }) => {
	const router = useRouter();
	const params = useParams();
	return (
		<React.Fragment>
			<div className='flex items-center justify-between'>
				<Heading
					title={`Sizes (${data.length})`}
					description='Manage Sizes for your store'
				/>
				<Button
					data-testid='add-sizesClient-button'
					onClick={() => router.push(`/${params.storeId}/sizes/new`)}
				>
					<Plus className='mr-2 h-4 w-4' /> Add New
				</Button>
			</div>
			<Separator />
			<DataTable searchKey='name' columns={columns} data={data} />
			<Heading title='API Routes' description='API routes for managing sizes' />
			<Separator />
			<ApiList entityName='sizes' entityIdName='sizeId' />
		</React.Fragment>
	);
};
