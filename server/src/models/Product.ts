import { DataTypes, Model, Sequelize } from 'sequelize';
import type { TProductBase } from '../schema/product.schema.js';

export interface ProductAttributes extends TProductBase {
	id: string;
	userId: string;
	createdAt?: Date;
	updatedAt?: Date;
}

interface ProductCreationAttributes extends Omit<ProductAttributes, 'id'> {}

export interface ProductInstance extends Model<ProductAttributes, ProductCreationAttributes>, ProductAttributes {}

const Product = (sequelize: Sequelize) => {
	const ProductModel = sequelize.define<ProductInstance>(
		'Product',
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
				references: {
					model: 'users',
					key: 'id',
				},
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
			},
		},
		{
			timestamps: true,
			tableName: 'products',
			underscored: true,
			indexes: [
				{
					fields: ['sku'],
					unique: true,
				},
				{
					fields: ['name'],
				},
				{
					fields: ['category_id'],
				},
			],
		},
	);

	return ProductModel;
};

export default Product;
