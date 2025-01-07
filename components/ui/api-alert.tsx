// global import
import { Copy, Server } from 'lucide-react';
import { toast } from 'react-hot-toast';

// local import
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge, BadgeProps } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface ApiAlertProps {
	title: string;
	description: string;
	variant: 'public' | 'admin';
	id: string;
}

const textMap: Record<ApiAlertProps['variant'], string> = {
	public: 'Public',
	admin: 'Admin',
};

const variantMap: Record<ApiAlertProps['variant'], BadgeProps['variant']> = {
	public: 'secondary',
	admin: 'destructive',
};

export const ApiAlert: React.FC<ApiAlertProps> = ({
	title,
	description,
	variant = 'public',
	id,
}) => {
	const onCopy = (description: string) => {
		navigator.clipboard.writeText(description);
		toast.success('API Route copied to clipboard.');
	};

	return (
		<Alert>
			<Server
				id={`${id}_serverIcon`}
				data-testid={`${id}_serverIcon`}
				className='h-4 w-4'
			/>
			<AlertTitle
				className='flex items-center gap-x-2'
				id={`${id}_${title}`}
				data-testid={`${id}_${title}`}
			>
				{title}
				<Badge
					variant={variantMap[variant]}
					id={`${id}_badge`}
					data-testid={`${id}_badge`}
				>
					{textMap[variant]}
				</Badge>
			</AlertTitle>
			<AlertDescription className='mt-4 flex items-center justify-between'>
				<code
					className='relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold'
					id={`${id}_code`}
					data-testid={`${id}_code`}
				>
					{description}
				</code>
				<Button
					variant='outline'
					size='sm'
					id={`${id}_copyButton`}
					data-testid={`${id}_copyButton`}
					onClick={() => onCopy(description)}
				>
					<Copy className='h-4 w-4' />
				</Button>
			</AlertDescription>
		</Alert>
	);
};
