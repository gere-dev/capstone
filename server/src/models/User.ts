import { DataTypes, Model, Sequelize } from 'sequelize';
import type { InferAttributes, InferCreationAttributes, CreationOptional } from 'sequelize';

export class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
	declare id: CreationOptional<string>;
	declare name: string;
	declare email: string;
	declare password: string;

	// Timestamps
	declare createdAt: CreationOptional<Date>;
	declare updatedAt: CreationOptional<Date>;

	static initModel(sequelize: Sequelize) {
		return User.init(
			{
				id: {
					type: DataTypes.UUID,
					defaultValue: DataTypes.UUIDV4,
					primaryKey: true,
					allowNull: false,
				},
				name: {
					type: DataTypes.STRING,
					allowNull: false,
					validate: {
						notEmpty: true,
						len: [2, 100],
					},
				},
				email: {
					type: DataTypes.STRING,
					allowNull: false,
					unique: true,
					validate: {
						isEmail: true,
						notEmpty: true,
						len: [6, 100],
					},
				},
				password: {
					type: DataTypes.STRING,
					allowNull: false,
					validate: {
						notEmpty: true,
						len: [6, 100],
					},
				},
				createdAt: DataTypes.DATE,
				updatedAt: DataTypes.DATE,
			},
			{
				sequelize,
				tableName: 'users',
				underscored: true,
			},
		);
	}
}
