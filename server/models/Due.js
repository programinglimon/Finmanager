const mongoose = require('mongoose');

const dueSchema = new mongoose.Schema({
    name: { type: String, required: true },
    amount: { type: Number, required: true },
    type: { type: String, enum: ['DUE', 'DEPOSIT'], required: true },
    note: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Due', dueSchema);
