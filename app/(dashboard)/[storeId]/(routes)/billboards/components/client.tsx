'use client';
//global inports
import React from 'react';
import { Plus } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';

//local imports
import Heading from '@/components/ui/heading';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

export const BillboardClient = () => {
	const numberOfBillboards = 0;
	const router = useRouter();
	const params = useParams();
	return (
		<React.Fragment>
			<div className='flex items-center justify-between'>
				<Heading
					title={`Billboards (${numberOfBillboards})`}
					description='Manage billboards for your store'
				/>
				<Button
					data-testid='add-billboardClient-button'
					onClick={() => router.push(`/${params.storeId}/billboards/new`)}
				>
					<Plus className='mr-2 h-4 w-4' /> Add New
				</Button>
			</div>
			<Separator />
		</React.Fragment>
	);
};
