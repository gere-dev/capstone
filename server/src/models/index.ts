import { sequelize } from '../database/db.js';
import Product from './Product.js';
import User from './User.js';
import Category from './Category.js';
import Order from './Order.js';

// Initialize models
const UserModel = User(sequelize);
const ProductModel = Product(sequelize);
const CategoryModel = Category(sequelize);
const OrderModel = Order(sequelize);

// Associations
UserModel.hasMany(ProductModel, {
	foreignKey: 'userId',
	sourceKey: 'id',
});
ProductModel.belongsTo(UserModel, {
	foreignKey: 'userId',
});

UserModel.hasMany(CategoryModel, {
	foreignKey: 'userId',
	sourceKey: 'id',
});

CategoryModel.belongsTo(UserModel, {
	foreignKey: 'userId',
});

CategoryModel.hasMany(ProductModel, {
	foreignKey: 'categoryId',
});

ProductModel.belongsTo(CategoryModel, {
	foreignKey: 'categoryId',
});

UserModel.hasMany(OrderModel, {
	foreignKey: 'userId',
	sourceKey: 'id',
});
OrderModel.belongsTo(UserModel, {
	foreignKey: 'userId',
});

ProductModel.hasMany(OrderModel, {
	foreignKey: 'productId',
	sourceKey: 'id',
});

OrderModel.belongsTo(ProductModel, {
	foreignKey: 'productId',
});

OrderModel.belongsTo(ProductModel, { foreignKey: 'productId' });

export { UserModel, ProductModel, CategoryModel, OrderModel };
