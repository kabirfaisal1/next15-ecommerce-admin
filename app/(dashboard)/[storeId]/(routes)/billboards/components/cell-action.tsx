'use client';
// golobal imports
import { toast } from 'react-hot-toast';
import { MoreHorizontal, FilePenLine, Copy, Trash2 } from 'lucide-react';

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

interface CellActionProps {
	data: BillboardColumn;
}
export const CellAction: React.FC<CellActionProps> = ({ data }) => {
	const onCopy = (id: string) => {
		navigator.clipboard.writeText(id);
		toast.success('Billboard Id copied to clipboard.');
	};
	return (
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
				<DropdownMenuItem data-testid='cellAction-modifyItem'>
					<FilePenLine className='mr-2 h-4 w-4' />
					Modify
				</DropdownMenuItem>
				<DropdownMenuItem data-testid='cellAction-deleteItem'>
					<Trash2 className='mr-2 h-4 w-4' /> Delete
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
};
