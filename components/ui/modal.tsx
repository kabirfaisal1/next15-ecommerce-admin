'use client';

import
    {
        Dialog,
        DialogContent,
        DialogDescription,
        // DialogFooter,
        DialogHeader,
        DialogTitle,
    } from '@/components/ui/dialog';
// import { Button } from '@/components/ui/button';

interface ModalProps
{
    title: string;
    description: string;
    isOpen: boolean;
    onClose: () => void;
    children?: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ( {
    title,
    description,
    isOpen,
    onClose,
    children,
} ) =>
{
    const onChange = ( open: boolean ) =>
    {
        if ( !open )
        {
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
                    <DialogDescription id='dialogDescription' data-testid={`descriptionFor_${title}`}>
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
