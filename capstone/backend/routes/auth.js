const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, phone, address } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        message: '👥 User already exists!',
        funnyMessage: 'Looks like someone beat you to this email! Maybe try adding some numbers like email123@example.com?'
      });
    }

    // Create new user
    const user = new User({
      name,
      email,
      password,
      phone,
      address,
      funnyQuote: generateFunnyQuote()
    });

    await user.save();

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(201).json({
      message: '🎉 User registered successfully!',
      funnyMessage: 'Welcome to the hunger games! May the food be ever in your favor!',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        funnyQuote: user.funnyQuote
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      message: '💥 Registration failed!',
      funnyMessage: 'Our registration system is having a food coma. Please try again!'
    });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        message: '❌ Invalid credentials!',
        funnyMessage: 'Wrong email or password! Are you sure you\'re not confusing this with your pizza order?'
      });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({
        message: '❌ Invalid credentials!',
        funnyMessage: 'Password is as wrong as pineapple on pizza! (Fight me!)'
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      message: '✅ Login successful!',
      funnyMessage: 'Welcome back, hungry human! Time to order some digital deliciousness!',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        funnyQuote: user.funnyQuote
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      message: '💥 Login failed!',
      funnyMessage: 'Our login system is as confused as a vegetarian at a BBQ joint!'
    });
  }
});

// Get current user
router.get('/me', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .select('-password')
      .populate('favoriteRestaurants', 'name cuisine rating')
      .populate('orderHistory');

    res.json({
      message: '👤 User profile retrieved!',
      user
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({
      message: '💥 Failed to get user profile!',
      funnyMessage: 'We lost your profile faster than you lose your diet plans on a Friday night!'
    });
  }
});

// Function to generate funny quotes
function generateFunnyQuote() {
  const quotes = [
    "I'm not lazy, I'm just on energy-saving mode... that's why I order food!",
    "My relationship status: Committed to food delivery apps",
    "I don't need therapy, I need tacos",
    "Life is too short for bad food and long delivery times",
    "I'm on a seafood diet. I see food and I order it!",
    "Cooking is overrated when you have Wiggy!",
    "My blood type is pizza positive",
    "I followed my heart and it led me to the fridge... then to this app"
  ];
  return quotes[Math.floor(Math.random() * quotes.length)];
}

module.exports = router;