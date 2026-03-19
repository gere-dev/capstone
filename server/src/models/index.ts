import { sequelize } from '../database/db.js';
import { Product } from './Product.js';
import { User } from './User.js';
import { Category } from './Category.js';
import { Order } from './Order.js';
import { Supplier } from './Supplier.js';

// Initialize models

User.initModel(sequelize);
Product.initModel(sequelize);
Order.initModel(sequelize);
Category.initModel(sequelize);
Supplier.initModel(sequelize);

// Associations
User.hasMany(Product, {
	foreignKey: 'userId',
	sourceKey: 'id',
});
Product.belongsTo(User, {
	foreignKey: 'userId',
});

User.hasMany(Category, {
	foreignKey: 'userId',
	sourceKey: 'id',
});

Category.belongsTo(User, {
	foreignKey: 'userId',
});

Category.hasMany(Product, {
	foreignKey: 'categoryId',
});

Product.belongsTo(Category, {
	foreignKey: 'categoryId',
});

User.hasMany(Order, {
	foreignKey: 'userId',
	sourceKey: 'id',
});
Order.belongsTo(User, {
	foreignKey: 'userId',
});

Product.hasMany(Order, {
	foreignKey: 'productId',
	sourceKey: 'id',
	onDelete: 'SET NULL',
});

Order.belongsTo(Product, {
	foreignKey: 'productId',
});

User.hasMany(Supplier, {
	foreignKey: 'userId',
	sourceKey: 'id',
});
Supplier.belongsTo(User, {
	foreignKey: 'userId',
});

export { User, Product, Category, Order, Supplier };
