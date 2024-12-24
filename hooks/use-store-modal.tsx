import { create } from 'zustand';

// Interface defining the shape of the store for the useStoreModal hook
interface useStoreModalStore {
	isOpen: boolean; // Indicates if the modal is open
	onOpen: () => void; // Function to open the modal
	onClose: () => void; // Function to close the modal
}

// Custom hook to manage the state of the store modal using Zustand
export const useStoreModal = create<useStoreModalStore>(set => ({
	isOpen: false, // Initial state of the modal (closed)
	onOpen: () => set({ isOpen: true }), // Function to set the modal state to open
	onClose: () => set({ isOpen: false }), // Function to set the modal state to closed
}));
