'use client';

import { ColumnDef } from '@tanstack/react-table';
import { CellAction } from './cell-action';

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type ColorColumn = {
	id: string;
	name: string;
	value: string;
	createdAt: string;
	updatedAt: string;
};

export const columns: ColumnDef<ColorColumn>[] = [
	{
		accessorKey: 'name',
		header: 'Name',
	},

	{
		accessorKey: 'value',
		header: 'Value',
		cell: ({ row }) => (
			<div data-testid='color-value' className='flex items-center gap-x-2'>
				{row.original.value}

				<div
					data-testid='color-box'
					className='h-6 w-6 rounded-full border'
					style={{ backgroundColor: row.original.value }}
				/>
			</div>
		),
	},
	{
		accessorKey: 'createdAt',
		header: 'Created Date',
	},
	{
		accessorKey: 'updatedAt',
		header: 'Modified Date',
	},
	{
		id: 'actions',
		cell: ({ row }) => <CellAction data={row.original} />,
	},
];
