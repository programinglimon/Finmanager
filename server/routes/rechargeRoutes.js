const express = require('express');
const router = express.Router();
const RechargeSim = require('../models/RechargeSim');
const Inventory = require('../models/Inventory');

// === Recharge SIM Routes ===

// Get all SIMs
router.get('/sims', async (req, res) => {
    try {
        const sims = await RechargeSim.find().sort({ createdAt: -1 });
        res.json(sims);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Create SIM
router.post('/sims', async (req, res) => {
    try {
        const newSim = new RechargeSim(req.body);
        const savedSim = await newSim.save();
        res.json(savedSim);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Update SIM (Balance or Info)
router.put('/sims/:id', async (req, res) => {
    try {
        const updatedSim = await RechargeSim.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        res.json(updatedSim);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Transaction Endpoint (Add Balance / Daily Update)
router.post('/sims/:id/transaction', async (req, res) => {
    try {
        const { action, amount, newBalance } = req.body;
        const sim = await RechargeSim.findById(req.params.id);
        if (!sim) return res.status(404).json({ message: 'SIM not found' });

        if (action === 'ADD_BALANCE') {
            sim.balance += Number(amount);
        } else if (action === 'DAILY_UPDATE') {
            // Logic: Sell = Current - New Balance
            // Profit = (Sell / 1000) * Commission
            const currentBalance = sim.balance;
            const updatedBalance = Number(newBalance);
            const sellAmount = currentBalance - updatedBalance;

            if (sellAmount > 0) {
                const profit = (sellAmount / 1000) * sim.commission;
                sim.dailyProfit += profit;

                // Log Financial Records
                const FinancialLog = require('../models/FinancialLog');

                // 1. Log Sale (Load Amount)
                await new FinancialLog({
                    type: 'SALE',
                    amount: sellAmount,
                    source: 'SIM',
                    description: `Recharge Sale: ${sellAmount}`
                }).save();

                // 2. Log Profit
                await new FinancialLog({
                    type: 'PROFIT',
                    amount: profit,
                    source: 'SIM',
                    description: `Commission from ${sellAmount}`
                }).save();
            }
            sim.balance = updatedBalance;
        }

        const updatedSim = await sim.save();
        res.json(updatedSim);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Delete SIM
router.delete('/sims/:id', async (req, res) => {
    try {
        await RechargeSim.findByIdAndDelete(req.params.id);
        res.json({ message: 'SIM deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// === Inventory Routes ===

// Get all Inventory items
router.get('/inventory', async (req, res) => {
    try {
        const items = await Inventory.find().sort({ createdAt: -1 });
        res.json(items);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Create Inventory Item
router.post('/inventory', async (req, res) => {
    try {
        const newItem = new Inventory(req.body);
        const savedItem = await newItem.save();
        res.json(savedItem);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Update Inventory Item
router.put('/inventory/:id', async (req, res) => {
    try {
        const updatedItem = await Inventory.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        res.json(updatedItem);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Inventory Transaction Endpoint (Add Stock / Daily Update)
router.post('/inventory/:id/transaction', async (req, res) => {
    try {
        const { action, quantity, newQuantity } = req.body;
        const item = await Inventory.findById(req.params.id);
        if (!item) return res.status(404).json({ message: 'Item not found' });

        if (action === 'ADD_STOCK') {
            item.quantity += Number(quantity);
        } else if (action === 'DAILY_UPDATE') {
            // Logic: Sold = Current - New Quantity
            // Profit = Sold * (Sell - Buy)
            const currentQuantity = item.quantity;
            const updatedQuantity = Number(newQuantity);
            const soldQuantity = currentQuantity - updatedQuantity;

            if (soldQuantity > 0) {
                const profit = soldQuantity * (item.sellPrice - item.buyPrice);
                item.dailyProfit += profit;

                // Log Sales and Profit
                const FinancialLog = require('../models/FinancialLog');

                await new FinancialLog({
                    type: 'SALE',
                    amount: soldQuantity * item.sellPrice,
                    source: 'INVENTORY',
                    description: `Sold ${soldQuantity} x ${item.name}`
                }).save();

                await new FinancialLog({
                    type: 'PROFIT',
                    amount: profit,
                    source: 'INVENTORY',
                    description: `Profit from ${item.name}`
                }).save();
            }
            item.quantity = updatedQuantity;
        }

        const updatedItem = await item.save();
        res.json(updatedItem);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Delete Inventory Item
router.delete('/inventory/:id', async (req, res) => {
    try {
        await Inventory.findByIdAndDelete(req.params.id);
        res.json({ message: 'Item deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
