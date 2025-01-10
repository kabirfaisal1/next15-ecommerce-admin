'use client';
// golobal imports
import { toast } from 'react-hot-toast';
import { MoreHorizontal, FilePenLine, Copy, Trash2 } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import axios from 'axios';
import React from 'react';

// local imports
import { BillboardColumn } from './columns';
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
import { Separator } from '@/components/ui/separator';

interface CellActionProps {
	data: BillboardColumn;
}
export const CellAction: React.FC<CellActionProps> = ({ data }) => {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [dialogOpen, setDialogOpen] = useState(false);

	const router = useRouter();
	const params = useParams();

	/**
	 * Copies the given billboard ID to the clipboard and displays a success toast notification.
	 *
	 * @param id - The billboardID of the billboard to be copied.
	 */
	const onCopy = (id: string) => {
		navigator.clipboard.writeText(id);
		toast.success('Billboard Id copied to clipboard.');
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
			await axios.delete(`/api/${params.storeId}/billboards/${data.id}`);
			router.push(`/${params.storeId}/billboards`); //TODO: Test this part
			toast.success('Billboard deleted successfully');
		} catch (err) {
			handleAPIError(err);
			toast.error(
				`Make sure you remove all categories using for billboard: ${
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
			<Separator />
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
				<DropdownMenuContent>
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
							router.push(`/${params.storeId}/billboards/${data.id}`)
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
