import { useState, useEffect } from 'react';

/**
 * Custom hook to get the origin of the current window location.
 *
 * @returns {string | null} The origin of the current window location, or an empty string if the window is undefined.
 *
 * @example
 * const origin = useOrigin();
 * console.log(origin); // Outputs the origin of the current window location
 */
export const useOrigin = () => {
	const [mounted, setMounted] = useState(false);
	const origin =
		typeof window !== 'undefined' && window.location.origin
			? window.location.origin
			: '';

	useEffect(() => {
		setMounted(true);
	}, []);

	if (!mounted) return null;

	return origin;
};
