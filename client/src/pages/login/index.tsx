import React, { useState } from 'react';
import { InputField, Button } from '../../components/ui';
import { Link } from 'react-router';
import { z } from 'zod';
import { useAppDispatch } from '../../hooks';
import { authThunk } from '../../features/auth';
import { useNavigate, useLocation } from 'react-router';

const userSchema = z.object({
	email: z
		.email()
		.min(2, 'Please enter a valid email address')
		.max(50, 'Email is too long')
		.transform((email) => email.trim().toLowerCase()),
	password: z
		.string()
		.min(6, 'Password must be at least 6 characters')
		.max(60, 'Password is too long')
		.transform((password) => password.trim()),
});

type TFormData = z.infer<typeof userSchema>;

export const LoginPage = () => {
	const [formData, setFormData] = useState<TFormData>({
		email: '',
		password: '',
	});

	const [errors, setErrors] = useState<{ [key: string]: string }>({});
	const dispatch = useAppDispatch();
	const navigate = useNavigate();
	const location = useLocation();

	const from = location.state?.from?.pathname || '/';

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));

		if (errors[name]) {
			console.log('errors[name]', errors[name]);

			setErrors((prev) => ({
				...prev,
				[name]: '',
			}));
		}
	};

	const validate = () => {
		try {
			userSchema.parse(formData);

			setErrors({});
			return true;
		} catch (error) {
			const newErrors: { [key: string]: string } = {};

			if (error instanceof z.ZodError) {
				error.issues.forEach((err) => {
					const key = err.path.join('.');
					newErrors[key] = err.message;
				});
			}

			setErrors(newErrors);
			return false;
		}
	};

	const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
		e.preventDefault();

		setErrors({});

		if (validate()) {
			console.log('valid', formData);
			dispatch(authThunk.login(formData)).unwrap();

			navigate(from, { replace: true });
		}
	};

	return (
		<div className="h-screen w-screen flex justify-center items-center">
			<div className="bg-white p-8 rounded w-full max-w-md">
				<h2 className="text-2xl font-bold text-center mb-6">Login</h2>
				<form onSubmit={handleSubmit}>
					<InputField
						label="Email"
						type="email"
						placeholder="your@email.com"
						name="email"
						value={formData.email}
						onChange={handleChange}
						error={errors.email}
						required
					/>
					<InputField
						label="Password"
						type="password"
						placeholder="••••••••"
						name="password"
						value={formData.password}
						onChange={handleChange}
						error={errors.password}
						required
					/>

					<Button type="submit" variant="primary">
						Login
					</Button>
				</form>
				<div className="mt-4 text-center">
					<p className="text-gray-600">
						<span className="mr-2">Don't have an account?</span>
						<Link className="text-blue-500 hover:text-blue-700 font-bold" to={'/register'}>
							Register
						</Link>
					</p>
				</div>
			</div>
		</div>
	);
};
