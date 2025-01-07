'use client';
// global imports
import { cn } from '@/lib/utils';
import { usePathname, useParams } from 'next/navigation';

// local imports
import {
	NavigationMenu,
	NavigationMenuLink,
	NavigationMenuList,
	// NavigationMenuTrigger,
	// NavigationMenuItem,
	// NavigationMenuContent,
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
			href: `/${params.storeId}/settings`,
			label: 'Settings',
			active: pathname === `/${params.storeId}/settings`,
			id: 'store_settings',
		},
		// this just a sample code
		// {
		// 	href: `/${params.storeId}/products`,
		// 	label: 'Products',
		// 	active: pathname === `/${params.storeId}/products`,
		// 	id: 'store_products',
		// 	children: [
		// 		{
		// 			href: `/${params.storeId}/products/women`,
		// 			label: 'Women',
		// 			active: pathname === `/${params.storeId}/products/women`,
		// 			id: 'store_products_women',
		// 		},
		// 		{
		// 			href: `/${params.storeId}/products/men`,
		// 			label: 'Man',
		// 			active: pathname === `/${params.storeId}/products/men`,
		// 			id: 'store_products_men',
		// 		},
		// 		{
		// 			href: `/${params.storeId}/products/suits`,
		// 			label: 'Suits',
		// 			active: pathname === `/${params.storeId}/products/suits`,
		// 			id: 'store_products_suits',
		// 		},
		// 		{
		// 			href: `/${params.storeId}/products/dresses`,
		// 			label: 'Dresses',
		// 			active: pathname === `/${params.storeId}/products/dresses`,
		// 			id: 'store_products_dresses',
		// 		},
		// 	],
		// },
		// {
		// 	href: `/${params.storeId}/accessories`,
		// 	label: 'Accessories',
		// 	active: pathname === `/${params.storeId}/accessories`,
		// 	id: 'store_accessories',
		// },
		// {
		// 	href: `/${params.storeId}/shoes`,
		// 	label: 'Shoes',
		// 	active: pathname === `/${params.storeId}/shoe`,
		// 	id: 'store_shoe',
		// },
	];

	return (
		<NavigationMenu
			className={cn('flex item-center space-x-4', className)}
			data-testid='main-NavigationMenu'
			{...props}
		>
			<NavigationMenuList className='flex space-x-4'>
				{routes.map(route => (
					// This is the code for nested navigation
					// route.children ? (
					// 	<NavigationMenuItem key={route.href}>
					// 		<NavigationMenuLink
					// 			href={route.href}
					// 			id={route.id}
					// 			data-testid={route.id}
					// 		>
					// 			<NavigationMenuTrigger>{route.label}</NavigationMenuTrigger>
					// 		</NavigationMenuLink>
					// 		<NavigationMenuContent className='hidden md:block'>
					// 			<div className='flex flex-col items-stretch justify-between'>
					// 				{route.children.map(child => (
					// 					<NavigationMenuLink
					// 						key={child.href}
					// 						href={child.href}
					// 						id={child.id}
					// 						data-testid={child.id}
					// 						className={cn(
					// 							'block text-sm font-medium transition-colors hover:text-primary mb-2',
					// 							child.active
					// 								? 'text-black dark:text-white font-bold'
					// 								: 'text-muted-foreground',
					// 						)}
					// 						style={{
					// 							width: '100%',
					// 							textAlign: 'center',
					// 							padding: '10px 20px',
					// 							margin: '5px 0',
					// 							borderBottom:
					// 								child !== route.children[route.children.length - 1]
					// 									? '1px dotted #ccc'
					// 									: 'none',
					// 						}}
					// 					>
					// 						{child.label}
					// 					</NavigationMenuLink>
					// 				))}
					// 			</div>
					// 		</NavigationMenuContent>
					// 	</NavigationMenuItem>
					// ) :
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
						style={{ marginRight: '16px' }} // Add margin to ensure space between buttons
					>
						{route.label}
					</NavigationMenuLink>
				))}
			</NavigationMenuList>
		</NavigationMenu>
	);
}
