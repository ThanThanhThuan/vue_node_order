module.exports = (sequelize, DataTypes) => {
    return sequelize.define('Product', {
        name: DataTypes.STRING,
        sku: DataTypes.STRING,
        price: DataTypes.DECIMAL,
        stock: DataTypes.INTEGER
    }, { tableName: 'products', timestamps: true, updatedAt: false, createdAt: 'created_at' });
};