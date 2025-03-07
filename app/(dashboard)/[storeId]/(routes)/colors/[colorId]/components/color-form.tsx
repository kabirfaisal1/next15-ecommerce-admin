'use client';
//global import
import * as z from 'zod';
import React from 'react';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Trash, CircleCheckBig } from 'lucide-react';

import axios from 'axios';
import { useParams, useRouter } from 'next/navigation';

//local import
import { Colors } from '@prisma/client';
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

import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import { Alert } from '@/components/ui/alert';
import toast from 'react-hot-toast';

const formSchema = z.object({
	name: z
		.string()
		.trim()
		.min(3, { message: 'Name must be at least 3 characters long.' })
		.max(21),
	value: z
		.string()
		.trim()
		.min(4, { message: 'Value must be at least 4 characters long.' })
		.regex(/^#/, {
			message:
				'Value must be a valid hex code (e.g., #FFFFFF). For more help, visit https://colorhunt.co/',
		}),
});

type ColorFormValues = z.infer<typeof formSchema>;

interface ColorFormProps {
	initialData: Colors | null;
}

export const ColorForm: React.FC<ColorFormProps> = ({ initialData }) => {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [dialogOpen, setDialogOpen] = useState(false);

	const params = useParams();
	const router = useRouter();

	const form = useForm<ColorFormValues>({
		resolver: zodResolver(formSchema),
		defaultValues: initialData || {
			name: '',
			value: '',
		},
	});

	const handleAPIError = (err: unknown) => {
		if (axios.isAxiosError(err)) {
			setError(err.response?.data?.message || 'An unexpected error occurred.');
		} else {
			setError('An unexpected error occurred.');
		}
	};

	const title = initialData ? 'Edit Color' : 'Create Color';
	const description = initialData ? 'Edit Color' : 'Add a new Color';
	const action = initialData ? 'Save changes' : 'Create Color';
	const toastMessage = initialData
		? 'Color updated'
		: 'Color created successfully';
	console.log('initialData', initialData);
	const onSubmit = async (data: ColorFormValues) => {
		setLoading(true);
		setError(null);
		try {
			if (initialData) {
				await axios.patch(
					`/api/${params.storeId}/colors/${params.colorId}`,
					data,
				);
			} else {
				await axios.post(`/api/${params.storeId}/colors`, data);
			}
			router.refresh();
			toast.success(toastMessage);
			router.push(`/${params.storeId}/colors`);
		} catch (err) {
			handleAPIError(err);
			console.log(err);
			toast.error('uh oh! something went wrong');
		} finally {
			setLoading(false);
		}
	};

	const onDelete = async () => {
		setLoading(true);
		setError(null);

		try {
			await axios.delete(`/api/${params.storeId}/colors/${params.colorId}`);
			router.push(`/${params.storeId}/colors`);
			toast.success('Color deleted successfully');
		} catch (err) {
			handleAPIError(err);
			toast.error(
				`Make sure you remove all product using for color first: ${
					typeof params.label === 'string' ? params.label.toUpperCase() : ''
				}`,
			);
		} finally {
			setLoading(false);
			setDialogOpen(false);
		}
	};

	return (
		<div className='space-y-6'>
			<div className='flex items-center justify-between'>
				<Heading title={title} description={description} />

				{initialData && (
					<Button
						variant='destructive'
						color='icon'
						onClick={() => setDialogOpen(true)}
						disabled={loading}
						data-testid='Colors-delete-button'
					>
						<Trash className='h-4 w-4' />
					</Button>
				)}
			</div>
			<Separator />
			{error && (
				<Alert variant='destructive'>
					<span>{error}</span>
				</Alert>
			)}

			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(onSubmit)}
					className='space-y-8 w-full max-w-2xl mx-auto'
				>
					<div className='space-y-8'>
						<FormField
							control={form.control}
							name='name'
							render={({ field, fieldState }) => (
								<FormItem>
									<FormLabel data-testid='color-NameSubtitle'>Name</FormLabel>

									<FormControl>
										<div className='flex items-center'>
											<Input
												data-testid='color-NameInput'
												disabled={loading}
												placeholder='Color name'
												maxLength={21}
												{...field}
											/>
											{!fieldState.error && field.value && (
												<CircleCheckBig className='ml-2 h-4 w-4 text-green-500' />
											)}
										</div>
									</FormControl>
									<FormMessage data-testid='FormMessage'>
										{fieldState.error?.message}
									</FormMessage>
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name='value'
							render={({ field, fieldState }) => (
								<FormItem>
									<FormLabel data-testid='color-valueSubtitle'>
										Color Value
									</FormLabel>

									<FormControl>
										<div className='flex flex-col gap-y-2'>
											{/* Color Input Field */}
											<Input
												data-testid='color-valueInput'
												disabled={loading}
												placeholder='Color hex code e.g., #FFFFFF'
												maxLength={10}
												{...field}
												className='w-full h-10 rounded-lg border px-4'
												style={{ boxShadow: `0 0 10px ${field.value}` }}
											/>

											{/* Color Preview Below Input */}
											<div
												data-testid='color-value-preview'
												className='w-full h-10 rounded-lg border shadow-md'
												style={{ backgroundColor: field.value }}
											/>
										</div>
									</FormControl>
									<FormMessage data-testid='FormMessage'>
										{fieldState.error?.message}
									</FormMessage>
								</FormItem>
							)}
						/>
					</div>
					<div className='flex justify-center'>
						<Button
							type='submit'
							data-testid='color-submitButton'
							disabled={loading}
						>
							{loading ? 'Saving...' : action}
						</Button>
					</div>
				</form>
			</Form>
			{/* <Separator /> */}

			<Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Confirm Deletion</DialogTitle>
					</DialogHeader>
					<p>
						Are you sure you want to delete this Color? This action cannot be
						undone.
					</p>
					<DialogFooter>
						<Button
							variant='outline'
							onClick={() => setDialogOpen(false)}
							disabled={loading}
							data-testid='color-cancelButton'
						>
							Cancel
						</Button>
						<Button
							data-testid='color-deleteButton'
							variant='destructive'
							onClick={onDelete}
							disabled={loading}
						>
							{loading ? 'Deleting...' : 'Delete'}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	);
};
