import jwt, { type JwtPayload } from 'jsonwebtoken';
import { authRepository } from '../repositories/auth.repository.js';
import { type Request, type Response, type NextFunction } from 'express';
import { constants } from '../constants.js';
import z from 'zod';
import { validateUUID } from '../utils/general.util.js';

// a middleware that authenticate a user
const protect = async (req: Request, res: Response, next: NextFunction) => {
	const authHeader = req.headers.authorization;

	if (!authHeader || !authHeader.startsWith('Bearer')) {
		return res.status(401).json({ message: ' Unauthorized' });
	}

	const token = authHeader.split(' ')[1];

	if (!token) {
		return res.status(401).json({ message: ' Unauthorized' });
	}

	try {
		const decoded = jwt.verify(token, constants.ACCESS_TOKEN_KEY) as JwtPayload;

		if (!decoded.sub) {
			return res.status(401).json({ message: 'Unauthorized: Invalid payload' });
		}

		const userIdValidation = validateUUID(decoded.sub);
		if (!userIdValidation.success) {
			return res.status(401).json({ message: 'Unauthorized: Malformed User Identity' });
		}

		const userId = decoded.sub;

		req.user = { id: userId };

		next();
	} catch (error) {
		return res.status(401).json({ message: ' Expired or invalid token' }); // 401 to request for new token
	}
};

// a middleware that verifies refresh token
const verifyRefreshToken = async (req: Request, res: Response, next: NextFunction) => {
	const token = req.cookies?.refreshToken;
	if (!token) return res.status(401).json({ message: 'No refresh token' });

	try {
		const refreshToken = req.cookies?.refreshToken;
		if (!refreshToken) return res.status(401).json({ message: 'Not authorized' });

		const decodedToken = jwt.verify(refreshToken, constants.REFRESH_TOKEN_KEY);
		if (!decodedToken) return res.status(401).json({ message: 'Not authorized' });

		const { sub } = decodedToken as JwtPayload;

		const userId = sub as string;
		const user = await authRepository.findById(userId);

		if (!user) return res.status(401).json({ message: 'User not found' });
		req.user = { id: userId };

		next();
	} catch (err) {
		return res.status(403).json({ message: 'Refresh token expired or invalid' });
	}
};

// validate params
const validateParams = (paramNames: string[]) => {
	return (req: Request, res: Response, next: NextFunction) => {
		const errors: any = [];

		paramNames.forEach((paramName) => {
			const id = req.params[paramName] as string;
			const result = validateUUID(id);

			if (!result.success) {
				errors.push(
					...result.error.issues.map((issue) => ({
						message: issue.message,
						path: issue.path,
					})),
				);
			}
		});

		if (errors.length > 0) {
			return res.status(400).json({
				success: false,
				errors,
			});
		}

		next();
	};
};

export const authMiddleware = {
	verifyRefreshToken,
	protect,
	validateParams,
};
