const express = require('express');
const router = express.Router();
const FinancialLog = require('../models/FinancialLog');

router.get('/dashboard', async (req, res) => {
    try {
        const endDate = new Date();
        const startOfDay = new Date(endDate); startOfDay.setHours(0, 0, 0, 0);
        const startOfWeek = new Date(endDate); startOfWeek.setDate(endDate.getDate() - 7);
        const startOfMonth = new Date(endDate); startOfMonth.setMonth(endDate.getMonth() - 1);
        const startOfYear = new Date(endDate); startOfYear.setFullYear(endDate.getFullYear() - 1);

        const logs = await FinancialLog.find({ date: { $gte: startOfYear } });

        const calculateStats = (logs) => {
            const stats = {
                totalSales: 0,
                totalProfit: 0,
                totalDueGiven: 0,
                totalDepositReceived: 0
            };
            logs.forEach(log => {
                if (log.type === 'SALE') stats.totalSales += log.amount;
                if (log.type === 'PROFIT') stats.totalProfit += log.amount;
                if (log.type === 'DUE_GIVEN') stats.totalDueGiven += log.amount;
                if (log.type === 'DEPOSIT_RECEIVED') stats.totalDepositReceived += log.amount;
            });
            return stats;
        };

        const dailyLogs = logs.filter(l => new Date(l.date) >= startOfDay);
        const weeklyLogs = logs.filter(l => new Date(l.date) >= startOfWeek);
        const monthlyLogs = logs.filter(l => new Date(l.date) >= startOfMonth);
        const yearlyLogs = logs; // Already filtered by startOfYear

        res.json({
            daily: calculateStats(dailyLogs),
            weekly: calculateStats(weeklyLogs),
            monthly: calculateStats(monthlyLogs),
            yearly: calculateStats(yearlyLogs)
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
