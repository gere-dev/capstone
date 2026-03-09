import jwt from 'jsonwebtoken';
import { constants } from '../constants.js';

const generateTokens = (userId: string) => {
	// access token
	const accessToken = jwt.sign({}, constants.ACCESS_TOKEN_KEY, {
		subject: String(userId),
		expiresIn: '15m',
	});

	// regresh token
	const refreshToken = jwt.sign({}, constants.REFRESH_TOKEN_KEY, {
		subject: String(userId),
		expiresIn: '365d',
	});

	return {
		accessToken,
		refreshToken,
	};
};

export const authUtils = {
	generateTokens,
};
