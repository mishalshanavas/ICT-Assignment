const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({
        message: '🚫 Access denied! You need to login first.',
        funnyMessage: 'Even our imaginary food requires real authentication!'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select('-password');
    
    if (!user) {
      return res.status(401).json({
        message: '🤷‍♂️ User not found!',
        funnyMessage: 'Looks like you vanished faster than free pizza at a college dorm!'
      });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({
      message: '🔐 Invalid token!',
      funnyMessage: 'Your token is more expired than the milk in a bachelor\'s fridge!'
    });
  }
};

module.exports = authMiddleware;