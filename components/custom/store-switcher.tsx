'use client';

// global imports
import { Stores } from '@prisma/client';

import { Store as StoreIcon, ChevronsUpDownIcon } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';

// local imports
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';

import { useStoreModal } from '@/hooks/use-store-modal';
import { cn } from '@/lib/utils';
import {
	Command,
	CommandInput,
	CommandList,
	CommandEmpty,
} from '@/components/ui/command';

type PopoverTriggerProps = React.ComponentPropsWithoutRef<
	typeof PopoverTrigger
>;

interface StoreSwitcherProps extends PopoverTriggerProps {
	items: Stores[];
}

export default function StoreSwitcher({
	className,
	items = [],
}: // ...props
StoreSwitcherProps) {
	const storeModal = useStoreModal();
	const params = useParams();
	const router = useRouter();
	const [open, setOpen] = useState(false);

	/**
	 * Formats an array of items into a new array of objects with `label` and `value` properties.
	 *
	 * @param {Array} items - The array of items to format.
	 * @param {Object} items[].name - The name of the item.
	 * @param {Object} items[].id - The id of the item.
	 * @returns {Array} A new array of objects, each containing `label` and `value` properties.
	 */
	const formattedItems = items.map(item => ({
		label: item.name,
		value: item.id,
	}));

	/**
	 * Finds the current store from the list of formatted items based on the store ID from the parameters.
	 *
	 * @param {Array} formattedItems - The list of formatted items, each containing a value property.
	 * @param {Object} params - The parameters object containing the store ID.
	 * @param {string} params.storeId - The ID of the store to find.
	 * @returns {Object | undefined} The current store object if found, otherwise undefined.
	 */
	const currentStore = formattedItems.find(
		item => item.value === params.storeId,
	);

	/**
	 * Handles the selection of a store from a dropdown or similar component.
	 *
	 * @param store - An object representing the selected store.
	 * @param store.value - The value of the selected store, typically used in routing.
	 * @param store.label - The label of the selected store, typically used for display purposes.
	 *
	 * This function closes the dropdown and navigates to the selected store's page.
	 */
	const onStoreSelect = (store: { value: string; label: string }) => {
		setOpen(false);
		router.push(`/${store.value}`);
	};

	return (
		<Popover
			open={open}
			onOpenChange={setOpen}
			data-testid='storeSwitcher-Popover'
		>
			<PopoverTrigger
				data-testid='storeSwitcher-PopoverTrigger'
				id='storeSwitcher-PopoverTrigger'
				asChild
			>
				<Button
					variant='outline'
					size='sm'
					data-testid='storeSwitcher-Button'
					role='combobox'
					aria-expanded={open}
					aria-label='Select a store'
					className={cn('w-[200px] justify-between', className)}
				>
					<StoreIcon
						data-testid='storeSwitcher-storeIcon'
						id='storeSwitcher-storeIcon'
						className='mr-2 h-4 w-4'
					/>
					Current Store
					<ChevronsUpDownIcon
						data-testid='chevronsUpDownIcon'
						className='ml-auto h-4 w-4 shrink-0 opacity-50'
					/>
				</Button>
			</PopoverTrigger>
			<PopoverContent
				data-testid='storeSwitcher-PopoverContent'
				className='w-[200px] p-0'
			>
				<Command>
					<CommandList>
						<CommandInput
							data-testid='searchstore_input'
							placeholder='Search store'
						/>
					</CommandList>
				</Command>
			</PopoverContent>
		</Popover>
	);
}
