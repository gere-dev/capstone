import type { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { z } from 'zod';
import { authRepository } from '../repositories/auth.repository.js';

import { authUtils } from '../utils/auth.util.js';
import { loginSchema, registerSchema } from '../schema/user.schema.js';

export class AuthController {
	private readonly repo = authRepository;
	private readonly cookieOptions = {
		httpOnly: true,
		secure: true,
		sameSite: 'none' as const,
		maxAge: 365 * 24 * 60 * 60 * 1000,
	};

	private handleError(res: Response, error: unknown) {
		if (error instanceof z.ZodError) {
			return res.status(400).json({
				success: false,
				errors: error.issues.map((err) => ({
					message: err.message,
					path: err.path,
				})),
			});
		}
		console.error('[Auth Controller Error]:', error);
		return res.status(500).json({ message: 'Internal server error' });
	}

	public register = async (req: Request, res: Response) => {
		try {
			const validatedData = registerSchema.parse(req.body);

			const existingUser = await this.repo.findUserByEmail(validatedData.email);
			if (existingUser) {
				return res.status(409).json({ message: 'User already exists' });
			}

			const hashedPassword = await bcrypt.hash(validatedData.password, 12);
			const newUser = await this.repo.register({
				...validatedData,
				password: hashedPassword,
			});

			const { accessToken, refreshToken } = authUtils.generateTokens(newUser.id);
			res.cookie('refreshToken', refreshToken, this.cookieOptions);

			res.status(201).json({ user: newUser, accessToken });
		} catch (error) {
			this.handleError(res, error);
		}
	};

	public login = async (req: Request, res: Response) => {
		const DUMMY_HASH = '$2b$10$K9RP.S9f0jNo9NfS9NfS9Oe9Oe9Oe9Oe9Oe9Oe9Oe9Oe9Oe9Oe9Oe';
		try {
			const { email, password } = loginSchema.parse(req.body);
			const user = await this.repo.findUserByEmail(email);

			const hashToVerify = user ? user.password : DUMMY_HASH;
			const isValidPassword = await bcrypt.compare(password, hashToVerify);

			if (!user || !isValidPassword) {
				return res.status(401).json({ message: 'Invalid email or password' });
			}

			const { accessToken, refreshToken } = authUtils.generateTokens(user.id);
			res.cookie('refreshToken', refreshToken, this.cookieOptions);

			const userData = { id: user.id, name: user.name, email: user.email };
			res.status(200).json({ user: userData, accessToken });
		} catch (error) {
			this.handleError(res, error);
		}
	};

	public logout = async (req: Request, res: Response) => {
		try {
			res.clearCookie('refreshToken', { ...this.cookieOptions, maxAge: 0 });
			res.status(200).json({ message: 'Logged out successfully' });
		} catch (error) {
			this.handleError(res, error);
		}
	};

	public refreshToken = async (req: Request, res: Response) => {
		try {
			const userId = req.user?.id;
			if (!userId) return res.status(401).json({ message: 'Unauthorized' });

			const { accessToken } = authUtils.generateTokens(userId);
			res.status(200).json({ accessToken });
		} catch (error) {
			res.status(401).json({ message: 'Invalid refresh token' });
		}
	};
}

export const authController = new AuthController();
