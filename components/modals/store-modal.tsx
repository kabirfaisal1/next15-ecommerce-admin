'use client';
// global import
import * as zod from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

// local import
import { Modal } from '@/components/ui/modal';
import { useStoreModal } from '@/hooks/use-store-modal';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '../ui/button';

const formSchema = zod.object({
	name: zod.string().nonempty('Store name is required'),
});

// StoreModal component to render a modal for creating a new store
export const StoreModal = () => {
	// Use the custom hook to manage the modal state
	const storeModal = useStoreModal();

	const form = useForm<zod.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			name: '',
		},
	}); // Form hook to manage form state

	const onSubmit = async (values: zod.infer<typeof formSchema>) => {
		console.log(values);
		// TODO: Create Store API Calls
	};
	return (
		<Modal
			title='Create Store' // Title of the modal
			description='Add a new store to manage products and categories' // Description of the modal
			isOpen={storeModal.isOpen} // Modal open state
			onClose={storeModal.onClose} // Function to close the modal
		>
			<>
				<div className='space-y-4 py-2 pd-4'>
					<Form {...form}>
						<form
							id='storeModal-Form'
							data-testid='storeModal-Form'
							onSubmit={form.handleSubmit(onSubmit)}
						>
							<FormField
								control={form.control}
								name='name'
								render={({ field }) => (
									<FormItem>
										<FormLabel
											id='storeModal-FormLabel'
											data-testid='storeModal-FormLabel'
										>
											Name
										</FormLabel>
										<FormControl>
											<Input
												id='storeModal-FormInput'
												data-testid='storeModal-FormInput'
												placeholder='e-Commerce'
												{...field}
											/>
										</FormControl>
										<FormMessage id='FormMessage' data-testid='FormMessage' />
									</FormItem>
								)}
							/>
							{/* Form Button */}
							<div
								id='form-buttons'
								data-testid='form-buttons'
								className='pt-6 space-x-2 flex items-center justify-end'
							>
								<Button
									id='form-CancelButtons'
									data-testid='form-CancelButtons'
									variant='outline'
									onClick={storeModal.onClose}
								>
									Cancel
								</Button>
								<Button
									type='submit'
									id='form-ContinueButtons'
									data-testid='form-ContinueButtons'
								>
									Continue
								</Button>
							</div>
						</form>
					</Form>
				</div>
			</>
		</Modal>
	);
};
