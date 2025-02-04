'use client';
//global import
import * as z from 'zod';
import React from 'react';
import { Stores } from '@prisma/client';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Trash, CircleCheckBig } from 'lucide-react';
import toast from 'react-hot-toast';
import axios from 'axios';
import { useParams, useRouter } from 'next/navigation';

//local import
import Heading from '@/components/ui/heading';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { AlertModal } from '@/components/modals/alert-modal';
import { ApiAlert } from '@/components/ui/api-alert';
import { useOrigin } from '@/hooks/use-origin';

/**
 * Props for the SettingsForm component.
 *
 * @interface SettingFormProps
 * @property {Store} initialData - The initial data for the store settings.
 */
interface SettingFormProps {
	initialData: Stores;
}

/**
 * Schema for the settings form validation.
 *
 * This schema validates the following fields:
 * - `name`: A non-empty string with a minimum length of 3 characters.
 *
 * @constant
 * @type {z.ZodObject}
 * @property {z.ZodString} name - The name of the store. It must be a non-empty string with a minimum length of 3 characters.
 * @example
 * const formSchema = z.object({
 *   name: z.string().nonempty('Store name is required').min(3, 'Store name is too short'),
 * });
 */
const formSchema = z.object({
	name: z
		.string()
		.nonempty('Store name is required')
		.min(3, 'Store name is too short'),
});

/**
 * Type alias for the values of the settings form.
 *
 * This type is inferred from the `formSchema` using Zod's `infer` utility.
 * It represents the shape of the data that the settings form will handle.
 *
 * @typedef {SettingFormValues}
 */
type SettingFormValues = z.infer<typeof formSchema>;

export const SettingForm: React.FC<SettingFormProps> = ({ initialData }) => {
	const params = useParams();
	const router = useRouter();
	const [open, setOpen] = useState(false);
	const [loading, setLoading] = useState(false);
	const origin = useOrigin();

	/**
	 * Initializes a form using the `useForm` hook with validation schema and default values.
	 *
	 * @template SettingFormValues - The type of the form values.
	 * @param {object} options - The options for the form.
	 * @param {Resolver} options.resolver - The resolver function for form validation using Zod schema.
	 * @param {SettingFormValues} options.defaultValues - The initial data for the form fields.
	 * @returns {UseFormReturn<SettingFormValues>} The form instance with methods and state.
	 */
	const form = useForm<SettingFormValues>({
		resolver: zodResolver(formSchema),
		defaultValues: initialData,
	});

	/**
	 * Handles the form submission.
	 *
	 * @param {SettingFormValues} data - The form data to be submitted.
	 * @returns {Promise<void>} A promise that resolves when the submission is complete.
	 */
	const onSubmit = async (data: SettingFormValues) => {
		try {
			setLoading(true);
			// Make an API call to create a new store with the form values
			await axios.patch(`/api/stores/${params.storeId}`, data);
			// Refresh the router to reflect the changes
			router.refresh();
			toast.success('Store updated successfully');
		} catch (error) {
			toast.error('Uh oh! Something went wrong');
			console.error(error);
		} finally {
			setLoading(false);
		}
	};

	const onDelete = async () => {
		try {
			setLoading(true);
			await axios.delete(`/api/stores/${params.storeId}`);
			router.refresh();
			router.push('/');
			toast.success('Store deleted successfully');
		} catch (error: unknown) {
			if (error.response?.status === 400) {
				toast.error(
					'Make sure you remove all categories linked to this billboard before deleting.',
				);
			} else {
				toast.error('Something went wrong.');
			}
		} finally {
			setLoading(false);
			setOpen(false);
		}
	};

	return (
		<React.Fragment>
			<AlertModal
				isOpen={open}
				onClose={() => setOpen(false)}
				onConfirm={onDelete}
				loading={loading}
			/>
			<div className='flex items-center justify-between'>
				<Heading title='Settings' description='Manage Store Preferences' />
				<Button
					variant='destructive'
					size='icon'
					disabled={loading}
					onClick={() => setOpen(true)} // Add the function to save the settings
					data-testid='store-delete-button'
				>
					<Trash className='h-4 w-4' />
				</Button>
			</div>
			<Separator />
			<Form {...form}>
				<form
					data-testid='setting-Form'
					className='space-y-8 w-full'
					onSubmit={form.handleSubmit(onSubmit)}
				>
					<div className='grid grid-cols-3 gap-8'>
						<FormField
							control={form.control}
							name='name'
							render={({ field, fieldState }) => (
								<FormItem>
									<FormLabel data-testid='setting-FormNameLabel'>
										Name
									</FormLabel>
									<FormControl>
										<div className='flex items-center'>
											<Input
												disabled={loading}
												data-testid='setting-FormNameInput'
												placeholder='Store Name'
												maxLength={21}
												{...field}
											/>
											{!fieldState.error && field.value && (
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
					</div>
					{/* Form Button */}
					<div data-testid='form-buttons' className='pt-6 space-x-2 '>
						<Button
							disabled={loading}
							type='submit'
							data-testid='settingForm-ContinueButtons'
							className='ml-auto'
							variant='default'
						>
							Save Changes
						</Button>
					</div>
				</form>
			</Form>
			<Separator />

			<ApiAlert
				title='NEXT_PUBLIC_API_URL'
				variant='public'
				description={`${origin ? `${origin}/api/${params.storeId}` : ''}`}
				// description={`${origin ? `${origin}/api/stores${params.storeId}` : ''}`}
				testid='api-alert'
			/>
		</React.Fragment>
	);
};
