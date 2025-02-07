'use client';
//global import
import * as z from 'zod';
import React from 'react';
import { Billboards } from '@prisma/client';
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
	label: z
		.string()
		.min(1, 'Name is required')
		.max(21, 'Name must be less than 21 characters'),
	imageUrl: z.string().min(1),
});

type BillboardFormValues = z.infer<typeof formSchema>;

interface BillboardFormProps {
	initialData: Billboards | null;
}

export const BillboardForm: React.FC<BillboardFormProps> = ({
	initialData,
}) => {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [dialogOpen, setDialogOpen] = useState(false);

	const params = useParams();
	const router = useRouter();

	const form = useForm<BillboardFormValues>({
		resolver: zodResolver(formSchema),
		defaultValues: initialData || {
			label: '',
			imageUrl: '',
		},
	});

	const handleAPIError = (err: unknown) => {
		if (axios.isAxiosError(err)) {
			setError(err.response?.data?.message || 'An unexpected error occurred.');
		} else {
			setError('An unexpected error occurred.');
		}
	};

	const title = initialData ? 'Edit billboard' : 'Create Billboard';
	const description = initialData ? 'Edit billboard' : 'Add a new billboard';
	const action = initialData ? 'Save changes' : 'Create billboard';
	const toastMessage = initialData
		? 'Billboard updated'
		: 'Billboard created successfully';

	const onSubmit = async (data: BillboardFormValues) => {
		setLoading(true);
		setError(null);
		try {
			if (initialData) {
				await axios.patch(
					`/api/${params.storeId}/billboards/${params.billboardId}`,
					data,
				);
			} else {
				await axios.post(`/api/${params.storeId}/billboards`, data);
			}
			router.refresh();
			toast.success(toastMessage);
			router.push(`/${params.storeId}/billboards`);
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
				`/api/${params.storeId}/billboards/${params.billboardId}`,
			);
			router.push(`/${params.storeId}/billboards`);
			toast.success('Billboard deleted successfully');
		} catch (err: unknown) {
			if (axios.isAxiosError(err) && err.response?.status === 400) {
				toast.error(
					'Make sure you remove all categories linked to this billboard before deleting.',
				);
			} else {
				toast.error('Something went wrong.');
			}
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
						data-testid='billboards-delete-button'
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
						data-testid='billboards-formField'
						control={form.control}
						name='imageUrl'
						render={({ field }) => (
							<FormItem>
								<FormLabel data-testid='billboards-backgroundImage-label'>
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
									<FormLabel data-testid='billboards-labelSubtitle'>
										Label
									</FormLabel>

									<FormControl>
										<div className='flex items-center'>
											<Input
												data-testid='billboards-labelInput'
												disabled={loading}
												placeholder='Billboard name'
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
					</div>
					<Button
						type='submit'
						data-testid='billboards-submitButton'
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
						Are you sure you want to delete this billboard? This action cannot
						be undone.
					</p>
					<DialogFooter>
						<Button
							variant='outline'
							onClick={() => setDialogOpen(false)}
							disabled={loading}
							data-testid='billboards-cancelButton'
						>
							Cancel
						</Button>
						<Button
							data-testid='billboards-deleteButton'
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
