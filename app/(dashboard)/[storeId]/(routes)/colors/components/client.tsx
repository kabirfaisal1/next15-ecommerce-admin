'use client';
//global inports
import React from 'react';
import { Plus } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';

//local imports
import Heading from '@/components/ui/heading';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ColorColumn, columns } from './columns';
import { DataTable } from '@/components/ui/data-table';
import { ApiList } from '@/components/ui/api-list';

interface ColorClientProps {
	data: ColorColumn[];
}

export const ColorsClient: React.FC<ColorClientProps> = ({ data }) => {
	const router = useRouter();
	const params = useParams();
	return (
		<React.Fragment>
			<div className='flex items-center justify-between'>
				<Heading
					title={`Colors (${data.length})`}
					description='Manage Colors for your store'
				/>
				<Button
					data-testid='add-colorsClient-button'
					onClick={() => router.push(`/${params.storeId}/colors/new`)}
				>
					<Plus className='mr-2 h-4 w-4' /> Add New
				</Button>
			</div>
			<Separator />
			<DataTable searchKey='name' columns={columns} data={data} />
			<Heading title='API Routes' description='API routes for managing colors' />
			<Separator />
			<ApiList entityName='colors' entityIdName='colorsId' />
		</React.Fragment>
	);
};
