'use client';
// global import
import React from 'react';
import * as zod from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { CircleCheckBig } from 'lucide-react';
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
		.min(3, 'Store name is too short')
		.max(21, 'Store name is too long'),
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
	/**
	 * Handles the form submission to create a new store.
	 *
	 * @param values - The form values inferred from the form schema.
	 * @returns A promise that resolves when the API call is complete.
	 *
	 * @remarks
	 * This function sets the loading state to true before making an API call to create a new store.
	 * If the API call is successful, a success toast is displayed and the user is redirected to the new store's page.
	 * If the API call fails, an error toast is displayed and the error is logged to the console.
	 * The loading state is reset to false after the API call completes, regardless of success or failure.
	 */
	const onSubmit = async (values: zod.infer<typeof formSchema>) => {
		console.log(values);

		try {
			setLoading(true);
			// Make an API call to create a new store with the form values
			const response = await axios.post('/api/stores', values);
			toast.success('Store created successfully');

			window.location.assign(`/${response.data.id}`);
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
			<React.Fragment>
				<div className='space-y-4 py-2 pd-4'>
					<Form {...form}>
						<form
							data-testid='storeModal-Form'
							onSubmit={form.handleSubmit(onSubmit)}
						>
							<FormField
								control={form.control}
								name='name'
								render={({ field, fieldState }) => (
									<FormItem>
										<FormLabel data-testid='storeModal-FormLabel'>
											Name
										</FormLabel>
										<FormControl>
											<div className='flex items-center'>
												<Input
													disabled={loading}
													data-testid='storeModal-FormInput'
													placeholder='E-Commerce'
													maxLength={21}
													{...field}
												/>
												{!fieldState.error && field.value.length >= 3 && (
													<CircleCheckBig className='h-4 w-4 text-green-500' />
												)}
											</div>
										</FormControl>
										<FormMessage data-testid='FormMessage'>
											{form.formState.errors.name?.message}
										</FormMessage>
									</FormItem>
								)}
							/>
							{/* Form Button */}
							<div
								data-testid='form-buttons'
								className='pt-6 space-x-2 flex items-center justify-end w-full'
							>
								<Button
									disabled={loading}
									data-testid='form-CancelButtons'
									variant='outline'
									onClick={() => {
										form.reset();
										storeModal.onClose();
									}}
								>
									Cancel
								</Button>
								<Button
									disabled={loading}
									type='submit'
									data-testid='form-ContinueButtons'
								>
									Continue
								</Button>
							</div>
						</form>
					</Form>
				</div>
			</React.Fragment>
		</Modal>
	);
};
