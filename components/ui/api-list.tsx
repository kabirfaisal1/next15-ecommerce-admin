'use client';
//global inports
import { useParams } from 'next/navigation';
import React from 'react';

//local imports
import { useOrigin } from '../../hooks/use-origin';
import { ApiAlert } from './api-alert';

interface ApiListProps {
	entityName: string;
	entityIdName: string;
}

export const ApiList: React.FC<ApiListProps> = ({
	entityName,
	entityIdName,
}) => {
	const params = useParams();
	const origin = useOrigin();

	const baseUrl = `${origin}/api/${params.storeId}`;

	return (
		<React.Fragment>
			<ApiAlert
				title='GET'
				variant='public'
				description={`${baseUrl}/${entityName}`}
				testid='apiList_getAll'
			/>
			<ApiAlert
				title='GET'
				variant='public'
				description={`${baseUrl}/${entityName}/{${entityIdName}}`}
				testid='apiList_get'
			/>
			<ApiAlert
				title='POST'
				variant='admin'
				description={`${baseUrl}/${entityName}`}
				testid='apiList_post'
			/>
			<ApiAlert
				title='PATCH'
				variant='admin'
				description={`${baseUrl}/${entityName}/{${entityIdName}}`}
				testid='apiList_patch'
			/>
			<ApiAlert
				title='DELETE'
				variant='admin'
				description={`${baseUrl}/${entityName}/{${entityIdName}}`}
				testid='apiList_delete'
			/>
		</React.Fragment>
	);
};
