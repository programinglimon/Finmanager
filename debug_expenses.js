const mongoose = require('mongoose');
const FinancialLog = require('./server/models/FinancialLog');
const Account = require('./server/models/Account');
require('dotenv').config({ path: './server/.env' });

const checkData = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to DB');

        // Check Accounts
        const cashAccounts = await Account.find({ type: 'Cash' });
        console.log('Cash Accounts:', cashAccounts);

        // Check Financial Logs
        const logs = await FinancialLog.find({});
        console.log('Total Logs:', logs.length);

        const expenses = await FinancialLog.find({ type: 'EXPENSE' });
        console.log('Expense Logs:', expenses);

        const allLogs = await FinancialLog.find({}).limit(5).sort({ createdAt: -1 });
        console.log('Recent 5 Logs:', allLogs);

    } catch (err) {
        console.error(err);
    } finally {
        mongoose.disconnect();
    }
};

checkData();
