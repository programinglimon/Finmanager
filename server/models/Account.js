const mongoose = require('mongoose');

const accountSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        enum: ['Personal', 'Agent', 'Cash'],
        required: true,
    },
    number: {
        type: String,
    },
    provider: {
        type: String,
        // enum: ['Bkash', 'Nagad', 'Rocket', 'Mcash', 'Upay', 'Tap', 'Other'], // Optional: restrict if needed
    },
    commission: {
        type: Number,
        default: 0,
    },
    balance: {
        type: Number,
        default: 0,
    },
    dailyProfit: {
        type: Number,
        default: 0,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Account', accountSchema);
