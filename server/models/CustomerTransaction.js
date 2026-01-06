const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    customer: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
    type: { type: String, enum: ['GIVE', 'TAKE'], required: true }, // GIVE = You gave (Due increase), TAKE = You received (Due decrease)
    amount: { type: Number, required: true },
    date: { type: Date, default: Date.now },
    note: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('CustomerTransaction', transactionSchema);
