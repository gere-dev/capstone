import { DataTypes, Model, Sequelize } from 'sequelize';
import type { InferAttributes, InferCreationAttributes, CreationOptional } from 'sequelize';

export class Product extends Model<InferAttributes<Product>, InferCreationAttributes<Product>> {
	declare id: CreationOptional<string>;
	declare name: string;
	declare userId: string;
	declare description: CreationOptional<string | null>;
	declare sku: string;
	declare price: number;
	declare quantity: number;
	declare categoryId: string | null;

	declare createdAt: CreationOptional<Date>;
	declare updatedAt: CreationOptional<Date>;

	static initModel(sequelize: Sequelize) {
		return Product.init(
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
				userId: {
					type: DataTypes.UUID,
					allowNull: false,
					references: {
						model: 'users',
						key: 'id',
					},
					onUpdate: 'CASCADE',
					onDelete: 'CASCADE',
				},
				description: {
					type: DataTypes.TEXT,
					allowNull: true,
				},
				sku: {
					type: DataTypes.STRING,
					allowNull: false,
					unique: true,
					validate: {
						notEmpty: true,
						len: [3, 50],
					},
				},
				price: {
					type: DataTypes.DECIMAL(10, 2),
					allowNull: false,
					get() {
						const value = this.getDataValue('price');
						return value ? parseFloat(value.toString()) : 0;
					},
					validate: {
						isDecimal: true,
						min: 0,
					},
				},
				quantity: {
					type: DataTypes.INTEGER,
					allowNull: false,
					defaultValue: 0,
					validate: {
						isInt: true,
						min: 0,
					},
				},
				categoryId: {
					type: DataTypes.UUID,
					allowNull: true,
					references: {
						model: 'categories',
						key: 'id',
					},
					onUpdate: 'CASCADE',
					onDelete: 'SET NULL',
				},
				createdAt: DataTypes.DATE,
				updatedAt: DataTypes.DATE,
			},
			{
				sequelize,
				tableName: 'products',
				underscored: true,
				indexes: [{ fields: ['sku'], unique: true }, { fields: ['name'] }, { fields: ['category_id'] }],
			},
		);
	}
}
