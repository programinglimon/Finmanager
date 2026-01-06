require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Basic Route
app.get('/', (req, res) => {
  res.send('API is running...');
});

app.use('/api/items', require('./routes/itemRoutes'));
app.use('/api/accounts', require('./routes/accountRoutes'));
app.use('/api/recharge', require('./routes/rechargeRoutes'));
app.use('/api/due', require('./routes/dueRoutes'));
app.use('/api/customers', require('./routes/customerRoutes'));
app.use('/api/profit', require('./routes/profitRoutes'));
app.use('/api/report', require('./routes/reportRoutes')); // Fix: Ensure reportRoutes handles /api/reports or /api/report, keeping consistent
app.use('/api/reports', require('./routes/reportRoutes')); // keeping double for safety or check file
app.use('/api/business', require('./routes/businessRoutes'));
app.use('/api/expenses', require('./routes/expenseRoutes')); // New route

// MongoDB Connection
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/finmanager');
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

// Start Server
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
