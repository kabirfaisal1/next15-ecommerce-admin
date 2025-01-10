'use client';

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
import { MoreHorizontal, Edit, Copy } from 'lucide-react';

interface CellActionProps {
	data: BillboardColumn;
}
export const CellAction: React.FC<CellActionProps> = ({ data }) => {
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant='ghost'>
					<span className='sr-only'>Open menu</span>
					<MoreHorizontal className=' h-4 w-4' />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent>
				<DropdownMenuLabel>Action</DropdownMenuLabel>
				<DropdownMenuSeparator />
				<DropdownMenuItem>
					<Edit className='mr-2 h-4 w-4' /> Update
				</DropdownMenuItem>
				<DropdownMenuItem>
					<Copy className='mr-2 h-4 w-4' /> Copy
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
};
