const express = require('express');
const cors = require('cors');
const app = express();
const db = require('./models'); // Loads your database models
require('dotenv').config();

// Middleware
app.use(cors());
app.use(express.json());

// Routes (We will create these files next)
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/customers', require('./routes/customerRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/products', require('./routes/productRoutes'));

// Sync Database and Start Server
db.sequelize.sync().then(() => {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}).catch((err) => {
    console.error("Failed to sync db: " + err.message);
});