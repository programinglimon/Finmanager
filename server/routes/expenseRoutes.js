const express = require('express');
const router = express.Router();
const FinancialLog = require('../models/FinancialLog');

router.get('/', async (req, res) => {
    try {
        const { range } = req.query; // 'daily', 'weekly', 'monthly', 'yearly'

        let startDate = new Date();
        startDate.setHours(0, 0, 0, 0);

        if (range === 'weekly') {
            startDate.setDate(startDate.getDate() - 7);
        } else if (range === 'monthly') {
            startDate.setDate(1); // Start of this month
        } else if (range === 'yearly') {
            startDate.setMonth(0, 1); // Start of this year
        }

        const query = {
            type: 'EXPENSE',
            date: { $gte: startDate }
        };

        const expenses = await FinancialLog.find(query).sort({ date: -1 });

        const totalExpense = expenses.reduce((sum, item) => sum + item.amount, 0);

        res.json({
            total: totalExpense,
            history: expenses
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
