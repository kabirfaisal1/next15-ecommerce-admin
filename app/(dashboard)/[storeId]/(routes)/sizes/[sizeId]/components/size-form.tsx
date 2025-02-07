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
import { Size } from '@prisma/client';
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
		.min(3, { message: 'Name must be at least 3 characters long' })
		.max(21, { message: 'Name must not exceed 21 characters' }),
	value: z
		.string()
		.trim()
		.min(1, { message: 'Name must be at least 3 characters long' })
		.max(15, { message: 'Name must not exceed 15 characters' }),
});

type SizeFormValues = z.infer<typeof formSchema>;

interface SizeFormProps {
	initialData: Size | null;
}

export const SizeForm: React.FC<SizeFormProps> = ({ initialData }) => {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [dialogOpen, setDialogOpen] = useState(false);

	const params = useParams();
	const router = useRouter();

	const form = useForm<SizeFormValues>({
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

	const title = initialData ? 'Edit Size' : 'Create Size';
	const description = initialData ? 'Edit Size' : 'Add a new Size';
	const action = initialData ? 'Save changes' : 'Create Size';
	const toastMessage = initialData
		? 'Size updated'
		: 'Size created successfully';

	const onSubmit = async (data: SizeFormValues) => {
		setLoading(true);
		setError(null);
		try {
			if (initialData) {
				await axios.patch(
					`/api/${params.storeId}/sizes/${params.sizeId}`,
					data,
				);
			} else {
				await axios.post(`/api/${params.storeId}/sizes`, data);
			}
			router.refresh();
			toast.success(toastMessage);
			router.push(`/${params.storeId}/sizes`);
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
			await axios.delete(`/api/${params.storeId}/sizes/${params.sizeId}`);
			router.push(`/${params.storeId}/sizes`);
			toast.success('Size deleted successfully');
		} catch (err) {
			handleAPIError(err);
			toast.error(
				`Make sure you remove all product using for Size first: ${
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
						size='icon'
						onClick={() => setDialogOpen(true)}
						disabled={loading}
						data-testid='Sizes-delete-button'
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
				<form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
					<div className='grid grid-cols-3 gap-8'>
						<FormField
							control={form.control}
							name='name'
							render={({ field, fieldState }) => (
								<FormItem>
									<FormLabel data-testid='size-NameSubtitle'>Name</FormLabel>

									<FormControl>
										<div className='flex items-center'>
											<Input
												data-testid='size-NameInput'
												disabled={loading}
												placeholder='Size name'
												maxLength={21}
												{...field}
											/>
											{!fieldState.error && field.value && (
												<CircleCheckBig className='ml-2 h-4 w-4 text-green-500' />
											)}
										</div>
									</FormControl>
									<FormMessage>{fieldState.error?.message}</FormMessage>
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name='value'
							render={({ field, fieldState }) => (
								<FormItem>
									<FormLabel data-testid='size-valueSubtitle'>Name</FormLabel>

									<FormControl>
										<div className='flex items-center'>
											<Input
												data-testid='size-valueInput'
												disabled={loading}
												placeholder='Size value'
												maxLength={21}
												{...field}
											/>
											{!fieldState.error && field.value && (
												<CircleCheckBig className='ml-2 h-4 w-4 text-green-500' />
											)}
										</div>
									</FormControl>
									<FormMessage>{fieldState.error?.message}</FormMessage>
								</FormItem>
							)}
						/>
					</div>
					<Button
						type='submit'
						data-testid='size-submitButton'
						disabled={loading}
					>
						{loading ? 'Saving...' : action}
					</Button>
				</form>
			</Form>
			{/* <Separator /> */}

			<Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Confirm Deletion</DialogTitle>
					</DialogHeader>
					<p>
						Are you sure you want to delete this Size? This action cannot be
						undone.
					</p>
					<DialogFooter>
						<Button
							variant='outline'
							onClick={() => setDialogOpen(false)}
							disabled={loading}
							data-testid='size-cancelButton'
						>
							Cancel
						</Button>
						<Button
							data-testid='size-deleteButton'
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
