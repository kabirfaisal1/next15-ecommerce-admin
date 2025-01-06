'use client';
//global import
import * as z from 'zod';
import React from 'react';
import { Store } from '@prisma/client';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Trash } from 'lucide-react';

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

/**
 * Props for the SettingsForm component.
 *
 * @interface SettingFormProps
 * @property {Store} initialData - The initial data for the store settings.
 */
interface SettingFormProps {
	initialData: Store;
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
	const [open, setOpen] = useState(false);
	const [loading, setLoading] = useState(false);

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
		console.log(data);
	};

	return (
		<React.Fragment>
			<div className='flex items-center justify-between'>
				<Heading title='Settings' description='Manage Store Preferences' />
				<Button
					variant='destructive'
					size='icon'
					disabled={loading}
					onClick={() => setOpen(true)} // Add the function to save the settings
					id='store-delete-button'
					data-testid='store-delete-button'
				>
					<Trash className='h-4 w-4' />
				</Button>
			</div>
			<Separator />
			<Form {...form}>
				<form
					id='setting-Form'
					data-testid='setting-Form'
					className='space-y-8 w-full'
					onSubmit={form.handleSubmit(onSubmit)}
				>
					<div className='grid grid-cols-3 gap-8'>
						<FormField
							control={form.control}
							name='name'
							render={({ field }) => (
								<FormItem>
									<FormLabel
										id='setting-FormNameLabel'
										data-testid='setting-FormNameLabel'
									>
										Name
									</FormLabel>
									<FormControl>
										<Input
											id='setting-FormNameInput'
											disabled={loading}
											data-testid='setting-FormNameInput'
											placeholder='Store Name'
											{...field}
										/>
									</FormControl>
									<FormMessage id='FormMessage' data-testid='FormMessage'>
										{form.formState.errors.name?.message}
									</FormMessage>
								</FormItem>
							)}
						/>
					</div>
					{/* Form Button */}
					<div
						id='settingForm-buttons'
						data-testid='form-buttons'
						className='pt-6 space-x-2 '
					>
						<Button
							disabled={loading}
							type='submit'
							id='settingForm-ContinueButtons'
							data-testid='settingForm-ContinueButtons'
							className='ml-auto'
							variant='default'
						>
							Save Changes
						</Button>
					</div>
				</form>
			</Form>
		</React.Fragment>
	);
};
