'use client';

import { ColumnDef } from '@tanstack/react-table';
import { CellAction } from './cell-action';

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type OrderColumn = {
	id: string;
	products: string;
	phone: string;
	address: string;
	isPaid: boolean;
	totalPrice: string;
	createdAt: string;
};

export const columns: ColumnDef<OrderColumn>[] = [
	{
		accessorKey: 'products',
		header: 'Products',
	},

	{
		accessorKey: 'phone',
		header: 'Phone',
	},
	{
		accessorKey: 'address',
		header: 'Address',
	},
	{
		accessorKey: 'totalPrice',
		header: 'TotalPrice',
	},
	{
		accessorKey: 'isPaid',
		header: 'isPaid',
	},
	// {
	// 	accessorKey: 'createdAt',
	// 	header: 'createdAt',
	// },
];
