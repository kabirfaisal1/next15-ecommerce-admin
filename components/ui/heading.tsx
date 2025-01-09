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
				data-testid='heading-title'
			>
				{title}
			</h2>
			<p
				className='text-sm text-muted-foreground'
				data-testid='heading-description'
			>
				{description}
			</p>
		</div>
	);
};

export default Heading;
