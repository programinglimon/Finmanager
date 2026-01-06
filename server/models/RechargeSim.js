const mongoose = require('mongoose');

const rechargeSimSchema = new mongoose.Schema({
    name: { type: String, required: true },
    number: { type: String, required: true },
    balance: { type: Number, default: 0 },
    commission: { type: Number, default: 0 },
    dailyProfit: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('RechargeSim', rechargeSimSchema);
