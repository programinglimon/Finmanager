const express = require('express');
const router = express.Router();
const Account = require('../models/Account');
const RechargeSim = require('../models/RechargeSim');
const Inventory = require('../models/Inventory');
const Customer = require('../models/Customer');

router.get('/balance', async (req, res) => {
    try {
        // 1. Accounts Balance (Includes Personal, Agent, Cash)
        const accountsResult = await Account.aggregate([{ $group: { _id: null, total: { $sum: '$balance' } } }]);
        const accountsTotal = accountsResult[0]?.total || 0;

        // 2. Recharge SIM Balance
        const simsResult = await RechargeSim.aggregate([{ $group: { _id: null, total: { $sum: '$balance' } } }]);
        const simsTotal = simsResult[0]?.total || 0;

        // 3. Inventory Stock Value (BuyPrice * Quantity)
        // Note: Using reduce because multiplication per item is needed. 
        // MongoDB $multiply can do this in aggregate too.
        const inventoryResult = await Inventory.aggregate([
            { $project: { value: { $multiply: ['$quantity', '$buyPrice'] } } },
            { $group: { _id: null, total: { $sum: '$value' } } }
        ]);
        const inventoryTotal = inventoryResult[0]?.total || 0;

        // 4. Customer Due and Deposit
        const customers = await Customer.find();
        let dueTotal = 0;
        let depositTotal = 0;

        customers.forEach(c => {
            if (c.balance > 0) dueTotal += c.balance; // We get money (Asset)
            else depositTotal += Math.abs(c.balance); // We owe money (Liability)
        });

        // 5. Grand Total Calculation
        // Formula: Assets - Liabilities
        // Assets = Accounts + SIMs + Inventory + Due
        // Liabilities = Deposit
        const grandTotal = accountsTotal + simsTotal + inventoryTotal + dueTotal - depositTotal;

        res.json({
            grandTotal,
            breakdown: {
                accounts: accountsTotal,
                sims: simsTotal,
                inventory: inventoryTotal,
                due: dueTotal,
                deposit: depositTotal
            }
        });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
