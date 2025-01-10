'use client';
// global import
import React from 'react';
import { ArrowUpDown } from 'lucide-react';

// local import
import {
	ColumnDef,
	ColumnFiltersState,
	SortingState,
	flexRender,
	VisibilityState,
	getCoreRowModel,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	useReactTable,
} from '@tanstack/react-table';

import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface DataTableProps<TData, TValue> {
	columns: ColumnDef<TData, TValue>[];
	data: TData[];
	searchKey: string;
}

export function DataTable<TData, TValue>({
	columns,
	data,
	searchKey,
}: DataTableProps<TData, TValue>) {
	const [sorting, setSorting] = React.useState<SortingState>([]);
	const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
		[],
	);
	const [columnVisibility, setColumnVisibility] =
		React.useState<VisibilityState>({});

	const table = useReactTable({
		data,
		columns,
		onSortingChange: setSorting,
		onColumnFiltersChange: setColumnFilters,
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		onColumnVisibilityChange: setColumnVisibility,
		state: {
			sorting,
			columnFilters,
			columnVisibility,
		},
	});

	return (
		<React.Fragment>
			<div className='flex items-center py-4'>
				<Input
					data-testid='search-tableBodyData'
					placeholder='Search...'
					value={(table.getColumn(searchKey)?.getFilterValue() as string) ?? ''}
					onChange={event =>
						table.getColumn(searchKey)?.setFilterValue(event.target.value)
					}
					className='max-w-sm'
				/>
			</div>
			<div className='rounded-md border'>
				<Table data-testid='data-table'>
					<TableHeader data-testid='data-tableHeader'>
						{table.getHeaderGroups().map(headerGroup => (
							<TableRow data-testid='data-tableHeaderRows' key={headerGroup.id}>
								{headerGroup.headers.map(header => {
									return (
										<TableHead key={header.id}>
											{header.isPlaceholder
												? null
												: flexRender(
														header.column.columnDef.header,
														header.getContext(),
												  )}

											{header.column.columnDef.header &&
												header.id !== 'actions' && (
													<Button
														variant='ghost'
														onClick={() =>
															header.column.toggleSorting(
																header.column.getIsSorted() === 'asc',
															)
														}
													>
														<ArrowUpDown className='ml-2 h-4 w-4' />
													</Button>
												)}
										</TableHead>
									);
								})}
							</TableRow>
						))}
					</TableHeader>
					<TableBody data-testid='data-tableBody'>
						{table.getRowModel().rows?.length ? (
							table.getRowModel().rows.map(row => (
								<TableRow
									data-testid='data-tableBodyRows'
									key={row.id}
									data-state={row.getIsSelected() && 'selected'}
								>
									{row.getVisibleCells().map(cell => (
										<TableCell data-testid='data-tableBodyData' key={cell.id}>
											{flexRender(
												cell.column.columnDef.cell,
												cell.getContext(),
											)}
										</TableCell>
									))}
								</TableRow>
							))
						) : (
							<TableRow data-testid='noResults-tableBodyRows'>
								<TableCell
									data-testid='noResults-tableBodyData'
									colSpan={columns.length}
									className='h-24 text-center'
								>
									No results.
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</div>
			<div className='flex items-center justify-end space-x-2 py-4'>
				<Button
					variant='outline'
					size='sm'
					onClick={() => table.previousPage()}
					disabled={!table.getCanPreviousPage()}
					data-testid='previous-tableBodyData'
				>
					Previous
				</Button>
				<Button
					variant='outline'
					size='sm'
					onClick={() => table.nextPage()}
					disabled={!table.getCanNextPage()}
					data-testid='next-tableBodyData'
				>
					Next
				</Button>
			</div>
		</React.Fragment>
	);
}
