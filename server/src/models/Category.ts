import { DataTypes, Model, Sequelize } from 'sequelize';
import type { InferAttributes, InferCreationAttributes, CreationOptional } from 'sequelize';

export class Category extends Model<InferAttributes<Category>, InferCreationAttributes<Category>> {
	declare id: CreationOptional<string>;
	declare name: string;
	declare userId: string;

	declare description: CreationOptional<string | null>;

	declare createdAt: CreationOptional<Date>;
	declare updatedAt: CreationOptional<Date>;

	static initModel(sequelize: Sequelize) {
		return Category.init(
			{
				id: {
					type: DataTypes.UUID,
					defaultValue: DataTypes.UUIDV4,
					primaryKey: true,
				},
				name: {
					type: DataTypes.STRING,
					allowNull: false,
				},
				userId: {
					type: DataTypes.UUID,
					allowNull: false,
					references: {
						model: 'users',
						key: 'id',
					},
				},
				description: {
					type: DataTypes.TEXT,
					allowNull: true,
				},
				createdAt: DataTypes.DATE,
				updatedAt: DataTypes.DATE,
			},
			{
				sequelize,
				tableName: 'categories',
				underscored: true,
			},
		);
	}
}
