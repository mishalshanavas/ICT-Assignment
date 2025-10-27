const mongoose = require('mongoose');

const restaurantSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  image: {
    type: String,
    default: 'https://via.placeholder.com/300x200?text=Restaurant+Image'
  },
  cuisine: [{
    type: String,
    required: true
  }],
  rating: {
    type: Number,
    min: 1,
    max: 5,
    default: 4.2
  },
  deliveryTime: {
    type: String,
    default: '30-45 mins'
  },
  deliveryFee: {
    type: Number,
    default: 25
  },
  minimumOrder: {
    type: Number,
    default: 99
  },
  isOpen: {
    type: Boolean,
    default: true
  },
  funnyTagline: {
    type: String,
    required: true
  },
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String
  },
  menu: [{
    name: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    price: {
      type: Number,
      required: true
    },
    image: {
      type: String,
      default: 'https://via.placeholder.com/200x150?text=Food+Item'
    },
    category: {
      type: String,
      required: true,
      enum: ['Starters', 'Main Course', 'Desserts', 'Beverages', 'Snacks']
    },
    isVeg: {
      type: Boolean,
      default: true
    },
    isAvailable: {
      type: Boolean,
      default: true
    },
    funnyDescription: {
      type: String,
      required: true
    }
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('Restaurant', restaurantSchema);