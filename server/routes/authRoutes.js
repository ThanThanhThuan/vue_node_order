const express = require('express');
const router = express.Router();
const { User } = require('../models');

// Simple Login (Check if email exists)
router.post('/login', async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ where: { email } });
        if (!user) return res.status(404).json({ message: "User not found" });

        res.json({ message: "Login success", user });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;