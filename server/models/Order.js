module.exports = (sequelize, DataTypes) => {
    return sequelize.define('Order', {
        order_code: DataTypes.STRING,
        customer_id: DataTypes.INTEGER,
        product_service: DataTypes.STRING,
        total_value: DataTypes.DECIMAL,
        status: DataTypes.STRING
    }, { tableName: 'orders', timestamps: true, updatedAt: false, createdAt: 'created_at' });
};