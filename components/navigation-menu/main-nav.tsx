'use client';
// global imports
import { cn } from '@/lib/utils';
import { usePathname, useParams } from 'next/navigation';
import { ChartNoAxesGantt, MonitorCog } from 'lucide-react';

// local imports
import {
	NavigationMenu,
	NavigationMenuLink,
	NavigationMenuList,
} from '@/components/ui/navigation-menu';

export function MainNav({
	className,
	...props
}: React.HTMLAttributes<HTMLElement>) {
	const pathname = usePathname();
	const params = useParams();
	/**
	 * An array of route objects used for navigation in the application.
	 * Each route object contains the following properties:
	 *
	 * @property {string} href - The URL path for the route.
	 * @property {string} label - The display label for the route.
	 * @property {boolean} active - Indicates if the route is currently active based on the pathname.
	 * @property {string} id - A unique identifier for the route.
	 * @property {Array<Object>} [children] - An optional array of child route objects, each containing the same properties as the parent route.
	 */
	const routes = [
		{
			href: `/${params.storeId}`,
			label: 'Store Overview',
			active: pathname === `/${params.storeId}`,
			id: 'store_overview',
			icon: <ChartNoAxesGantt />,
		},
		{
			href: `/${params.storeId}/settings`,
			label: 'Settings',
			active: pathname === `/${params.storeId}/settings`,
			id: 'store_settings',
			icon: <MonitorCog />,
		},
	];

	return (
		<NavigationMenu
			className={cn('flex items-center space-x-4', className)} // Add margin to ensure space between buttons
			data-testid='main-NavigationMenu'
			{...props}
		>
			<NavigationMenuList className='flex space-x-4'>
				{routes.map(route => (
					<NavigationMenuLink
						key={route.href}
						href={route.href}
						id={route.id}
						data-testid={route.id}
						className={cn(
							'pt-4 text-sm font-medium transition-colors hover:text-primary',
							route.active
								? 'text-black dark:text-white'
								: 'text-muted-foreground',
						)}
					>
						{route.icon} {route.label}
					</NavigationMenuLink>
				))}
			</NavigationMenuList>
		</NavigationMenu>
	);
}
