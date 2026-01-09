require('dotenv').config();

module.exports = {
    development: {
        username: process.env.DB_USER || "postgres",
        password: process.env.DB_PASSWORD || "your_password",
        database: process.env.DB_NAME || "oms_db",
        host: process.env.DB_HOST || "127.0.0.1",
        port: process.env.DB_PORT || 5433,
        dialect: "postgres"
    }
};