const express = require('express');
const router = express.Router();
const Due = require('../models/Due');

// Get all items (Due & Deposit)
router.get('/', async (req, res) => {
    try {
        const items = await Due.find().sort({ createdAt: -1 });
        res.json(items);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Create new item
router.post('/', async (req, res) => {
    try {
        const newItem = new Due(req.body);
        const savedItem = await newItem.save();
        res.json(savedItem);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Update item
router.put('/:id', async (req, res) => {
    try {
        const updatedItem = await Due.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        res.json(updatedItem);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Delete item
router.delete('/:id', async (req, res) => {
    try {
        await Due.findByIdAndDelete(req.params.id);
        res.json({ message: 'Item deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
