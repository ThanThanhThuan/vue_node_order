module.exports = (sequelize, DataTypes) => {
    return sequelize.define('Customer', {
        name: DataTypes.STRING,
        phone: DataTypes.STRING,
        email: DataTypes.STRING,
        notes: DataTypes.TEXT,
        user_id: DataTypes.INTEGER // <--- Add this line
    }, {
        tableName: 'customers',
        timestamps: true,
        updatedAt: false,
        createdAt: 'created_at'
    });
};