import { DataTypes, type Model, type Sequelize } from 'sequelize';
import type { TOrderBase } from '../schema/order.schema.js';

export interface OrderAttributes extends TOrderBase {
	id: string;
	userId: string;
	createdAt: Date;
	updatedAt?: Date;
}

interface OrderCreationAttributes extends Omit<OrderAttributes, 'id'> {}

export interface OrderInstance extends Model<OrderAttributes, OrderCreationAttributes>, OrderAttributes {}

const Order = (sequelize: Sequelize) => {
	const OrderModel = sequelize.define<OrderInstance>(
		'Order',
		{
			id: {
				type: DataTypes.UUID,
				defaultValue: DataTypes.UUIDV4,
				primaryKey: true,
				unique: true,
				allowNull: false,
			},
			name: {
				type: DataTypes.STRING,
				allowNull: false,
				validate: {
					notEmpty: true,
					len: [1, 100],
				},
			},
			phone: {
				type: DataTypes.STRING,
				allowNull: true,
				validate: {
					len: [1, 20],
				},
			},
			address: {
				type: DataTypes.STRING,
				allowNull: false,
				validate: {
					notEmpty: true,
					len: [1, 500],
				},
			},
			purchaseDate: {
				type: DataTypes.DATE,
				allowNull: false,
				validate: {
					isDate: true,
				},
			},
			productName: {
				type: DataTypes.STRING,
				allowNull: false,
				validate: {
					notEmpty: true,
					len: [1, 255],
				},
			},
			productId: {
				type: DataTypes.UUID,
				allowNull: false,
				references: {
					model: 'products',
					key: 'id',
				},
			},

			quantity: {
				type: DataTypes.INTEGER,
				allowNull: false,
				validate: {
					isInt: true,
					min: 0,
				},
			},

			productPrice: {
				type: DataTypes.DECIMAL(10, 2),
				allowNull: false,
				validate: {
					isDecimal: true,
					min: 0,
				},
			},
			sku: {
				type: DataTypes.STRING,
				allowNull: false,
				validate: {
					notEmpty: true,
					len: [3, 50],
				},
			},
			status: {
				type: DataTypes.ENUM('Processing', 'Shipped', 'Delivered', 'Cancelled', 'Returned'),
				allowNull: false,
				defaultValue: 'Processing',
			},
			userId: {
				type: DataTypes.UUID,
				allowNull: false,
				references: {
					model: 'users',
					key: 'id',
				},
			},
			createdAt: {
				type: DataTypes.DATE,
				allowNull: false,
				defaultValue: DataTypes.NOW,
			},
			updatedAt: {
				type: DataTypes.DATE,
				allowNull: true,
				defaultValue: DataTypes.NOW,
			},
		},
		{
			timestamps: true,
			createdAt: 'createdAt',
			updatedAt: 'updatedAt',
			underscored: true,
		},
	);
	return OrderModel;
};

export default Order;
