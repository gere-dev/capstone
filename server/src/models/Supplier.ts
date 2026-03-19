import { DataTypes, Model, Sequelize } from 'sequelize';
import type { InferAttributes, InferCreationAttributes, CreationOptional } from 'sequelize';

export class Supplier extends Model<InferAttributes<Supplier>, InferCreationAttributes<Supplier>> {
	declare id: CreationOptional<string>;
	declare name: string;
	declare userId: string;
	declare contact: string;
	declare address: CreationOptional<string | null>;

	// Timestamps
	declare createdAt: CreationOptional<Date>;
	declare updatedAt: CreationOptional<Date>;

	static initModel(sequelize: Sequelize) {
		return Supplier.init(
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
						len: [1, 50],
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
				contact: {
					type: DataTypes.STRING,
					allowNull: false,
					validate: { notEmpty: true },
				},
				address: {
					type: DataTypes.STRING,
					allowNull: true,
				},
				createdAt: DataTypes.DATE,
				updatedAt: DataTypes.DATE,
			},
			{
				sequelize,
				tableName: 'suppliers',
				underscored: true,
			},
		);
	}
}
