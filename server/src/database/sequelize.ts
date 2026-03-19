import { sequelize } from './db.js';

export const connectToDatabase = async () => {
	try {
		await sequelize.authenticate();
		console.log('Connection has been established successfully.');

		// const { UserModel, ProductModel, CategoryModel } = await import('../models/index.js');

		// console.log('Models:', Object.keys(sequelize.models));
		await sequelize.sync({ force: false, alter: true });
		console.log('All models were synchronized successfully.');
	} catch (error) {
		console.error('Error occurred while connecting to database:', (error as Error).message);
		process.exit(1);
	}
};
