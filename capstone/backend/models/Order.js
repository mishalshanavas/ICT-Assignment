const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  restaurant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Restaurant',
    required: true
  },
  items: [{
    menuItem: {
      name: String,
      price: Number,
      image: String
    },
    quantity: {
      type: Number,
      required: true,
      min: 1
    },
    price: {
      type: Number,
      required: true
    }
  }],
  totalAmount: {
    type: Number,
    required: true
  },
  deliveryFee: {
    type: Number,
    default: 25
  },
  tax: {
    type: Number,
    default: 0
  },
  finalAmount: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['placed', 'confirmed', 'preparing', 'out-for-delivery', 'delivered', 'cancelled'],
    default: 'placed'
  },
  deliveryAddress: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    phone: String
  },
  estimatedDeliveryTime: {
    type: String,
    default: '30-45 mins'
  },
  funnyStatusMessage: {
    type: String,
    default: "Your order is being prepared with love, tears, and a lot of hope!"
  },
  orderNotes: {
    type: String,
    default: ""
  }
}, {
  timestamps: true
});

// Calculate final amount before saving
orderSchema.pre('save', function(next) {
  this.tax = Math.round(this.totalAmount * 0.05); // 5% tax
  this.finalAmount = this.totalAmount + this.deliveryFee + this.tax;
  next();
});

module.exports = mongoose.model('Order', orderSchema);