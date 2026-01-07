const express = require('express');
const router = express.Router();
const Account = require('../models/Account');

// @route   GET /api/accounts/summary
// @desc    Get aggregated stats for Personal and Agent accounts
router.get('/summary', async (req, res) => {
    try {
        const summary = await Account.aggregate([
            {
                $group: {
                    _id: '$type',
                    totalBalance: { $sum: '$balance' },
                    totalDailyProfit: { $sum: '$dailyProfit' },
                },
            },
        ]);

        const result = {
            Personal: { totalBalance: 0, totalDailyProfit: 0 },
            Agent: { totalBalance: 0, totalDailyProfit: 0 },
        };

        summary.forEach(item => {
            if (result[item._id]) {
                result[item._id] = {
                    totalBalance: item.totalBalance,
                    totalDailyProfit: item.totalDailyProfit,
                };
            }
        });

        res.json(result);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// @route   GET /api/accounts
// @desc    Get accounts, optionally filtered by type
router.get('/', async (req, res) => {
    try {
        const { type } = req.query;
        const query = type ? { type } : {};
        const accounts = await Account.find(query).sort({ createdAt: -1 });
        res.json(accounts);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// @route   POST /api/accounts
// @desc    Create a new account
router.post('/', async (req, res) => {
    try {
        const newAccount = new Account(req.body);
        const savedAccount = await newAccount.save();
        res.json(savedAccount);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// @route   PUT /api/accounts/:id
// @desc    Update an account
router.put('/:id', async (req, res) => {
    try {
        const updatedAccount = await Account.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        res.json(updatedAccount);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// @route   DELETE /api/accounts/:id
// @desc    Delete an account
router.delete('/:id', async (req, res) => {
    try {
        await Account.findByIdAndDelete(req.params.id);
        res.json({ message: 'Account deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// @route   POST /api/accounts/:id/transaction
// @desc    Handle account transactions (Cash, DSO, Update)
router.post('/:id/transaction', async (req, res) => {
    try {
        const { action, amount, newBalance, newProfit, note } = req.body;
        const account = await Account.findById(req.params.id);

        if (!account) return res.status(404).json({ message: 'Account not found' });

        const numAmount = Number(amount) || 0;
        const commissionRate = account.commission || 0;

        const FinancialLog = require('../models/FinancialLog');
        let sessionProfit = 0;

        switch (action) {
            case 'CASH_IN':
                account.balance += numAmount;
                // Only Agent accounts get profit on Cash In
                if (account.type === 'Agent') {
                    sessionProfit = numAmount * (commissionRate / 1000);
                    account.dailyProfit += sessionProfit;
                }

                // Log INCOME
                await new FinancialLog({
                    type: account.type === 'Cash' ? 'INCOME' : 'CASH_IN', // Differentiate Cash Account Income
                    amount: numAmount,
                    source: 'ACCOUNT',
                    description: note || `Cash In`
                }).save();
                break;

            case 'CASH_OUT':
                account.balance -= numAmount;
                sessionProfit = numAmount * (commissionRate / 1000);
                account.dailyProfit += sessionProfit;

                // Log EXPENSE
                await new FinancialLog({
                    type: account.type === 'Cash' ? 'EXPENSE' : 'CASH_OUT',
                    amount: numAmount,
                    source: 'ACCOUNT',
                    description: note || `Cash Out`
                }).save();
                break;

            case 'SEND_MONEY':
                // Personal accounts get profit on Send Money
                account.balance -= numAmount;
                sessionProfit = numAmount * (commissionRate / 1000);
                account.dailyProfit += sessionProfit;
                break;
            case 'DSO_IN':
                account.balance += numAmount;
                break;
            case 'DSO_OUT':
                account.balance -= numAmount;
                break;
            case 'DAILY_UPDATE':
                if (newBalance !== undefined) account.balance = Number(newBalance);
                if (newProfit !== undefined) {
                    account.dailyProfit = Number(newProfit);
                }
                break;
            default:
                return res.status(400).json({ message: 'Invalid action type' });
        }

        if (sessionProfit > 0) {
            await new FinancialLog({
                type: 'PROFIT',
                amount: sessionProfit,
                source: 'ACCOUNT',
                description: `${account.name} (${account.type}) - ${action} Profit`
            }).save();
        }

        const updatedAccount = await account.save();
        res.json(updatedAccount);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
