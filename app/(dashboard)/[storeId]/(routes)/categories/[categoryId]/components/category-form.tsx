'use client';
//global import
import * as z from 'zod';
import React from 'react';
import { Categories } from '@prisma/client';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Trash, CircleCheckBig } from 'lucide-react';
// import toast from 'react-hot-toast';
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
// import { AlertModal } from '@/components/modals/alert-modal';
import ImageUpload from '@/components/ui/image-upload';
import { Alert } from '@/components/ui/alert';
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import toast from 'react-hot-toast';

const formSchema = z.object({
	name: z
		.string()
		.min(1, 'Name is required')
		.max(21, 'Name must be less than 21 characters'),
	CategoryId: z.string().min(1),
});

type CategoryFormValues = z.infer<typeof formSchema>;

interface CategoryFormProps {
	initialData: Categories | null;
}

export const CategoryForm: React.FC<CategoryFormProps> = ({ initialData }) => {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [dialogOpen, setDialogOpen] = useState(false);

	const params = useParams();
	const router = useRouter();

	const form = useForm<CategoryFormValues>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			name: initialData?.name || '',
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
					`/api/${params.storeId}/categories/${params.CategoryId}`,
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
				`/api/${params.storeId}/categories/${params.CategoryId}`,
			);
			router.push(`/${params.storeId}/categories`);
			toast.success('Category deleted successfully');
		} catch (err) {
			handleAPIError(err);
			toast.error(
				`Make sure you remove all categories using for Category: ${
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
				<form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
					<FormField
						data-testid='Categorys-formField'
						control={form.control}
						name='imageUrl'
						render={({ field }) => (
							<FormItem>
								<FormLabel data-testid='Categorys-backgroundImage-label'>
									Background Image
								</FormLabel>

								<FormControl>
									<ImageUpload
										value={field.value ? [field.value] : []}
										disabled={loading}
										onChange={url => field.onChange(url)}
										onRemove={() => field.onChange('')}
									/>
								</FormControl>
							</FormItem>
						)}
					/>
					<div className='grid grid-cols-3 gap-8'>
						<FormField
							control={form.control}
							name='label'
							render={({ field, fieldState }) => (
								<FormItem>
									<FormLabel data-testid='Categorys-labelSubtitle'>
										Label
									</FormLabel>

									<FormControl>
										<div className='flex items-center'>
											<Input
												data-testid='Categorys-labelInput'
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
									<FormMessage>{fieldState.error?.message}</FormMessage>
								</FormItem>
							)}
						/>
					</div>
					<Button
						type='submit'
						data-testid='Categorys-submitButton'
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
						Are you sure you want to delete this Category? This action cannot be
						undone.
					</p>
					<DialogFooter>
						<Button
							variant='outline'
							onClick={() => setDialogOpen(false)}
							disabled={loading}
							data-testid='Categorys-cancelButton'
						>
							Cancel
						</Button>
						<Button
							data-testid='Categorys-deleteButton'
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
