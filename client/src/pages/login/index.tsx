import React, { useState } from 'react';
import { InputField, Button } from '../../components/ui';
import { Link } from 'react-router';
import { z } from 'zod';
import { useAppDispatch } from '../../hooks';
import { authThunk } from '../../features/auth';
import { useNavigate, useLocation } from 'react-router';
import { loginSchema, type TLoginForm } from '../../schemas';
import { formatZodErrors, mapBackendZodErrors } from '../../utils';

export const LoginPage = () => {
	const [formData, setFormData] = useState<TLoginForm>({
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

		if (errors[name] || errors.server) {
			setErrors((prev) => ({
				...prev,
				[name]: '',
				server: '',
			}));
		}
	};

	const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
		e.preventDefault();
		const result = loginSchema.safeParse(formData);

		if (!result.success) {
			setErrors(formatZodErrors(result.error));
			return;
		}

		try {
			setErrors({});

			await dispatch(authThunk.login(result.data)).unwrap();

			navigate(from, { replace: true });
		} catch (error: any) {
			const backendErrors = mapBackendZodErrors(error);
			if (backendErrors) {
				setErrors(backendErrors);
			} else {
				setErrors({
					server: 'Invalid email or password. Please try again.',
				});
			}
		}
	};

	return (
		<div className="h-screen w-screen flex justify-center items-center">
			<div className="bg-white p-8 rounded w-full max-w-md">
				<h2 className="text-2xl font-bold text-center mb-6">Login</h2>
				<form className="flex flex-col gap-5 relative " onSubmit={handleSubmit}>
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
					<small className="absolute -bottom-2 left-1/2 -translate-x-1/2 translate-y-1/2 w-full text-center right-1/2 text-red-600 ">
						{errors.server}
					</small>
				</form>
				<div className="mt-4 text-center">
					<p className="text-gray-600">
						<span className="mr-2">Don't have an account?</span>
						<Link className=" font-bold underline underline-offset-4 " to={'/register'}>
							Register
						</Link>
					</p>
				</div>
			</div>
		</div>
	);
};
