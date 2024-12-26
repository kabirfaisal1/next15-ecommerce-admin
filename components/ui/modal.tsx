'use client';

import {
	Dialog,
	DialogContent,
	DialogDescription,
	// DialogFooter,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';

/**
 * Props for the Modal component.
 *
 * @interface ModalProps
 * @property {string} title - The title of the modal.
 * @property {string} description - The description of the modal.
 * @property {boolean} isOpen - A boolean indicating whether the modal is open.
 * @property {() => void} onClose - A callback function to handle the modal close action.
 * @property {React.ReactNode} [children] - Optional children elements to be rendered inside the modal.
 */
interface ModalProps {
	title: string;
	description: string;
	isOpen: boolean;
	onClose: () => void;
	children?: React.ReactNode;
}

/**
 * Modal component that renders a dialog with a title, description, and children content.
 *
 * @param {ModalProps} props - The properties for the Modal component.
 * @param {string} props.title - The title of the modal.
 * @param {string} props.description - The description of the modal.
 * @param {boolean} props.isOpen - Boolean indicating whether the modal is open.
 * @param {() => void} props.onClose - Function to call when the modal is closed.
 * @param {React.ReactNode} props.children - The content to display inside the modal.
 *
 * @returns {JSX.Element} The rendered Modal component.
 */

export const Modal: React.FC<ModalProps> = ({
	title,
	description,
	isOpen,
	onClose,
	children,
}) => {
	/**
	 * Handles the change event for the modal.
	 *
	 * @param open - A boolean indicating whether the modal is open or not.
	 *               If false, the `onClose` function is called to close the modal.
	 */

	const onChange = (open: boolean) => {
		if (!open) {
			onClose();
		}
	};

	return (
		<Dialog open={isOpen} onOpenChange={onChange}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle id='dialogTitle' data-testid={`titleFor_${title}`}>
						{title}
					</DialogTitle>
					<DialogDescription
						id='dialogDescription'
						data-testid={`descriptionFor_${title}`}
					>
						{description}
					</DialogDescription>
				</DialogHeader>
				<div id='dialogChildren' data-testid={`childrenFor_${title}`}>
					{children}
				</div>
			</DialogContent>
		</Dialog>
	);
};
