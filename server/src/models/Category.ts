import { DataTypes, Model, Sequelize } from 'sequelize';
import type { TCategoryBase } from '../schema/index.js';

interface CategoryAttributes extends TCategoryBase {
	id: string;
	userId: string;
	createdAt?: Date;
	updatedAt?: Date;
}

interface CategoryCreationAttributes extends Omit<CategoryAttributes, 'id'> {}

export interface CategoryInstance extends Model<CategoryAttributes, CategoryCreationAttributes>, CategoryAttributes {}

const Category = (sequelize: Sequelize) => {
	const CategoryModel = sequelize.define<CategoryInstance>(
		'Category',
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
					len: [2, 50],
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
		},
		{
			timestamps: true,
			tableName: 'categories',
			underscored: true,
		},
	);

	return CategoryModel;
};

export default Category;
