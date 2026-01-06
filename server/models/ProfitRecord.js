const mongoose = require('mongoose');

const profitRecordSchema = new mongoose.Schema({
    source: {
        type: String,
        enum: ['SIM', 'INVENTORY', 'ACCOUNT', 'OTHER'],
        required: true
    },
    referenceId: {
        type: mongoose.Schema.Types.ObjectId,
        refPath: 'sourceModel' // Dynamic reference based on source
    },
    amount: {
        type: Number,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    description: {
        type: String
    }
}, { timestamps: true });

module.exports = mongoose.model('ProfitRecord', profitRecordSchema);
