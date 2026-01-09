const { Order, Customer, OrderItem, Product } = require('../models');
const { Op } = require('sequelize');

// 1. Get Orders (Updated to include Items and Products)
exports.getOrders0 = async (req, res) => {
    try {
        const { status, customer_id, startDate, endDate } = req.query;
        const where = {};

        if (status) where.status = status;
        if (customer_id) where.customer_id = customer_id;

        // Optional: Date Filter
        if (startDate && endDate) {
            where.created_at = { [Op.between]: [new Date(startDate), new Date(endDate)] };
        }

        const orders = await Order.findAll({
            where,
            include: [
                { model: Customer, attributes: ['name', 'phone'] },
                {
                    model: OrderItem,
                    include: [{ model: Product, attributes: ['name', 'sku'] }]
                }
            ],
            order: [['created_at', 'DESC']]
        });
        res.json(orders);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.createOrder = async (req, res) => {
    try {
        const { order_code, customer_id, items } = req.body;

        // 1. Calculate Total Value LOCALLY
        let calculated_total = 0;
        if (items && items.length > 0) {
            items.forEach(item => {
                calculated_total += (Number(item.quantity) * Number(item.unit_price));
            });
        }

        // 2. Create Order using the CALCULATED total
        const newOrder = await Order.create({
            order_code,
            customer_id,
            product_service: 'Multi-Item Order',
            total_value: calculated_total, // <--- FIX: Use the calculated variable
            status: 'NEW'
        });

        // 3. Create Items
        if (items && items.length > 0) {
            const orderItemsData = items.map(item => ({
                order_id: newOrder.id,
                product_id: item.product_id,
                quantity: item.quantity,
                unit_price: item.unit_price
            }));
            await OrderItem.bulkCreate(orderItemsData);
        }

        res.json({ message: "Order created", order: newOrder });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
};
// 2. Create Multi-Item Order
exports.createOrder0 = async (req, res) => {
    try {
        const { order_code, customer_id, items } = req.body;
        // --- DEBUG LOGS (Check your VSCode Terminal when you click Create) ---
        console.log("1. Received Items:", JSON.stringify(items, null, 2));

        // Check if OrderItem model exists
        if (!OrderItem) {
            console.error("CRITICAL ERROR: OrderItem model is UNDEFINED. Check server/models/OrderItem.js");
            return res.status(500).json({ error: "Server Error: OrderItem model missing" });
        }
        // --------------------------------------------------------------------

        // 1. Calculate Total Value from the items array
        let total_value = 0;
        if (items && items.length > 0) {
            items.forEach(item => {
                total_value += (Number(item.quantity) * Number(item.unit_price));
            });
        }

        // 2. Create the Main Order
        // FIX: We explicitly add 'product_service' here to satisfy the DB constraint
        const newOrder = await Order.create({
            order_code,
            customer_id,
            product_service: 'Multi-Item Order', // <--- THIS LINE FIXES YOUR ERROR
            total_value,
            status: 'NEW'
        });

        // 3. Create Order Items (if any)
        if (items && items.length > 0) {
            const orderItemsData = items.map(item => ({
                order_id: newOrder.id,
                product_id: item.product_id,
                quantity: item.quantity,
                unit_price: item.unit_price
            }));

            await OrderItem.bulkCreate(orderItemsData);
        }

        res.json({ message: "Order created", order: newOrder });

    } catch (err) {
        console.error(err); // Log error to terminal for debugging
        res.status(500).json({ error: err.message });
    }
};

// 3. Dashboard Stats (This was likely missing!)
// Helper: Find Customer ID from User ID
const getCustomerIdFromUser = async (userId) => {
    const customer = await Customer.findOne({ where: { user_id: userId } });
    return customer ? customer.id : null;
};

// 1. Get Orders (Updated with Security Filtering)
exports.getOrders = async (req, res) => {
    try {
        const { status, customer_id, startDate, endDate, userId } = req.query; // <--- Added userId
        const where = {};

        // FILTER: If userId is provided (Customer Role), force filter by their ID
        if (userId) {
            const linkedCustId = await getCustomerIdFromUser(userId);
            if (!linkedCustId) return res.json([]); // User has no customer profile linked
            where.customer_id = linkedCustId;
        }
        // ELSE: If Admin provides specific customer_id, use that
        else if (customer_id) {
            where.customer_id = customer_id;
        }

        if (status) where.status = status;

        if (startDate && endDate) {
            where.created_at = { [Op.between]: [new Date(startDate), new Date(endDate)] };
        }

        const orders = await Order.findAll({
            where,
            include: [
                { model: Customer, attributes: ['name', 'phone'] },
                { model: OrderItem, include: [{ model: Product, attributes: ['name', 'sku'] }] }
            ],
            order: [['created_at', 'DESC']]
        });
        res.json(orders);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// 2. Dashboard Stats (Updated)
exports.getDashboardStats = async (req, res) => {
    try {
        const { userId } = req.query; // <--- Added userId
        const where = {};

        if (userId) {
            const linkedCustId = await getCustomerIdFromUser(userId);
            if (!linkedCustId) return res.json({ totalOrders: 0, revenue: 0, statusBreakdown: [] });
            where.customer_id = linkedCustId;
        }

        const totalOrders = await Order.count({ where });
        const revenue = await Order.sum('total_value', { where }) || 0;

        const statusBreakdown = await Order.findAll({
            where,
            attributes: ['status', [Order.sequelize.fn('COUNT', 'id'), 'count']],
            group: ['status']
        });

        res.json({ totalOrders, revenue, statusBreakdown });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// 4. Delete Order
exports.deleteOrder = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await Order.destroy({ where: { id } });
        if (deleted) {
            return res.json({ message: "Order deleted successfully" });
        }
        throw new Error("Order not found");
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};