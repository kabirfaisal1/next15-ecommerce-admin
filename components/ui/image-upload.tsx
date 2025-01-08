'use client';
// global import
import React, { useEffect, useState } from 'react';

import { CldUploadWidget } from 'next-cloudinary'; // Replace 'some-library' with the actual library name

// local import
import { Button } from '@/components/ui/button';
import { ImagePlusIcon, Trash } from 'lucide-react';
import Image from 'next/image';

interface ImageUploadProps {
	disabled?: boolean;
	onChange: (value: string) => void;
	onRemove: (value: string) => void;
	value: string[];
}

const ImageUpload: React.FC<ImageUploadProps> = ({
	disabled,
	onChange,
	onRemove,
	value,
}) => {
	// State to track if the component is mounted
	const [isMounted, setIsMounted] = useState(false);

	// useEffect hook to set the isMounted state to true after the component mounts
	useEffect(() => {
		setIsMounted(true);
	}, []);

	const onUpload = (result: { info: { secure_url: string } }) => {
		onChange(result.info.secure_url);
	};

	// If the component is not mounted, return null to prevent server-side rendering
	if (!isMounted) return null;

	return (
		<React.Fragment>
			{/* Display the uploaded images */}
			<div className='mb-4 flex items-center gap-4'>
				{value.map(url => (
					<div
						key={url}
						className='relative w-[200px] h-[200px] rounded-md overflow-hidden'
					>
						<div className='z-10 absolute top-2 right-2'>
							<Button
								key={`remove-${url}`}
								id='image-remove'
								data-testid='image-remove'
								type='button'
								onClick={() => {
									onRemove(url);
								}}
								variant='destructive'
								size='sm'
							>
								<Trash className='h-4 w-4' />
							</Button>
						</div>
						{url && (
							<Image
								layout='fill'
								className='object-cover'
								alt='Image'
								src={url}
								id='image'
								data-testid='image'
							/>
						)}
					</div>
				))}
			</div>
			{/* this is to open the image upload widget */}
			<CldUploadWidget onUploadAdded={onUpload} uploadPreset='ecommerce'>
				{({ open }) => {
					const onClick = () => {
						open();
					};
					return (
						<Button
							type='button'
							onClick={onClick}
							disabled={disabled}
							variant='secondary'
							id='image-upload'
							data-testid='image-upload'
						>
							<ImagePlusIcon className='h-4 w-4 mr-2' />
							Upload Image
						</Button>
					);
				}}
			</CldUploadWidget>
		</React.Fragment>
	);
};

export default ImageUpload;
