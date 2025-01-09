'use client';
//global import
import * as z from 'zod';
import React from 'react';
import { Billboards } from '@prisma/client';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Trash } from 'lucide-react';
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

const formSchema = z.object({
	label: z.string().min(1, 'Name is required'),
	imgUrl: z.string().min(1),
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
		defaultValues: {
			label: initialData?.label || '',
			imgUrl: initialData?.imageUrl || '',
		},
	});

	const handleAPIError = (err: unknown) => {
		if (axios.isAxiosError(err)) {
			setError(err.response?.data?.message || 'An unexpected error occurred.');
		} else {
			setError('An unexpected error occurred.');
		}
	};

	const title = initialData ? 'Edit billboard' : 'Create billboard';
	const description = initialData ? 'Edit billboard' : 'Add a new billboard';
	const action = initialData ? 'Save changes' : 'Create billboard';

	const onSubmit = async (data: BillboardFormValues) => {
		setLoading(true);
		setError(null);
		try {
			await axios.patch(`/api/stores/${params.storeId}`, data);
			router.refresh();
		} catch (err) {
			handleAPIError(err);
		} finally {
			setLoading(false);
		}
	};

	const onDelete = async () => {
		setLoading(true);
		setError(null);

		try {
			await axios.delete(`/api/stores/${params.storeId}`);
			router.push('/');
		} catch (err) {
			handleAPIError(err);
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
						name='imgUrl'
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
									<FormLabel>Label</FormLabel>

									<FormControl>
										<Input
											data-testid='billboards-labelInput'
											disabled={loading}
											placeholder='Billboard name'
											{...field}
										/>
									</FormControl>
									<FormMessage>{fieldState.error?.message}</FormMessage>
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
			<Separator />

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

			{/* <ApiAlert
       title="NEXT_PUBLIC_API_URL" 
        description={`${origin}/api/${params.storeId}`} 
        variant="public"
      /> */}
		</div>
	);
};
