import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	variant?: 'primary' | 'secondary' | 'outline';
}

export const Button: React.FC<ButtonProps> = ({ children, variant = 'primary', className = '', ...props }) => {
	const baseClasses = 'w-full py-2 px-4 rounded focus:outline-none focus:shadow-outline';

	const variantClasses = {
		primary: 'bg-blue-500 hover:bg-blue-700 text-white',
		secondary: 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-100',
		outline: 'border border-blue-500 text-blue-500 hover:bg-blue-50 text-white',
	};

	return (
		<button className={`${baseClasses} ${variantClasses[variant]} ${className}`} {...props}>
			{children}
		</button>
	);
};
