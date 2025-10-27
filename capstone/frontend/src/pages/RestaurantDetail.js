import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { restaurantAPI } from '../services/api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import ImageWithFallback from '../components/ImageWithFallback';
import './RestaurantDetail.css';

const RestaurantDetail = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [quantities, setQuantities] = useState({});
  const [addedToCart, setAddedToCart] = useState({});

  useEffect(() => {
    fetchRestaurant();
  }, [id]);

  const fetchRestaurant = async () => {
    try {
      setLoading(true);
      const response = await restaurantAPI.getById(id);
      setRestaurant(response.data.restaurant);
    } catch (error) {
      console.error('Error fetching restaurant:', error);
      setError('Restaurant not found! It might have vanished like your diet plans on a Friday night! 🤷‍♂️');
    } finally {
      setLoading(false);
    }
  };

  const getCategories = () => {
    if (!restaurant?.menu) return ['All'];
    const categories = ['All', ...new Set(restaurant.menu.map(item => item.category))];
    return categories;
  };

  const getFilteredMenu = () => {
    if (!restaurant?.menu) return [];
    if (selectedCategory === 'All') return restaurant.menu;
    return restaurant.menu.filter(item => item.category === selectedCategory);
  };

  const handleQuantityChange = (itemId, quantity) => {
    setQuantities(prev => ({
      ...prev,
      [itemId]: Math.max(0, quantity)
    }));
  };

  const handleAddToCart = (menuItem) => {
    if (!isAuthenticated) {
      alert('Please login to add items to cart! Even imaginary food requires real authentication! 😄');
      return;
    }

    const quantity = quantities[menuItem._id] || 1;
    addToCart(restaurant, menuItem, quantity);
    
    // Show success feedback
    setAddedToCart(prev => ({ ...prev, [menuItem._id]: true }));
    setTimeout(() => {
      setAddedToCart(prev => ({ ...prev, [menuItem._id]: false }));
    }, 2000);

    // Reset quantity
    setQuantities(prev => ({ ...prev, [menuItem._id]: 1 }));
  };

  if (loading) {
    return (
      <div className="restaurant-detail">
        <div className="container">
          <div className="loading">
            <div className="spinner"></div>
            <p>Loading restaurant details... Our chefs are preparing something special! 👨‍🍳</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="restaurant-detail">
        <div className="container">
          <div className="error-state">
            <h2>🤔 Oops!</h2>
            <p>{error}</p>
            <Link to="/restaurants" className="btn btn-primary">
              🍽️ Browse Other Restaurants
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!restaurant) {
    return null;
  }

  return (
    <div className="restaurant-detail">
      {/* Restaurant Header */}
      <div className="restaurant-header">
        <div className="restaurant-hero">
          <ImageWithFallback
            src={restaurant.image}
            alt={restaurant.name}
            className="restaurant-hero-image"
          />
          <div className="restaurant-hero-overlay">
            <div className="container">
              <div className="restaurant-info">
                <h1 className="restaurant-name">{restaurant.name}</h1>
                <p className="restaurant-tagline">"{restaurant.funnyTagline}"</p>
                <div className="restaurant-meta">
                  <div className="meta-item">
                    <span className="meta-icon">⭐</span>
                    <span>{restaurant.rating} Rating</span>
                  </div>
                  <div className="meta-item">
                    <span className="meta-icon">🕒</span>
                    <span>{restaurant.deliveryTime}</span>
                  </div>
                  <div className="meta-item">
                    <span className="meta-icon">💰</span>
                    <span>₹{restaurant.deliveryFee} Delivery</span>
                  </div>
                  <div className="meta-item">
                    <span className="meta-icon">🛒</span>
                    <span>Min ₹{restaurant.minimumOrder}</span>
                  </div>
                  <div className="meta-item">
                    <span className={`status ${restaurant.isOpen ? 'open' : 'closed'}`}>
                      {restaurant.isOpen ? '🟢 Open' : '🔴 Closed'}
                    </span>
                  </div>
                </div>
                <p className="restaurant-description">{restaurant.description}</p>
                <div className="restaurant-cuisines">
                  {restaurant.cuisine.map((cuisine, index) => (
                    <span key={index} className="cuisine-badge">{cuisine}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Menu Section */}
      <div className="menu-section">
        <div className="container">
          <div className="menu-header">
            <h2 className="menu-title">🍽️ Our Hilarious Menu</h2>
            <p className="menu-subtitle">
              Warning: Menu descriptions may cause uncontrollable laughter and excessive drooling!
            </p>
          </div>

          {/* Category Filters */}
          <div className="category-filters">
            {getCategories().map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`category-btn ${selectedCategory === category ? 'active' : ''}`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Menu Items */}
          <div className="menu-items">
            {getFilteredMenu().map((item) => (
              <div key={item._id} className="menu-item">
                <div className="menu-item-image">
                  <ImageWithFallback
                    src={item.image}
                    alt={item.name}
                    className="item-image"
                  />
                  <div className="item-badges">
                    <span className={`veg-badge ${item.isVeg ? 'veg' : 'non-veg'}`}>
                      {item.isVeg ? '🟢' : '🔴'}
                    </span>
                  </div>
                </div>

                <div className="menu-item-content">
                  <div className="item-header">
                    <h3 className="item-name">{item.name}</h3>
                    <span className="item-price">₹{item.price}</span>
                  </div>
                  
                  <p className="item-description">{item.description}</p>
                  <p className="item-funny-description">"{item.funnyDescription}"</p>

                  <div className="item-actions">
                    {!item.isAvailable ? (
                      <button className="btn btn-disabled" disabled>
                        😴 Currently Unavailable
                      </button>
                    ) : (
                      <div className="add-to-cart-section">
                        <div className="quantity-selector">
                          <button
                            onClick={() => handleQuantityChange(item._id, (quantities[item._id] || 1) - 1)}
                            className="quantity-btn"
                            disabled={!quantities[item._id] || quantities[item._id] <= 1}
                          >
                            -
                          </button>
                          <span className="quantity-display">
                            {quantities[item._id] || 1}
                          </span>
                          <button
                            onClick={() => handleQuantityChange(item._id, (quantities[item._id] || 1) + 1)}
                            className="quantity-btn"
                          >
                            +
                          </button>
                        </div>
                        
                        <button
                          onClick={() => handleAddToCart(item)}
                          className={`btn btn-primary add-to-cart-btn ${addedToCart[item._id] ? 'added' : ''}`}
                          disabled={addedToCart[item._id]}
                        >
                          {addedToCart[item._id] ? '✅ Added!' : '🛒 Add to Cart'}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {getFilteredMenu().length === 0 && (
            <div className="no-items">
              <h3>🤷‍♂️ No items found in this category</h3>
              <p>Our chef is probably inventing new ways to confuse your taste buds!</p>
            </div>
          )}
        </div>
      </div>

      {/* Restaurant Info Footer */}
      <div className="restaurant-footer">
        <div className="container">
          <div className="footer-info">
            <div className="info-section">
              <h3>📍 Location</h3>
              <p>
                {restaurant.address.street}<br />
                {restaurant.address.city}, {restaurant.address.state} {restaurant.address.zipCode}
              </p>
            </div>
            <div className="info-section">
              <h3>⏰ Delivery Info</h3>
              <p>
                <strong>Delivery Time:</strong> {restaurant.deliveryTime}<br />
                <strong>Delivery Fee:</strong> ₹{restaurant.deliveryFee}<br />
                <strong>Minimum Order:</strong> ₹{restaurant.minimumOrder}
              </p>
            </div>
            <div className="info-section">
              <h3>🎭 Fun Fact</h3>
              <p>
                This restaurant specializes in {restaurant.cuisine.join(' & ')} cuisine 
                and has been making people laugh (and occasionally cry from joy) since forever!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RestaurantDetail;