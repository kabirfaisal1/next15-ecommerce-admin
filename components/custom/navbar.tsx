import { UserButton } from '@clerk/nextjs';
import { MainNav } from './main-nav';

const NavBar = () => {
	return (
		<div className='border-b'>
			<div className='flex h-16 items-center px-4'>
				<div>this will be store swithcer</div>
				{/* <StoreSwitcher items={stores} />*/}

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
