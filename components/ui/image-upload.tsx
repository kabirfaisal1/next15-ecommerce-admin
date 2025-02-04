'use client';
// global import
import React, { useEffect, useState } from 'react';

import { CldUploadWidget } from 'next-cloudinary'; // Replace 'some-library' with the actual library name

// local import
import { Button } from '@/components/ui/button';
import { ImagePlus, Trash } from 'lucide-react';
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
	const [isMounted, setIsMounted] = useState(false);

	useEffect(() => {
		setIsMounted(true);
	}, []);

	const onUpload = (results: { info?: { secure_url: string } | string }) => {
		if (typeof results.info === 'object' && results.info?.secure_url) {
			console.log('secure_url', results.info.secure_url);
			onChange(results.info.secure_url);
		} else {
			console.error('Upload failed or info is missing');
		}
	};

	if (!isMounted) {
		return null;
	}

	return (
		<div>
			<div className='mb-4 flex items-center gap-4'>
				{value.map(url => (
					<div
						key={url}
						className='relative w-[200px] h-[200px] rounded-md overflow-hidden'
					>
						<div className='z-10 absolute top-2 right-2'>
							<Button
								type='button'
								onClick={() => onRemove(url)}
								variant={'destructive'}
								size={'icon'}
								data-testid='remove-image'
							>
								<Trash className='h-4 w-4' />
							</Button>
						</div>
						<Image
							className='object-cover'
							alt='image'
							src={url}
							layout='fill'
							data-testid='image-preview'
						/>
					</div>
				))}
			</div>
			<CldUploadWidget onSuccess={onUpload} uploadPreset='ecommerce'>
				{({ open }) => (
					<Button
						onClick={() => open?.()}
						type='button'
						disabled={disabled}
						variant={'secondary'}
						data-testid='upload-image'
					>
						<ImagePlus />
						Upload Image
					</Button>
				)}
			</CldUploadWidget>
		</div>
	);
};

export default ImageUpload;
