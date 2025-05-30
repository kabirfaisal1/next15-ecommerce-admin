'use client';
//global inports
import React from 'react';

//local imports
import Heading from '@/components/ui/heading';

import { Separator } from '@/components/ui/separator';
import { OrderColumn, columns } from './columns';
import { DataTable } from '@/components/ui/data-table';

interface OrderClientProps {
	data: OrderColumn[];
}

export const OrderClient: React.FC<OrderClientProps> = ({ data }) => {
	return (
		<React.Fragment>
			<Heading
				title={`Orders (${data.length})`}
				description='Manage orders for your store'
			/>

			<Separator />
			<DataTable searchKey='products' columns={columns} data={data} />
		</React.Fragment>
	);
};
