import { Sequelize } from 'sequelize';

import dotenv from 'dotenv';

dotenv.config();

const host = process.env.HOST as string;
const port = process.env.PORT as string;
const user = process.env.USER_NAME as string;
const password = process.env.PASSWORD as string;

const database = process.env.DATABASE_URL as string;

export const sequelize = new Sequelize(database, {
	dialect: 'postgres',
	logging: false,
	dialectOptions: {
		prependSearchPath: true,
	},
});
