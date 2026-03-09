import { type Request, type Response } from 'express';
import { z } from 'zod';
import { authRepository } from '../repositories/auth.repository.js';
import bcrypt from 'bcrypt';
import jwt, { type JwtPayload } from 'jsonwebtoken';
import { error } from 'node:console';
import type { IUser } from '../types/user.type.js';
import { authUtils } from '../utils/auth.util.js';

const registerSchema = z
	.object({
		name: z.string().min(2, 'Please enter a valid name').max(50, 'Name is too long'),
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
		confirmPassword: z
			.string()
			.min(6, 'Confirm password must be at least 6 characters')
			.transform((password) => password.trim()),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Passwords don't match",
		path: ['confirmPassword'],
	});

// register
const register = async (req: Request, res: Response) => {
	try {
		const validateData = registerSchema.parse(req.body);

		// hash password
		const hashedPassword = await bcrypt.hash(validateData.password, 12);
		validateData.password = hashedPassword;

		const newUserData = {
			name: validateData.name,
			email: validateData.email,
			password: hashedPassword,
		};

		const existingUser = await authRepository.getUserByEmail(validateData.email);

		if (existingUser) {
			return res.status(409).json({ message: 'User already exists' });
		}

		const newUser = await authRepository.register(newUserData);

		if (!newUser) {
			return res.status(400).json({ message: 'User registration failed' });
		}

		// generate tokens
		const { accessToken, refreshToken } = authUtils.generateTokens(newUser.id);

		if (!accessToken || !refreshToken) {
			return res.status(500).json({ message: 'Server configuration error' });
		}

		// set refresh token cookie
		res.cookie('refreshToken', refreshToken, {
			httpOnly: true,
			secure: true,
			sameSite: 'none',
			maxAge: 365 * 24 * 60 * 60 * 1000,
		});

		const userData: IUser = {
			name: newUser.name,
			email: newUser.email,
			id: newUser.id,
		};
		res.status(201).json({ user: userData, accessToken });
	} catch (err) {
		if (err instanceof z.ZodError) {
			const structuredErrors = err.issues.map((error) => ({
				message: error.message,
				path: error.path,
			}));

			res.status(400).json({
				success: false,
				errors: structuredErrors,
			});
		} else {
			console.log('[Register Controller] Error: ', err);
			res.status(500).json({ message: 'Internal server error' });
		}
	}
};

// login
const loginSchema = z.object({
	email: z.email('Email is invalid'),
	password: z.string().min(6, 'Password must be at least 6 characters'),
});

const login = async (req: Request, res: Response) => {
	try {
		const validateData = loginSchema.parse(req.body);
		const user = await authRepository.login(validateData);

		if (!user) {
			return res.status(401).json({ message: 'Invalid email or password' });
		}

		// generate tokens
		const { accessToken, refreshToken } = authUtils.generateTokens(user.id);

		if (!accessToken || !accessToken) {
			return res.status(500).json({ message: 'Server configuration error' });
		}

		// set refresh token cookie
		res.cookie('refreshToken', refreshToken, {
			httpOnly: true,
			secure: true,
			sameSite: 'none',
			maxAge: 365 * 24 * 60 * 60 * 1000,
		});

		// delete password
		const userData: IUser = {
			name: user.name,
			email: user.email,
			id: user.id,
		};

		res.status(201).json({ user: userData, accessToken });
	} catch (err) {
		if (err instanceof z.ZodError) {
			const validationErrors = err.issues.map((error) => ({
				message: error.message,
				path: error.path,
			}));
			res.status(400).json({
				success: false,
				errors: validationErrors,
			});
		} else {
			res.status(500).json({ message: 'Internal server error' });
		}
	}
};

// logout
const logout = async (req: Request, res: Response) => {
	try {
		res.clearCookie('refreshToken');
		res.status(200).json({ message: 'Logged out successfully' });
	} catch (err) {
		console.log('[Logout Controller] Error: ', err);
		res.status(500).send('Internal server');
	}
};

// refresh token
const refreshToken = async (req: Request, res: Response) => {
	try {
		const userId = req.user.id;
		console.log('refresh control user id: ', userId);

		// generate tokens
		const { accessToken } = authUtils.generateTokens(userId);

		res.status(200).json({ accessToken });
	} catch (error) {
		console.log('[Refresh Controller] Error: ', error);
		res.status(401).json({ message: 'Invalid refresh token' });
	}
};

export const authController = {
	register,
	login,
	logout,
	refreshToken,
};
