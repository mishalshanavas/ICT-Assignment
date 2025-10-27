const express = require('express');
const Restaurant = require('../models/Restaurant');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Get all restaurants
router.get('/', async (req, res) => {
  try {
    const { cuisine, search, sortBy } = req.query;
    let query = {};

    // Filter by cuisine
    if (cuisine) {
      query.cuisine = { $in: [cuisine] };
    }

    // Search by name or description
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    let restaurants = Restaurant.find(query);

    // Sort restaurants
    if (sortBy === 'rating') {
      restaurants = restaurants.sort({ rating: -1 });
    } else if (sortBy === 'deliveryTime') {
      restaurants = restaurants.sort({ deliveryTime: 1 });
    } else if (sortBy === 'name') {
      restaurants = restaurants.sort({ name: 1 });
    } else {
      restaurants = restaurants.sort({ createdAt: -1 });
    }

    const result = await restaurants;

    res.json({
      message: '🍽️ Restaurants retrieved successfully!',
      funnyMessage: 'Here are our premium restaurants where the food is imaginary but the hunger is real!',
      count: result.length,
      restaurants: result
    });
  } catch (error) {
    console.error('Get restaurants error:', error);
    res.status(500).json({
      message: '💥 Failed to get restaurants!',
      funnyMessage: 'Our restaurant list is as missing as your willpower during a food sale!'
    });
  }
});

// Get single restaurant by ID
router.get('/:id', async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    
    if (!restaurant) {
      return res.status(404).json({
        message: '🤷‍♂️ Restaurant not found!',
        funnyMessage: 'This restaurant vanished faster than free samples at Costco!'
      });
    }

    res.json({
      message: '🏪 Restaurant details retrieved!',
      restaurant
    });
  } catch (error) {
    console.error('Get restaurant error:', error);
    res.status(500).json({
      message: '💥 Failed to get restaurant!',
      funnyMessage: 'This restaurant is playing hide and seek better than your motivation to cook!'
    });
  }
});

// Get restaurant menu
router.get('/:id/menu', async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id).select('menu name');
    
    if (!restaurant) {
      return res.status(404).json({
        message: '🤷‍♂️ Restaurant not found!',
        funnyMessage: 'This restaurant disappeared like your diet plans on a weekend!'
      });
    }

    const { category } = req.query;
    let menu = restaurant.menu;

    if (category) {
      menu = menu.filter(item => item.category === category);
    }

    res.json({
      message: '📜 Menu retrieved successfully!',
      funnyMessage: `Welcome to ${restaurant.name}! Where calories don't count because they're digital!`,
      restaurantName: restaurant.name,
      menu
    });
  } catch (error) {
    console.error('Get menu error:', error);
    res.status(500).json({
      message: '💥 Failed to get menu!',
      funnyMessage: 'Our menu is as confused as a vegetarian at a hot dog eating contest!'
    });
  }
});

// Add to favorites (requires authentication)
router.post('/:id/favorite', authMiddleware, async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    
    if (!restaurant) {
      return res.status(404).json({
        message: '🤷‍♂️ Restaurant not found!',
        funnyMessage: 'Can\'t favorite a restaurant that doesn\'t exist! That\'s like loving someone who doesn\'t know you exist!'
      });
    }

    const User = require('../models/User');
    const user = await User.findById(req.user._id);

    if (user.favoriteRestaurants.includes(restaurant._id)) {
      return res.status(400).json({
        message: '❤️ Already in favorites!',
        funnyMessage: 'You already love this place more than your ex loves drama!'
      });
    }

    user.favoriteRestaurants.push(restaurant._id);
    await user.save();

    res.json({
      message: '❤️ Added to favorites!',
      funnyMessage: 'Great choice! This restaurant is now officially part of your food family!'
    });
  } catch (error) {
    console.error('Add favorite error:', error);
    res.status(500).json({
      message: '💥 Failed to add to favorites!',
      funnyMessage: 'Our favorite system is as broken as your diet promises!'
    });
  }
});

module.exports = router;