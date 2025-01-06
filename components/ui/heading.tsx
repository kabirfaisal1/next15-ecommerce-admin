import React from 'react';

interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
	title: string;
	description: string;
}

const Heading: React.FC<HeadingProps> = ({ title, description }) => {
	return (
		<div>
			<h2
				className='text-3xl font-bold tracking-tight'
				id='heading-title'
				data-testid='heading-title'
			>
				{title}
			</h2>
			<p
				className='text-sm text-muted-foreground'
				id='heading-description'
				data-testid='heading-description'
			>
				{description}
			</p>
		</div>
	);
};

export default Heading;
