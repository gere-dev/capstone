import { UserModel } from '../models/index.js';
import type { UserAttributes } from '../models/User.js';
interface IRegister {
	name: string;
	email: string;
	password: string;
}
const register = async (userData: IRegister): Promise<UserAttributes> => {
	try {
		const newUser = (await UserModel.create(userData)).get({ plain: true });

		return newUser;
	} catch (err: any) {
		console.error('[Register Repository] Error: ', err);

		if (err.name === 'SequelizeUniqueConstraintError') {
			throw new Error('Email already exists');
		} else {
			throw new Error('Error registering user');
		}
	}
};

interface ILogin {
	email: string;
	password: string;
}
const login = async (userData: ILogin): Promise<UserAttributes | undefined> => {
	try {
		const user = (
			await UserModel.findOne({
				where: {
					email: userData.email,
				},
			})
		)?.get({ plain: true });

		return user;
	} catch (err) {
		console.error('Login Repository] Error: ', err);
		throw new Error('Error logging in user');
	}
};

const getUserById = async (id: string): Promise<UserAttributes | undefined> => {
	try {
		const user = await UserModel.findByPk(id);
		return user?.get({ plain: true });
	} catch (err) {
		console.log('[Auth Repository] Error:', err);
	}
};

const getUserByEmail = async (email: string): Promise<UserAttributes | undefined> => {
	const user = await UserModel.findOne({ where: { email } });
	return user?.get({ plain: true });
};

export const authRepository = {
	register,
	login,
	getUserById,
	getUserByEmail,
};
