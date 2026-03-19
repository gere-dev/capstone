import type { AxiosResponse } from 'axios';
import { publicInstance } from './config.service';
import { jwtDecode } from 'jwt-decode';
import type { TRegisterCredintials } from '../types';

const login = async (credentials: { email: string; password: string }): Promise<AxiosResponse> => {
	return await publicInstance.post('/auth/login', credentials);
};

const register = async (credintials: TRegisterCredintials) => {
	return await publicInstance.post('/auth/register', credintials);
};

const logout = async (): Promise<AxiosResponse> => {
	setAccessToken('');
	return await publicInstance.post('/auth/logout');
};

let accessToken: string | null = null;
let accessTokenExp: number | null = null;
let refreshPromise: Promise<string> | null = null;

export function setAccessToken(token: string) {
	if (!token) {
		accessTokenExp = 0;
		return;
	}
	accessToken = token;
	const { exp } = jwtDecode<{ exp: number }>(token);
	accessTokenExp = exp;
}

export function getAccessToken() {
	return accessToken;
}

export function isTokenValid() {
	if (!accessToken || !accessTokenExp) return false;
	return accessTokenExp * 1000 > Date.now();
}

export async function getFreshToken(refreshClient: any) {
	if (isTokenValid()) return accessToken!;

	if (!refreshPromise) {
		refreshPromise = refreshClient
			.post('/auth/refresh')
			.then((res: any) => {
				setAccessToken(res.data.accessToken);
				return res.data.accessToken;
			})
			.finally(() => {
				refreshPromise = null;
			});
	}

	return refreshPromise;
}

export const authServices = {
	login,
	register,
	logout,
	setAccessToken,
	isTokenValid,
	getAccessToken,
	getFreshToken,
};
