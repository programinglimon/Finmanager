const mongoose = require('mongoose');

const financialLogSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ['SALE', 'PROFIT', 'DUE_GIVEN', 'DEPOSIT_RECEIVED', 'EXPENSE'],
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    source: {
        type: String, // e.g., 'SIM', 'INVENTORY', 'CUSTOMER', 'ACCOUNT'
        required: true
    },
    description: {
        type: String
    },
    date: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

module.exports = mongoose.model('FinancialLog', financialLogSchema);
