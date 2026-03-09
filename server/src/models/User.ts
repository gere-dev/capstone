import { DataTypes, Model, Sequelize } from 'sequelize';
import { type IUser } from '../types/user.type.js';
export interface UserAttributes extends IUser {
	password: string;
}

interface UserCreationAttributes extends Omit<UserAttributes, 'id'> {
	password: string;
}

export interface UserInstance extends Model<UserAttributes, UserCreationAttributes>, UserAttributes {}

const User = (sequelize: Sequelize) => {
	const UserModel = sequelize.define<UserInstance>(
		'User',
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
		},
		{
			timestamps: true,
			tableName: 'users',
			underscored: true,
		},
	);

	return UserModel;
};

export default User;
