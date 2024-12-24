'use client';

import { StoreModal } from '@/components/modals/store-modal';

import { useEffect, useState } from 'react';

// ModalProvider component ensures that the modal is only rendered on the client-side
// by using the useState and useEffect hooks to track the mounting state.
export const ModalProvider = () => {
	// State to track if the component is mounted
	const [isMounted, setIsMounted] = useState(false);

	// useEffect hook to set the isMounted state to true after the component mounts
	useEffect(() => {
		setIsMounted(true);
	}, []);

	// If the component is not mounted, return null to prevent server-side rendering
	if (!isMounted) return null;

	// Render the modal or other client-side only components here
	return (
		<>
			<StoreModal />
		</>
	);
};
