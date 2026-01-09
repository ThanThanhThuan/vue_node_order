module.exports = (sequelize, DataTypes) => {
    return sequelize.define('User', {
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        role: {
            type: DataTypes.STRING,
            defaultValue: 'ADMIN'
        }
    }, {
        tableName: 'users',
        timestamps: true,
        updatedAt: false,
        createdAt: 'created_at'
    });
};