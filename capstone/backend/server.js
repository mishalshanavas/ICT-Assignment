const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
const authRoutes = require('./routes/auth');
const restaurantRoutes = require('./routes/restaurants');
const orderRoutes = require('./routes/orders');

app.use('/api/auth', authRoutes);
app.use('/api/restaurants', restaurantRoutes);
app.use('/api/orders', orderRoutes);

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/wiggy';

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('🎉 Connected to MongoDB! Ready to serve some imaginary food!');
})
.catch((error) => {
  console.error('💥 MongoDB connection failed:', error);
});

// Welcome route
app.get('/', (req, res) => {
  res.json({
    message: '🍕 Welcome to Wiggy API!',
    joke: 'Why did the pizza go to therapy? Because it had too many toppings and felt overwhelmed!',
    endpoints: {
      auth: '/api/auth',
      restaurants: '/api/restaurants',
      orders: '/api/orders'
    }
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    message: '🤷‍♂️ Oops! This endpoint is as missing as your willpower during a food sale!',
    suggestion: 'Try checking our main endpoints or go back to eating real food.'
  });
});

// Error handler
app.use((error, req, res, next) => {
  console.error('💥 Server Error:', error);
  res.status(500).json({
    message: '🔥 Something went wrong in our kitchen!',
    error: 'The chef probably dropped the server. Please try again later.'
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Wiggy server is running on port ${PORT}`);
  console.log(`🎭 Ready to serve some hilarious food orders!`);
});