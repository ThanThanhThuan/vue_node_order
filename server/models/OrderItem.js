module.exports = (sequelize, DataTypes) => {
    return sequelize.define('OrderItem', {
        order_id: DataTypes.INTEGER,
        product_id: DataTypes.INTEGER,
        quantity: DataTypes.INTEGER,
        unit_price: DataTypes.DECIMAL
    }, { tableName: 'order_items', timestamps: true, updatedAt: false, createdAt: 'created_at' });
};