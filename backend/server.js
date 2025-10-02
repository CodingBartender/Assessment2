
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const path = require('path');

dotenv.config();


const app = express();

app.use(cors());
app.use(express.json());
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/tasks', require('./routes/taskRoutes'));
app.use('/api/stocks', require('./routes/stockRoute'));
app.use('/api/portfolio', require('./routes/portfolioRoutes'));
app.use('/api/order', require('./routes/orderRoute'));
app.use('/api/transaction', require('./routes/transactionRoutes'));
app.use('/api/market', require('./routes/marketFeedRoutes'));
app.use('/api/order-status', require('./routes/orderStatusRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));


// image upload path
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Export the app object for testing
if (require.main === module) {
    connectDB();
    // If the file is run directly, start the server
    const PORT = process.env.PORT || 5001;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  }


module.exports = app
