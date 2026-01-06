const mongoose = require('mongoose');
const FinancialLog = require('./server/models/FinancialLog');
require('dotenv').config({ path: './server/.env' });

const runTest = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to DB');

        // 1. Create Past Expenses
        const day = 24 * 60 * 60 * 1000;

        await new FinancialLog({
            type: 'EXPENSE',
            amount: 500,
            source: 'ACCOUNT',
            description: 'Expense 10 Days Ago',
            date: Date.now() - (10 * day)
        }).save();

        await new FinancialLog({
            type: 'EXPENSE',
            amount: 1000,
            source: 'ACCOUNT',
            description: 'Expense 40 Days Ago',
            date: Date.now() - (40 * day)
        }).save();

        console.log('Inserted Dummy Past Data');

        // 2. Fetch via internal logic (mimic route)
        const getCount = async (range) => {
            let startDate = new Date();
            startDate.setHours(0, 0, 0, 0);

            if (range === 'weekly') startDate.setDate(startDate.getDate() - 7);
            else if (range === 'monthly') startDate.setDate(1);
            else if (range === 'yearly') startDate.setMonth(0, 1);

            const count = await FinancialLog.countDocuments({
                type: 'EXPENSE',
                date: { $gte: startDate }
            });
            console.log(`Range [${range}] StartDate [${startDate.toISOString()}] -> Count: ${count}`);
        };

        await getCount('daily');
        await getCount('weekly');
        await getCount('monthly');
        await getCount('yearly');

    } catch (err) {
        console.error(err);
    } finally {
        mongoose.disconnect();
    }
};

runTest();
