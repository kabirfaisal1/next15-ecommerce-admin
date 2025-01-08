'use client';
//global import
import * as z from 'zod';
import React from 'react';
import { Billboards } from '@prisma/client';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Trash } from 'lucide-react';
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
import ImageUpload from '@/components/ui/image-upload';

/**
 * Props for the BillboardsForm component.
 *
 * @interface BillboardFormProps
 * @property {Billboard} initialData - The initial data for the Billboard Billboards.
 */
interface BillboardFormProps {
	initialData: Billboards | null;
}

/**
 * Schema for the Billboards form validation.
 *
 * This schema validates the following fields:
 * - `name`: A non-empty string with a minimum length of 3 characters.
 *
 * @constant
 * @type {z.ZodObject}
 * @property {z.ZodString} name - The name of the Billboard. It must be a non-empty string with a minimum length of 3 characters.
 * @example
 * const formSchema = z.object({
 *   name: z.string().nonempty('Billboard name is required').min(3, 'Billboard name is too short'),
 * });
 */
const formSchema = z.object({
	label: z
		.string()
		.nonempty('Billboard label is required')
		.min(3, 'Billboard label is too short'),
	imageUrl: z.string().nonempty('Billboard image is required'),
});

/**
 * Type alias for the values of the Billboards form.
 *
 * This type is inferred from the `formSchema` using Zod's `infer` utility.
 * It represents the shape of the data that the Billboards form will handle.
 *
 * @typedef {BillboardFormValues}
 */
type BillboardFormValues = z.infer<typeof formSchema>;

export const BillboardForm: React.FC<BillboardFormProps> = ({
	initialData,
}) => {
	const params = useParams();
	const router = useRouter();
	const [open, setOpen] = useState(false);
	const [loading, setLoading] = useState(false);
	// const origin = useOrigin();

	const title = initialData ? 'Edit Billboard.' : 'Create Billboard';
	const description = initialData ? 'Edit Billboard.' : 'Add a new Billboard';
	const toastMessage = initialData
		? 'Billboard Updated successfully'
		: 'Billboard Created';
	const action = initialData ? 'Update' : 'Create';

	/**
	 * Initializes a form using the `useForm` hook with validation schema and default values.
	 *
	 * @template BillboardFormValues - The type of the form values.
	 * @param {object} options - The options for the form.
	 * @param {Resolver} options.resolver - The resolver function for form validation using Zod schema.
	 * @param {BillboardFormValues} options.defaultValues - The initial data for the form fields.
	 * @returns {UseFormReturn<BillboardFormValues>} The form instance with methods and state.
	 */
	const form = useForm<BillboardFormValues>({
		resolver: zodResolver(formSchema),
		defaultValues: initialData || { label: '', imageUrl: '' },
	});

	/**
	 * Handles the form submission.
	 *
	 * @param {BillboardFormValues} data - The form data to be submitted.
	 * @returns {Promise<void>} A promise that resolves when the submission is complete.
	 */
	const onSubmit = async (data: BillboardFormValues) => {
		console.log(data);
		try {
			setLoading(true);
			// Make an API call to create a new Billboard with the form values
			await axios.patch(`/api/Billboards/${params.BillboardId}`, data);
			// Refresh the router to reflect the changes
			router.refresh();
			toast.success('Billboard updated successfully');
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
			// Make an API call to create a new Billboard with the form values
			await axios.delete(`/api/Billboards/${params.BillboardId}`);
			// Refresh the router to reflect the changes
			router.refresh();
			router.push('/');
			toast.success('Billboard deleted successfully');
		} catch (error) {
			toast.error(
				'Make sure you remove all the products and categories first.',
			);
			console.error(error);
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
				<Heading title={title} description={description} />
				{initialData && (
					<Button
						variant='destructive'
						size='icon'
						disabled={loading}
						onClick={() => setOpen(true)} // Add the function to save the Billboards
						id='Billboard-delete-button'
						data-testid='Billboard-delete-button'
					>
						<Trash className='h-4 w-4' />
					</Button>
				)}
			</div>
			<Separator />
			<Form {...form}>
				<form
					id='Billboard-Form'
					data-testid='Billboard-Form'
					className='space-y-8 w-full'
					onSubmit={form.handleSubmit(onSubmit)}
				>
					<FormField
						control={form.control}
						name='imageUrl'
						render={({ field }) => (
							<FormItem>
								<FormLabel
									id='Billboard-imageUrl'
									data-testid='Billboard-imageUrl'
								>
									Background image
								</FormLabel>
								<FormControl>
									<ImageUpload
										value={Array.isArray(field.value) ? field.value.map((image: { url: string }) => image.url) : []}
										disabled={loading}
										onChange={url => {
											const newValue = Array.isArray(field.value) ? [...field.value, { url }] : [{ url }];
											field.onChange(newValue);
										}}
										onRemove={url => {
											const newValue = Array.isArray(field.value) ? field.value.filter(
												(current: { url: string }) => current.url !== url,
											) : [];
											field.onChange(newValue);
										}}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<div className='md:grid md:grid-cols-3 gap-8'>
						<FormField
							control={form.control}
							name='label'
							render={({ field }) => (
								<FormItem>
									<FormLabel
										id='Billboard-FormNameLabel'
										data-testid='Billboard-FormNameLabel'
									>
										Label
									</FormLabel>
									<FormControl>
										<Input
											id='Billboard-FormNameInput'
											disabled={loading}
											data-testid='Billboard-FormNameInput'
											placeholder='Billboard label'
											{...field}
										/>
									</FormControl>
									<FormMessage id='FormMessage' data-testid='FormMessage'>
										{form.formState.errors.label?.message}
									</FormMessage>
								</FormItem>
							)}
						/>
					</div>
					{/* Form Button */}
					<div
						id='BillboardForm-buttons'
						data-testid='form-buttons'
						className='pt-6 space-x-2 '
					>
						<Button
							disabled={loading}
							type='submit'
							id='BillboardForm-ContinueButtons'
							data-testid='BillboardForm-ContinueButtons'
							className='ml-auto'
							variant='default'
						>
							{action} Billboard
						</Button>
					</div>
				</form>
			</Form>
			<Separator />
		</React.Fragment>
	);
};
