import z from 'zod';

export const userBaseSchema = z.object({
	name: z.string().min(2, 'Please enter a valid name').max(50, 'Name is too long'),
	email: z
		.string()
		.email('Please enter a valid email address')
		.max(50, 'Email is too long')
		.transform((email) => email.trim().toLowerCase()),
	password: z
		.string()
		.min(6, 'Password must be at least 6 characters')
		.max(60, 'Password is too long')
		.transform((password) => password.trim()),
});

export const userSchema = userBaseSchema.omit({ password: true }).extend({
	id: z.uuid(),
	createdAt: z.date().optional(),
	updatedAt: z.date().optional(),
});

export const registerSchema = userBaseSchema
	.extend({
		confirmPassword: z
			.string()
			.min(6, 'Confirm password must be at least 6 characters')
			.transform((password) => password.trim()),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Passwords don't match",
		path: ['confirmPassword'],
	});

export const loginSchema = userBaseSchema.pick({ email: true, password: true });

export type TRegisterForm = z.infer<typeof registerSchema>;
export type TLoginForm = z.infer<typeof loginSchema>;
export type TUserBase = z.infer<typeof userBaseSchema>;
export type TUser = z.infer<typeof userSchema>;
