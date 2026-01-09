const express = require('express');
const router = express.Router();
const controller = require('../controllers/orderController');

// 1. Link routes to the Controller functions
router.get('/', controller.getOrders);
router.post('/', controller.createOrder); // <--- Pointing to Controller (Logic is here)
router.get('/stats', controller.getDashboardStats);
router.delete('/:id', controller.deleteOrder);

// 2. Update Status (Keep this simple update logic here or move to controller)
const { Order } = require('../models');
router.put('/:id', async (req, res) => {
    try {
        await Order.update(req.body, { where: { id: req.params.id } });
        res.json({ message: "Updated" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.put('/:id0', async (req, res) => {
    try {
        // Update only the status field
        await Order.update(
            { status: req.body.status },
            { where: { id: req.params.id0 } }
        );
        res.json({ message: "Status updated successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;