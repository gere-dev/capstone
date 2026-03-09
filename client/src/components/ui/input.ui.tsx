import React, { type InputHTMLAttributes } from 'react';

interface InputFieldsProps extends InputHTMLAttributes<HTMLInputElement> {
	label?: string;
	error?: string;
	className?: React.HtmlHTMLAttributes<HTMLInputElement>['className'];
}

export const InputField: React.FC<InputFieldsProps> = ({ label, error, className, ...props }) => {
	return (
		<div className="flex flex-col flex-1">
			{label && (
				<label className="block text-gray-700 text-sm font-bold mb-2" htmlFor={label}>
					{label}
				</label>
			)}
			<input
				className={`appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${className} ${
					error ? 'border-red-500' : 'border-gray-300'
				}`}
				{...props}
			/>
			{error && <p className="text-red-500 text-xs italic mt-1">{error}</p>}
		</div>
	);
};
