'use client';
// global imports
import { cn } from '@/lib/utils';
import { usePathname, useParams } from 'next/navigation';

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
		},
		{
			href: `/${params.storeId}/billboards`,
			label: 'Billboards',
			active: pathname === `/${params.storeId}/billboards`,
			id: 'billboards',
		},
		{
			href: `/${params.storeId}/categories`,
			label: 'Categories',
			active: pathname === `/${params.storeId}/categories`,
			id: 'categories',
		},
		{
			href: `/${params.storeId}/sizes`,
			label: 'Size',
			active: pathname === `/${params.storeId}/sizes`,
			id: 'sizes',
		},
		{
			href: `/${params.storeId}/colors`,
			label: 'Colors',
			active: pathname === `/${params.storeId}/colors`,
			id: 'colors',
		},
		{
			href: `/${params.storeId}/settings`,
			label: 'Settings',
			active: pathname === `/${params.storeId}/settings`,
			id: 'store_settings',
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
						data-testid={route.id}
						className={cn(
							'pt-4 text-sm font-medium transition-colors hover:text-primary',
							route.active
								? 'text-black dark:text-white'
								: 'text-muted-foreground',
						)}
					>
						{route.label}
					</NavigationMenuLink>
				))}
			</NavigationMenuList>
		</NavigationMenu>
	);
}
