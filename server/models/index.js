const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const env = process.env.NODE_ENV || 'development';
// Ensure config/database.js exists!
const config = require('../config/database')[env];
const db = {};

let sequelize;
if (config.use_env_variable) {
    sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
    sequelize = new Sequelize(config.database, config.username, config.password, config);
}

// 1. Dynamically load all model files in this folder
fs
    .readdirSync(__dirname)
    .filter(file => {
        return (file.indexOf('.') !== 0) && (file !== 'index.js') && (file.slice(-3) === '.js');
    })
    .forEach(file => {
        const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
        db[model.name] = model;
    });

// 2. Define Associations
const { Customer, Order, Product, OrderItem, User } = db;

if (Customer && Order) {
    Customer.hasMany(Order, { foreignKey: 'customer_id' });
    Order.belongsTo(Customer, { foreignKey: 'customer_id' });
}

if (Order && OrderItem && Product) {
    // Order has many Items
    Order.hasMany(OrderItem, { foreignKey: 'order_id' });
    OrderItem.belongsTo(Order, { foreignKey: 'order_id' });

    // Item belongs to a Product
    OrderItem.belongsTo(Product, { foreignKey: 'product_id' });
}

if (User && Customer) {
    User.hasOne(Customer, { foreignKey: 'user_id' });
    Customer.belongsTo(User, { foreignKey: 'user_id' });
}

// 3. Export the connection
db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;