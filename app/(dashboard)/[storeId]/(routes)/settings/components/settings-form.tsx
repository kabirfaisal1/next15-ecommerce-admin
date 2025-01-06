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

interface SettingFormProps {
	initialData: Store;
}

const formSchema = z.object({
	name: z
		.string()
		.nonempty('Store name is required')
		.min(3, 'Store name is too short'),
});

type SettingFormValues = z.infer<typeof formSchema>;

export const SettingForm: React.FC<SettingFormProps> = ({ initialData }) => {
	const [open, setOpen] = useState(false);
	const [loading, setLoading] = useState(false);

	const form = useForm<SettingFormValues>({
		resolver: zodResolver(formSchema),
		defaultValues: initialData,
	});

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
