const mongoose = require('mongoose');

const inventorySchema = new mongoose.Schema({
    name: { type: String, required: true },
    category: { type: String, default: 'Other' },
    quantity: { type: Number, default: 0 },
    buyPrice: { type: Number, default: 0 },
    sellPrice: { type: Number, default: 0 },
    dailyProfit: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('Inventory', inventorySchema);
