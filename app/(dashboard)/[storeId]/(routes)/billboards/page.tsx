// global imports
// import prismadb from '@/lib/prismadb';

//local imports
import { BillboardClient } from './components/client';

// This is a Server Component by default in the `app` directory
const Billboards = () => {
	return (
		<div className='flex-col'>
			<div className='flex-1 space-y-4 p-8 pt-6'>
				<BillboardClient />
			</div>
		</div>
	);
};

export default Billboards;
