'use client';
// golobal imports
import { toast } from 'react-hot-toast';
import { MoreHorizontal, FilePenLine, Copy, Trash2 } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import axios from 'axios';
import React from 'react';

// local imports
import { CategoryColumn } from './columns';
import { Button } from '@/components/ui/button';

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { AlertModal } from '@/components/modals/alert-modal';
import { Alert } from '@/components/ui/alert';

interface CellActionProps {
	data: CategoryColumn;
}
export const CellAction: React.FC<CellActionProps> = ({ data }) => {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [dialogOpen, setDialogOpen] = useState(false);

	const router = useRouter();
	const params = useParams();

	/**
	 * Copies the given category ID to the clipboard and displays a success toast notification.
	 *
	 * @param id - The categoryID of the category to be copied.
	 */
	const onCopy = (id: string) => {
		navigator.clipboard.writeText(id);
		toast.success('Category Id copied to clipboard.');
	};

	const handleAPIError = (err: unknown) => {
		if (axios.isAxiosError(err)) {
			setError(err.response?.data?.message || `An unexpected error occurred.`);
		} else {
			setError('An unexpected error occurred.');
		}
	};

	const onDelete = async () => {
		setLoading(true);
		setError(null);

		try {
			await axios.delete(`/api/${params.storeId}/categories/${data.id}`);
			router.push(`/${params.storeId}/categories`); //TODO: Test this part
			toast.success('Category deleted successfully');
		} catch (err) {
			handleAPIError(err);
			toast.error(
				`Make sure you remove all categories using for category: ${
					typeof params.label === 'string' ? params.label.toUpperCase() : ''
				}`,
			);
		} finally {
			setLoading(false);
			setDialogOpen(false);
		}
	};
	return (
		<React.Fragment>
			<AlertModal
				isOpen={dialogOpen}
				onClose={() => setDialogOpen(false)}
				onConfirm={onDelete}
				loading={loading}
			/>

			{error && (
				<Alert variant='destructive'>
					<span>{error}</span>
				</Alert>
			)}
			<DropdownMenu data-testid='cellAction-dropdownMenu'>
				<DropdownMenuTrigger asChild>
					<Button variant='ghost' data-testid='cellAction-dropdownMenuTrigger'>
						<span className='sr-only'>Open menu</span>
						<MoreHorizontal className=' h-4 w-4' />
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent data-testid='cellAction-dropdownMenuContent'>
					<DropdownMenuLabel data-testid='cellAction-dropdownMenuLabel'>
						Action
					</DropdownMenuLabel>
					<DropdownMenuSeparator />
					<DropdownMenuItem
						data-testid='cellAction-copyIdItem'
						onClick={() => onCopy(data.id)}
					>
						<Copy className='mr-2 h-4 w-4' /> Copy ID
					</DropdownMenuItem>
					<DropdownMenuItem
						data-testid='cellAction-modifyItem'
						onClick={() =>
							router.push(`/${params.storeId}/categories/${data.id}`)
						}
					>
						<FilePenLine className='mr-2 h-4 w-4' />
						Modify
					</DropdownMenuItem>
					<DropdownMenuItem
						data-testid='cellAction-deleteItem'
						onClick={() => setDialogOpen(true)}
						disabled={loading}
					>
						<Trash2 className='mr-2 h-4 w-4' /> Delete
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		</React.Fragment>
	);
};
