'use client';

import * as z from 'zod';
import axios from 'axios';
import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { Categories, Colors, Images, Products, Sizes } from '@prisma/client';
import { useParams, useRouter } from 'next/navigation';
import { Checkbox } from '@/components/ui/checkbox';
import { Trash, CircleCheckBig } from 'lucide-react';

import Heading from '@/components/ui/heading';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import { Separator } from '@/components/ui/separator';

import { AlertModal } from '@/components/modals/alert-modal';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
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
	name: z.string().min(1),
	images: z.object({ url: z.string() }).array(),
	price: z.coerce.number().min(1),
	categoryId: z.string().min(1),
	colorId: z.string().min(1),
	sizeId: z.string().min(1),
	isFeatured: z.boolean().default(false).optional(),
	isArchived: z.boolean().default(false).optional(),
});

type ProductFormValues = z.infer<typeof formSchema>;

interface ProductFormProps {
	categories: Categories[];
	colors: Colors[];
	sizes: Sizes[];
	initialData:
		| (Products & {
				images: Images[];
		  })
		| null;
}

export const ProductForm: React.FC<ProductFormProps> = ({
	initialData,
	categories,
	sizes,
	colors,
}) => {
	const params = useParams();
	const router = useRouter();
	const [dialogOpen, setDialogOpen] = useState(false);

	const [open, setOpen] = useState(false);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const title = initialData ? 'Edit product' : 'Create product';
	const description = initialData ? 'Edit a product.' : 'Add a new product';
	const toastMessage = initialData ? 'Product updated.' : 'Product created.';
	const action = initialData ? 'Save changes' : 'Create';

	const defaultValues = initialData
		? {
				...initialData,
				price: parseFloat(String(initialData?.price)),
			}
		: {
				name: '',
				images: [],
				price: 0,
				categoryId: '',
				colorId: '',
				sizeId: '',
				isFeatured: false,
				isArchived: false,
			};

	const form = useForm<ProductFormValues>({
		resolver: zodResolver(formSchema),
		defaultValues,
	});
	const handleAPIError = (err: unknown) => {
		if (axios.isAxiosError(err)) {
			setError(err.response?.data?.message || 'An unexpected error occurred.');
		} else {
			setError('An unexpected error occurred.');
		}
	};

	const onSubmit = async (data: ProductFormValues) => {
		try {
			setLoading(true);
			if (initialData) {
				await axios.patch(
					`/api/${params.storeId}/products/${params.productId}`,
					data,
				);
			} else {
				await axios.post(`/api/${params.storeId}/products`, data);
			}
			router.refresh();
			router.push(`/${params.storeId}/products`);
			toast.success(toastMessage);
		} catch (err) {
			handleAPIError(err);
			toast.error('Something went wrong.');
		} finally {
			setLoading(false);
		}
	};

	const onDelete = async () => {
		try {
			setLoading(true);

			await axios.delete(`/api/${params.storeId}/products/${params.productId}`);
			router.refresh();
			router.push(`/${params.storeId}/products`);
			toast.success('Product deleted.');
		} catch (err) {
			handleAPIError(err);
			toast.error('Something went wrong.');
		} finally {
			setLoading(false);
			setOpen(false);
		}
	};

	return (
		<>
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
						onClick={() => setDialogOpen(true)}
						disabled={loading}
						data-testid='products-delete-button'
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
					<FormField
						control={form.control}
						name='images'
						render={({ field, fieldState }) => (
							<FormItem>
								<FormLabel data-testid='product-image-label'>Images</FormLabel>
								<FormControl>
									<ImageUpload
										value={field.value.map(image => image.url)}
										disabled={loading}
										onChange={url => {
											const currentImages = form.getValues('images'); // Retrieve current images
											const newImage = { url: url }; // Create a new image object with the URL
											const updatedImages = [...currentImages, newImage]; // Add the new image to the array
											form.setValue('images', updatedImages, {
												shouldValidate: true,
											});
										}}
										onRemove={url =>
											field.onChange([
												...field.value.filter(current => current.url !== url),
											])
										}
									/>
								</FormControl>
								<FormMessage data-testid='FormMessage'>
									{fieldState.error?.message}
								</FormMessage>
							</FormItem>
						)}
					/>
					<div className='grid gap-8'>
						{/* Row One: Featured and Archive */}
						<div className='grid grid-cols-2 gap-4'>
							<FormField
								control={form.control}
								name='isFeatured'
								render={({ field }) => (
									<FormItem className='flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4'>
										<FormControl>
											<Checkbox
												data-testid='product-featured-input'
												disabled={loading}
												checked={field.value}
												onCheckedChange={field.onChange}
											/>
										</FormControl>
										<div className='space-y-1 leading-none'>
											<FormLabel>Featured</FormLabel>
										</div>
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name='isArchived'
								render={({ field }) => (
									<FormItem
										className={`flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 ${
											!initialData ? 'hidden' : ''
										}`}
									>
										<FormControl>
											<Checkbox
												data-testid='product-archived-input'
												disabled={loading}
												checked={field.value}
												onCheckedChange={field.onChange}
											/>
										</FormControl>
										<div className='space-y-1 leading-none'>
											<FormLabel>Archived</FormLabel>
										</div>
									</FormItem>
								)}
							/>
						</div>

						{/* Row Two: Name and Price */}
						<div className='grid grid-cols-2 gap-10'>
							<FormField
								control={form.control}
								name='name'
								render={({ field, fieldState }) => (
									<FormItem>
										<FormLabel>Name</FormLabel>
										<FormControl>
											<div className='flex items-center'>
												<Input
													disabled={loading}
													placeholder='Product name'
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
								name='price'
								render={({ field, fieldState }) => (
									<FormItem>
										<FormLabel>Price</FormLabel>
										<FormControl>
											<div className='flex items-center'>
												<Input
													type='number'
													disabled={loading}
													placeholder='9.99'
													{...field}
												/>
											</div>
										</FormControl>
										<FormMessage>{fieldState.error?.message}</FormMessage>
									</FormItem>
								)}
							/>
						</div>

						{/* Row Three: Category, Size, Color */}
						<div className='grid grid-cols-3 gap-4'>
							<FormField
								control={form.control}
								name='categoryId'
								render={({ field, fieldState }) => (
									<FormItem>
										<FormLabel>Category</FormLabel>
										<Select
											disabled={loading}
											onValueChange={field.onChange}
											value={field.value}
											defaultValue={field.value}
										>
											<FormControl>
												<SelectTrigger>
													<SelectValue placeholder='Select a category' />
												</SelectTrigger>
											</FormControl>
											<SelectContent>
												{categories.map(category => (
													<SelectItem key={category.id} value={category.id}>
														{category.name}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
										<FormMessage>{fieldState.error?.message}</FormMessage>
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name='sizeId'
								render={({ field, fieldState }) => (
									<FormItem>
										<FormLabel>Size</FormLabel>
										<Select
											disabled={loading}
											onValueChange={field.onChange}
											value={field.value}
											defaultValue={field.value}
										>
											<FormControl>
												<SelectTrigger>
													<SelectValue placeholder='Select a size' />
												</SelectTrigger>
											</FormControl>
											<SelectContent>
												{sizes.map(size => (
													<SelectItem key={size.id} value={size.id}>
														{size.name}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
										<FormMessage>{fieldState.error?.message}</FormMessage>
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name='colorId'
								render={({ field, fieldState }) => (
									<FormItem>
										<FormLabel>Color</FormLabel>
										<Select
											disabled={loading}
											onValueChange={field.onChange}
											value={field.value}
											defaultValue={field.value}
										>
											<FormControl>
												<SelectTrigger>
													<SelectValue placeholder='Select a color' />
												</SelectTrigger>
											</FormControl>
											<SelectContent>
												{colors.map(color => (
													<SelectItem key={color.id} value={color.id}>
														{color.name}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
										<FormMessage>{fieldState.error?.message}</FormMessage>
									</FormItem>
								)}
							/>
						</div>
					</div>
					<Button disabled={loading} className='ml-auto' type='submit'>
						{action}
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
						Are you sure you want to delete this product? This action cannot be
						undone.
					</p>
					<DialogFooter>
						<Button
							variant='outline'
							onClick={() => setDialogOpen(false)}
							disabled={loading}
							data-testid='products-cancelButton'
						>
							Cancel
						</Button>
						<Button
							data-testid='products-deleteButton'
							variant='destructive'
							onClick={onDelete}
							disabled={loading}
						>
							{loading ? 'Deleting...' : 'Delete'}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</>
	);
};
