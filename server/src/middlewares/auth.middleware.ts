import jwt, { type JwtPayload } from 'jsonwebtoken';
import { authRepository } from '../repositories/auth.repository.js';
import { type Request, type Response, type NextFunction } from 'express';
import { constants } from '../constants.js';

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

		const userId = decoded.sub;

		req.user = { id: userId };

		next();
	} catch (error) {
		//request for new access token
		return res.status(401).json({ message: ' Expired or invalid token' });
	}
};

// a middlware ethat check if the user is authorized to make changes
const isOwner = (req: Request, res: Response, next: NextFunction) => {
	const authenticatedUserId = req.user?.id;
	const requestedUserId = req.body.userId;

	if (!authenticatedUserId) {
		return res.status(401).json({ message: 'Not authenticated' }); // silent refresher
	}

	// check if the IDs match
	if (authenticatedUserId !== requestedUserId) {
		return res.status(403).json({ message: 'Forbidden: you are not authorized to make changes' });
	}

	next();
};

// a middleware verifies refresh token
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
		const user = await authRepository.getUserById(userId);

		req.user = { id: userId };
		if (!user) return res.status(401).json({ message: 'User not found' });

		next();
	} catch (err) {
		return res.status(403).json({ message: 'Refresh token expired or invalid' });
	}
};

export const authMiddleware = {
	verifyRefreshToken,
	protect,
	isOwner,
};
