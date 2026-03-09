import axios from 'axios';

// base url
const BASE_URL = import.meta.env.VITE_BASE || 'http://localhost:5000';

export const axiosInstance = axios.create({
	baseURL: `${BASE_URL}/api`,
	headers: {
		'Content-Type': 'application/json',
	},
	withCredentials: true,
});

export const refreshClient = axios.create({
	baseURL: `${BASE_URL}/api`,
	withCredentials: true,
	headers: {
		'Content-Type': 'application/json',
	},
});

// public instance
export const publicInstance = axios.create({
	baseURL: `${BASE_URL}/api`,
	withCredentials: true,
	headers: {
		'Content-Type': 'application/json',
	},
});

// private instance
export const privateInstance = axios.create({
	baseURL: `${BASE_URL}/api`,
	withCredentials: true,
	headers: {
		'Content-Type': 'application/json',
	},
});
