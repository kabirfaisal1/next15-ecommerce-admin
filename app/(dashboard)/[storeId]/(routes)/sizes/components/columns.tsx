'use client';

import { ColumnDef } from '@tanstack/react-table';
import { CellAction } from './cell-action';

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type SizeColumn = {
	id: string;
	name: string;
	billboardLabel: string;
	createdAt: string;
	updatedAt: string;
};

export const columns: ColumnDef<SizeColumn>[] = [
	{
		accessorKey: 'name',
		header: 'Name',
	},

	{
		accessorKey: 'Billboard',
		header: 'Billboard',
		cell: ({ row }) => row.original.billboardLabel,
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
