import { DataTypes, Model, Sequelize } from 'sequelize';
import type { InferAttributes, InferCreationAttributes, CreationOptional } from 'sequelize';
import { EOrder } from '../enums/order.enum.js';

export class Order extends Model<InferAttributes<Order>, InferCreationAttributes<Order>> {
	declare id: CreationOptional<string>;
	declare name: string;
	declare phone: string | null;
	declare address: string;
	declare purchaseDate: Date;
	declare productName: string;
	declare productId: string | null;
	declare quantity: number;
	declare productPrice: number;
	declare sku: string;
	declare status: EOrder;
	declare userId: string;

	declare createdAt: CreationOptional<Date>;
	declare updatedAt: CreationOptional<Date>;

	static initModel(sequelize: Sequelize) {
		return Order.init(
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
					validate: { notEmpty: true, len: [1, 100] },
				},
				phone: {
					type: DataTypes.STRING,
					allowNull: true,
					validate: { len: [1, 20] },
				},
				address: {
					type: DataTypes.STRING,
					allowNull: false,
					validate: { notEmpty: true, len: [1, 500] },
				},
				purchaseDate: {
					type: DataTypes.DATE,
					allowNull: false,
				},
				productName: {
					type: DataTypes.STRING,
					allowNull: false,
				},
				productId: {
					type: DataTypes.UUID,
					allowNull: true,
					references: {
						model: 'products',
						key: 'id',
					},
					onUpdate: 'CASCADE',
					onDelete: 'SET NULL',
				},
				quantity: {
					type: DataTypes.INTEGER,
					allowNull: false,
					validate: { min: 0 },
				},
				productPrice: {
					type: DataTypes.DECIMAL(10, 2),
					allowNull: false,
					get() {
						const value = this.getDataValue('productPrice');
						return value ? parseFloat(value.toString()) : 0;
					},
				},
				sku: {
					type: DataTypes.STRING,
					allowNull: false,
				},
				status: {
					type: DataTypes.ENUM(...Object.values(EOrder)),
					allowNull: false,
					defaultValue: EOrder.pending,
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
				createdAt: DataTypes.DATE,
				updatedAt: DataTypes.DATE,
			},
			{
				sequelize,
				tableName: 'orders',
				underscored: true,
			},
		);
	}
}
