const express = require('express');
const Order = require('../models/Order');
const Restaurant = require('../models/Restaurant');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Create new order (requires authentication)
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { restaurantId, items, deliveryAddress, orderNotes } = req.body;

    // Validate restaurant exists
    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) {
      return res.status(404).json({
        message: '🤷‍♂️ Restaurant not found!',
        funnyMessage: 'This restaurant vanished faster than your motivation to cook!'
      });
    }

    // Calculate total amount
    let totalAmount = 0;
    const orderItems = items.map(item => {
      const menuItem = restaurant.menu.id(item.menuItemId);
      if (!menuItem) {
        throw new Error(`Menu item not found: ${item.menuItemId}`);
      }
      
      const itemTotal = menuItem.price * item.quantity;
      totalAmount += itemTotal;
      
      return {
        menuItem: {
          name: menuItem.name,
          price: menuItem.price,
          image: menuItem.image
        },
        quantity: item.quantity,
        price: itemTotal
      };
    });

    // Calculate tax and final amount
    const tax = Math.round(totalAmount * 0.05); // 5% tax
    const finalAmount = totalAmount + restaurant.deliveryFee + tax;

    // Create order
    const order = new Order({
      user: req.user._id,
      restaurant: restaurantId,
      items: orderItems,
      totalAmount,
      deliveryFee: restaurant.deliveryFee,
      tax,
      finalAmount,
      deliveryAddress,
      orderNotes,
      funnyStatusMessage: generateFunnyStatusMessage('placed')
    });

    await order.save();

    // Populate order details
    await order.populate('restaurant', 'name image deliveryTime');

    res.status(201).json({
      message: '🎉 Order placed successfully!',
      funnyMessage: 'Congratulations! You just ordered imaginary food that will fill your virtual stomach!',
      order
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({
      message: '💥 Failed to create order!',
      funnyMessage: 'Our order system is as confused as a pizza delivery guy without GPS!'
    });
  }
});

// Get user's orders (requires authentication)
router.get('/my-orders', authMiddleware, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate('restaurant', 'name image cuisine rating')
      .sort({ createdAt: -1 });

    res.json({
      message: '📦 Orders retrieved successfully!',
      funnyMessage: 'Here\'s your order history - a beautiful timeline of your food decisions!',
      count: orders.length,
      orders
    });
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({
      message: '💥 Failed to get orders!',
      funnyMessage: 'Your order history is as missing as your cooking skills!'
    });
  }
});

// Get single order (requires authentication)
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const order = await Order.findOne({ 
      _id: req.params.id, 
      user: req.user._id 
    }).populate('restaurant', 'name image deliveryTime phone');

    if (!order) {
      return res.status(404).json({
        message: '🤷‍♂️ Order not found!',
        funnyMessage: 'This order is as missing as your patience when you\'re hungry!'
      });
    }

    res.json({
      message: '📋 Order details retrieved!',
      order
    });
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({
      message: '💥 Failed to get order!',
      funnyMessage: 'This order is playing hide and seek better than your willpower!'
    });
  }
});

// Update order status (demo purposes - normally this would be admin only)
router.patch('/:id/status', authMiddleware, async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['placed', 'confirmed', 'preparing', 'out-for-delivery', 'delivered', 'cancelled'];
    
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        message: '❌ Invalid status!',
        funnyMessage: 'That status is as invalid as putting ketchup on pasta!'
      });
    }

    const order = await Order.findOne({ 
      _id: req.params.id, 
      user: req.user._id 
    });

    if (!order) {
      return res.status(404).json({
        message: '🤷‍♂️ Order not found!',
        funnyMessage: 'This order vanished like your money after a shopping spree!'
      });
    }

    order.status = status;
    order.funnyStatusMessage = generateFunnyStatusMessage(status);
    await order.save();

    res.json({
      message: '✅ Order status updated!',
      funnyMessage: order.funnyStatusMessage,
      order
    });
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({
      message: '💥 Failed to update order status!',
      funnyMessage: 'Our status update system is as reliable as weather forecasts!'
    });
  }
});

// Cancel order (requires authentication)
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const order = await Order.findOne({ 
      _id: req.params.id, 
      user: req.user._id 
    });

    if (!order) {
      return res.status(404).json({
        message: '🤷‍♂️ Order not found!',
        funnyMessage: 'Can\'t cancel an order that doesn\'t exist! That\'s like trying to unsend a text to your ex!'
      });
    }

    if (order.status === 'delivered') {
      return res.status(400).json({
        message: '❌ Cannot cancel delivered order!',
        funnyMessage: 'You can\'t cancel a delivered order! That\'s like trying to uneat a pizza!'
      });
    }

    order.status = 'cancelled';
    order.funnyStatusMessage = generateFunnyStatusMessage('cancelled');
    await order.save();

    res.json({
      message: '❌ Order cancelled successfully!',
      funnyMessage: 'Order cancelled! Don\'t worry, there are plenty more imaginary meals in the sea!',
      order
    });
  } catch (error) {
    console.error('Cancel order error:', error);
    res.status(500).json({
      message: '💥 Failed to cancel order!',
      funnyMessage: 'Our cancellation system is as stubborn as your grandmother\'s recipes!'
    });
  }
});

// Function to generate funny status messages
function generateFunnyStatusMessage(status) {
  const messages = {
    placed: [
      "Your order is being prepared with love, tears, and a lot of hope!",
      "Congratulations! You've officially committed to imaginary calories!",
      "Your order is in the system. Our digital chefs are stretching their pixelated muscles!"
    ],
    confirmed: [
      "Order confirmed! The restaurant is now aware of your food demands!",
      "Great news! Your order has been accepted faster than your friend requests!",
      "Order confirmed! Time to start the hunger countdown!"
    ],
    preparing: [
      "Your food is being prepared with the same care as a meme compilation!",
      "The kitchen is buzzing! Well, digitally buzzing at least!",
      "Your meal is being crafted with precision and a lot of imaginary ingredients!"
    ],
    'out-for-delivery': [
      "Your order is out for delivery! It's traveling faster than gossip in a small town!",
      "Delivery person is on the way! They're navigating through traffic and existential crises!",
      "Your food is en route! It's probably lost, but so are we all!"
    ],
    delivered: [
      "Order delivered! Enjoy your imaginary feast!",
      "Delivered successfully! Time to pretend you're full!",
      "Your food has arrived! Now you can officially say you've eaten today!"
    ],
    cancelled: [
      "Order cancelled! Don't worry, your hunger will find another way!",
      "Cancelled faster than your New Year's resolutions!",
      "Order cancelled! Your wallet is thanking you, but your stomach isn't!"
    ]
  };

  const statusMessages = messages[status];
  return statusMessages[Math.floor(Math.random() * statusMessages.length)];
}

module.exports = router;