'use client';

import { ColumnDef } from '@tanstack/react-table';
import { CellAction } from './cell-action';

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type ProductColumn = {
	id: string;
	name: string;
	price: string;
	category: string;
	size: string;
	color: string;
	isFeatured: boolean;
	isArchived: boolean;
	createdAt: string;
	updatedAt: string;
};

export const columns: ColumnDef<ProductColumn>[] = [
	{
		accessorKey: 'name',
		header: 'Name',
	},
	{
		accessorKey: 'price',
		header: 'Price',
	},
	{
		accessorKey: 'isArchived',
		header: 'Archived',
	},
	{
		accessorKey: 'isFeatured',
		header: 'Featured',
	},
	{
		accessorKey: 'category',
		header: 'Category',
	},
	{
		accessorKey: 'size',
		header: 'Size',
	},
	{
		accessorKey: 'color',
		header: 'Color',
		cell: ({ row }) => (
			<div data-testid='color-value' className='flex items-center gap-x-2'>
				{row.original.color}

				<div
					data-testid='color-box'
					className='h-6 w-6 rounded-full border'
					style={{ backgroundColor: row.original.color }}
					// The color column displays the color name and a colored box with the corresponding hex value.
				/>
			</div>
		),
	},
	{
		accessorKey: 'createdAt',
		header: 'Created Date',
	},
	{
		id: 'actions',
		cell: ({ row }) => <CellAction data={row.original} />,
	},
];
