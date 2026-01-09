const express = require('express');
const router = express.Router();
const { Product } = require('../models');

// Get All
router.get('/', async (req, res) => {
    const list = await Product.findAll();
    res.json(list);
});

// Create
router.post('/', async (req, res) => {
    try {
        const prod = await Product.create(req.body);
        res.json(prod);
    } catch (e) { res.status(500).json({ error: e.message }); }
});

module.exports = router;