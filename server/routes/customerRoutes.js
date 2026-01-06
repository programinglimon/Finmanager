const express = require('express');
const router = express.Router();
const Customer = require('../models/Customer');
const CustomerTransaction = require('../models/CustomerTransaction');

// === CUSTOMER CRUD ===

// Get all customers
router.get('/', async (req, res) => {
    try {
        const customers = await Customer.find().sort({ updatedAt: -1 });
        res.json(customers);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Create Customer
router.post('/', async (req, res) => {
    try {
        const { name, phone, address, initialBalance } = req.body;
        const customer = new Customer({
            name,
            phone,
            address,
            balance: initialBalance || 0
        });
        const savedCustomer = await customer.save();
        res.json(savedCustomer);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Get Single Customer with Transactions
router.get('/:id', async (req, res) => {
    try {
        const customer = await Customer.findById(req.params.id);
        if (!customer) return res.status(404).json({ message: 'Customer not found' });

        const transactions = await CustomerTransaction.find({ customer: req.params.id }).sort({ date: -1 });

        res.json({ customer, transactions });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// === TRANSACTION MANAGEMENT ===

// Add Transaction (GIVE/TAKE)
router.post('/:id/transactions', async (req, res) => {
    try {
        const { type, amount, note, date } = req.body;
        const customer = await Customer.findById(req.params.id);
        if (!customer) return res.status(404).json({ message: 'Customer not found' });

        const transaction = new CustomerTransaction({
            customer: customer._id,
            type,
            amount,
            note,
            date: date || Date.now()
        });

        await transaction.save();

        // Update Customer Balance
        // GIVE: You gave money/goods -> Due Increases (+)
        // TAKE: You received money -> Due Decreases (-)
        if (type === 'GIVE') {
            customer.balance += Number(amount);

            // Log Due Given
            const FinancialLog = require('../models/FinancialLog');
            await new FinancialLog({
                type: 'DUE_GIVEN',
                amount: Number(amount),
                source: 'CUSTOMER',
                description: `Due given to ${customer.name}`
            }).save();

        } else {
            customer.balance -= Number(amount);

            // Log Deposit Received
            const FinancialLog = require('../models/FinancialLog');
            await new FinancialLog({
                type: 'DEPOSIT_RECEIVED',
                amount: Number(amount),
                source: 'CUSTOMER',
                description: `Received from ${customer.name}`
            }).save();
        }
        await customer.save();

        res.json({ transaction, updatedBalance: customer.balance });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Delete Transaction
router.delete('/:customerId/transactions/:txnId', async (req, res) => {
    try {
        const { customerId, txnId } = req.params;
        const transaction = await CustomerTransaction.findById(txnId);
        if (!transaction) return res.status(404).json({ message: 'Transaction not found' });

        const customer = await Customer.findById(customerId);

        // Reverse balance effect
        if (transaction.type === 'GIVE') {
            customer.balance -= transaction.amount;
        } else {
            customer.balance += transaction.amount;
        }
        await customer.save();

        await CustomerTransaction.findByIdAndDelete(txnId);

        res.json({ message: 'Transaction deleted', updatedBalance: customer.balance });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
