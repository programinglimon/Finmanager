const express = require('express');
const router = express.Router();
const Item = require('../models/Item');

// @route   POST /api/items
// @desc    Create a new item
router.post('/', async (req, res) => {
    try {
        const newItem = new Item({
            name: req.body.name,
            description: req.body.description,
        });
        const savedItem = await newItem.save();
        res.json(savedItem);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// @route   GET /api/items
// @desc    Get all items
router.get('/', async (req, res) => {
    try {
        const items = await Item.find().sort({ createdAt: -1 });
        res.json(items);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// @route   PUT /api/items/:id
// @desc    Update an item
router.put('/:id', async (req, res) => {
    try {
        const updatedItem = await Item.findByIdAndUpdate(
            req.params.id,
            {
                name: req.body.name,
                description: req.body.description,
            },
            { new: true } // Return the updated document
        );
        res.json(updatedItem);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// @route   DELETE /api/items/:id
// @desc    Delete an item
router.delete('/:id', async (req, res) => {
    try {
        const item = await Item.findById(req.params.id);
        if (!item) return res.status(404).json({ message: 'Item not found' });

        await item.deleteOne();
        res.json({ message: 'Item deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
