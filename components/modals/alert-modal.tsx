'use client';

// global import
import { useState, useEffect } from 'react';

// local import
import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';

interface AlertModalProps {
	isOpen: boolean;
	onClose: () => void;
	onConfirm: () => void;
	loading: boolean;
}

/**
 * AlertModal component.
 *
 * This component renders a modal dialog that displays an alert message.
 * It provides options to confirm or close the alert.
 *
 * @param {boolean} isOpen - Indicates whether the modal is open.
 * @param {() => void} onClose - Function to call when the modal is closed.
 * @param {() => void} onConfirm - Function to call when the confirm action is triggered.
 * @param {boolean} loading - Indicates whether a loading state is active.
 *
 * @returns {JSX.Element} The rendered AlertModal component.
 */
export const AlertModal: React.FC<AlertModalProps> = ({
	isOpen,
	onClose,
	onConfirm,
	loading,
}) => {
	/**
	 * State to track if the component is mounted.
	 *
	 * @type {boolean} isMounted - Indicates whether the component is mounted.
	 * @function setIsMounted - Function to update the isMounted state.
	 */
	const [isMounted, setIsMounted] = useState(false);

	useEffect(() => {
		setIsMounted(true);
	}, []);

	// If the component is not mounted, do not render anything.
	if (!isMounted) return null;

	return (
		<Modal
			title='Are you sure?'
			description='This action cannot be undone'
			isOpen={isOpen}
			onClose={onClose}
		>
			<div className='pt-6 space-x-2 flex items-center justify-end w-full'>
				<Button onClick={onClose} variant='outline' disabled={loading}>
					Cancel
				</Button>
				<Button onClick={onConfirm} variant='destructive' disabled={loading}>
					Confirm
				</Button>
			</div>
		</Modal>
	);
};
