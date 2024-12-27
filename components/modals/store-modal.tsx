'use client';
// global import
import * as zod from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

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
import { Button } from '@/components/ui/button';

/**
 * Schema for the store form validation using Zod.
 *
 * This schema validates that the `name` field is a non-empty string.
 *
 * @constant
 * @type {ZodObject}
 * @property {ZodString} name - The name of the store, which is required and cannot be empty.
 */
const formSchema = zod.object({
	name: zod
		.string()
		.nonempty('Store name is required')
		.min(3, 'Store name is too short'),
});

// StoreModal component to render a modal for creating a new store
export const StoreModal = () => {
	// Use the custom hook to manage the modal state
	const storeModal = useStoreModal();

	// State to track the loading state of the form
	const [loading, setLoading] = useState(false);

	/**
	 * Initializes a form using the `useForm` hook with Zod schema validation.
	 */
	const form = useForm<zod.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			name: '',
		},
	});

	/**
	 * This function is called when the form is submitted. It logs the form values
	 * to the console and is intended to be extended to include API calls for creating a store.
	 */
	const onSubmit = async (values: zod.infer<typeof formSchema>) => {
		console.log(values);

		try {
			setLoading(true);
			// Make an API call to create a new store with the form values
			const response = await axios.post('/api/stores', values);

			toast.success('Store created successfully');
			console.log(response.data);
		} catch (error) {
			toast.error('Uh oh! Something went wrong');
			console.error(error);
		} finally {
			setLoading(false);
		}
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
												disabled={loading}
												data-testid='storeModal-FormInput'
												placeholder='E-Commerce'
												{...field}
											/>
										</FormControl>
										<FormMessage id='FormMessage' data-testid='FormMessage'>
											{form.formState.errors.name?.message}
										</FormMessage>
									</FormItem>
								)}
							/>
							{/* Form Button */}
							<div
								id='form-buttons'
								data-testid='form-buttons'
								className='pt-6 space-x-2 flex items-center justify-end w-full'
							>
								<Button
									id='form-CancelButtons'
									disabled={loading}
									data-testid='form-CancelButtons'
									variant='outline'
									onClick={storeModal.onClose}
								>
									Cancel
								</Button>
								<Button
									disabled={loading}
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
