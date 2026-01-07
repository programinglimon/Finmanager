const express = require('express');
const router = express.Router();
const FinancialLog = require('../models/FinancialLog');

router.get('/report', async (req, res) => {
    try {
        const { range } = req.query; // 'daily', 'weekly', 'monthly', 'yearly'

        let startDate = new Date();
        startDate.setHours(0, 0, 0, 0);

        if (range === 'daily') {
            // Defaults to today
        } else if (range === 'weekly') {
            startDate.setDate(startDate.getDate() - 7);
        } else if (range === 'monthly') {
            startDate.setMonth(startDate.getMonth() - 1);
        } else if (range === 'yearly') {
            startDate.setFullYear(startDate.getFullYear() - 1);
        } else {
            startDate = new Date(0); // All time
        }

        const records = await FinancialLog.find({
            type: 'PROFIT',
            date: { $gte: startDate }
        }).sort({ date: -1 });

        // Aggregate by Source
        const stats = {
            total: 0,
            sim: 0,
            inventory: 0,
            account: 0,
            other: 0,
            history: records
        };

        records.forEach(r => {
            stats.total += r.amount;
            if (r.source === 'SIM') stats.sim += r.amount;
            else if (r.source === 'INVENTORY') stats.inventory += r.amount;
            else if (r.source === 'ACCOUNT') stats.account += r.amount;
            else stats.other += r.amount;
        });

        res.json(stats);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
