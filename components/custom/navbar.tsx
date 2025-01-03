import { UserButton } from '@clerk/nextjs';
import { MainNav } from '@/components/custom/main-nav';
import StoreSwitcher from '@/components/custom/store-switcher';

const NavBar = () => {
	return (
		<div className='border-b'>
			<div className='flex h-16 items-center px-4'>
				<StoreSwitcher />

				<MainNav className='mx-6' />
				<div className='ml-auto flex items-center space-x-4'>
					{/* <ThemeToggle /> */}
					<UserButton afterSignOutUrl='/' />
				</div>
			</div>
		</div>
	);
};

export default NavBar;
