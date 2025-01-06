'use clint';

import { Store } from '@prisma/client';

interface SettingFormProps {
	initialData: Store;
}
export const SettingForm: React.FC<SettingFormProps> = ({ initialData }) => {
	return (
		<div className='flex items-center justify-between'>
			{/* Test <Heading title='Settings' description='Manage Store Preferences' /> */}
		</div>
	);
};
