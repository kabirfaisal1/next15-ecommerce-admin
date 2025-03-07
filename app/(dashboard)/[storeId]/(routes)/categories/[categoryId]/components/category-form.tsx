'use client';
//global import
import * as z from 'zod';
import React from 'react';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Trash, CircleCheckBig } from 'lucide-react';
import {
	Select,
	SelectTrigger,
	SelectValue,
	SelectContent,
	SelectItem,
} from '@/components/ui/select';
import axios from 'axios';
import { useParams, useRouter } from 'next/navigation';

//local import
import { Categories, Billboards } from '@prisma/client';
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
	billboardId: z
		.string()
		.min(1, { message: 'Billboard selection is required' }),
});

type CategoryFormValues = z.infer<typeof formSchema>;

interface CategoryFormProps {
	initialData: Categories | null;
	billboards: Billboards[];
}

export const CategoryForm: React.FC<CategoryFormProps> = ({
	initialData,
	billboards,
}) => {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [dialogOpen, setDialogOpen] = useState(false);

	const params = useParams();
	const router = useRouter();

	const form = useForm<CategoryFormValues>({
		resolver: zodResolver(formSchema),
		defaultValues: initialData || {
			name: '',
			billboardId: '',
		},
	});

	const handleAPIError = (err: unknown) => {
		if (axios.isAxiosError(err)) {
			setError(err.response?.data?.message || 'An unexpected error occurred.');
		} else {
			setError('An unexpected error occurred.');
		}
	};

	const title = initialData ? 'Edit Category' : 'Create Category';
	const description = initialData ? 'Edit Category' : 'Add a new Category';
	const action = initialData ? 'Save changes' : 'Create Category';
	const toastMessage = initialData
		? 'Category updated'
		: 'Category created successfully';

	const onSubmit = async (data: CategoryFormValues) => {
		setLoading(true);
		setError(null);
		try {
			if (initialData) {
				await axios.patch(
					`/api/${params.storeId}/categories/${params.categoryId}`,
					data,
				);
			} else {
				await axios.post(`/api/${params.storeId}/categories`, data);
			}
			router.refresh();
			toast.success(toastMessage);
			router.push(`/${params.storeId}/categories`);
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
			await axios.delete(
				`/api/${params.storeId}/categories/${params.categoryId}`,
			);
			router.push(`/${params.storeId}/categories`);
			toast.success('Category deleted successfully');
		} catch (err) {
			handleAPIError(err);
			toast.error(
				`Make sure you remove all product using for Category first: ${
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
						data-testid='Categorys-delete-button'
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
					<div className='space-y-8  max-w-2xl '>
						<FormField
							control={form.control}
							name='name'
							render={({ field, fieldState }) => (
								<FormItem>
									<FormLabel data-testid='Category-NameSubtitle'>
										Name
									</FormLabel>

									<FormControl>
										<div className='flex items-center'>
											<Input
												data-testid='category-NameInput'
												disabled={loading}
												placeholder='Category name'
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
							name='billboardId'
							render={({ field, fieldState }) => (
								<FormItem>
									<FormLabel data-testid='category-BillboardSubtitle'>
										Billboard
									</FormLabel>

									<Select
										disabled={loading}
										onValueChange={field.onChange}
										value={field.value}
										defaultValue={field.value}
									>
										<FormControl>
											<SelectTrigger data-testid='selectTrigger'>
												<SelectValue
													data-testid='SelectValue'
													placeholder='Select Billboard'
													defaultValue={field.value}
												></SelectValue>
											</SelectTrigger>
										</FormControl>
										<SelectContent data-testid='SelectContent'>
											{billboards.map(billboard => (
												<SelectItem
													data-testid={billboard.label}
													key={billboard.id}
													value={billboard.id}
												>
													{billboard.label}
												</SelectItem>
											))}
										</SelectContent>
									</Select>

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
							data-testid='category-submitButton'
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
						Are you sure you want to delete this Category? This action cannot be
						undone.
					</p>
					<DialogFooter>
						<Button
							variant='outline'
							onClick={() => setDialogOpen(false)}
							disabled={loading}
							data-testid='category-cancelButton'
						>
							Cancel
						</Button>
						<Button
							data-testid='category-deleteButton'
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
