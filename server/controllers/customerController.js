const { Customer, Order } = require('../models');

// 1. Get All
exports.getAll = async (req, res) => {
    try {
        const list = await Customer.findAll({
            order: [['created_at', 'DESC']]
        });
        res.json(list);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// 2. Create
exports.create = async (req, res) => {
    try {
        const { name, phone, email, notes, user_id } = req.body;
        const newCustomer = await Customer.create({ name, phone, email, notes, user_id });
        res.json(newCustomer);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// 3. Update
exports.update = async (req, res) => {
    try {
        const { id } = req.params;
        const [updated] = await Customer.update(req.body, { where: { id } });
        if (updated) {
            const updatedCustomer = await Customer.findByPk(id);
            return res.json(updatedCustomer);
        }
        throw new Error("Customer not found");
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// 4. Delete
exports.delete = async (req, res) => {
    try {
        const { id } = req.params;

        // Check if customer has orders before deleting
        const hasOrders = await Order.findOne({ where: { customer_id: id } });
        if (hasOrders) {
            return res.status(400).json({ message: "Cannot delete: Customer has existing orders." });
        }

        const deleted = await Customer.destroy({ where: { id } });
        if (deleted) {
            return res.json({ message: "Customer deleted" });
        }
        throw new Error("Customer not found");
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};