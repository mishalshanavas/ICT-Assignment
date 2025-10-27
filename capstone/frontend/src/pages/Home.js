import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { restaurantAPI } from '../services/api';
import ImageWithFallback from '../components/ImageWithFallback';
import './Home.css';

const Home = () => {
  const [featuredRestaurants, setFeaturedRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeaturedRestaurants();
  }, []);

  const fetchFeaturedRestaurants = async () => {
    try {
      const response = await restaurantAPI.getAll({ limit: 3 });
      setFeaturedRestaurants(response.data.restaurants.slice(0, 3));
    } catch (error) {
      console.error('Error fetching restaurants:', error);
    } finally {
      setLoading(false);
    }
  };

  const heroMessages = [
    "Food delivery made simple and delightful",
    "Order from your favorite restaurants with ease",
    "Satisfy your cravings in just a few clicks",
    "Fresh meals delivered straight to your door",
    "Discover amazing food from local restaurants"
  ];

  const features = [
    {
      icon: "⚡",
      title: "Fast Delivery",
      description: "Get your favorite meals delivered quickly and efficiently to your doorstep"
    },
    {
      icon: "�️",
      title: "Wide Selection",
      description: "Choose from hundreds of restaurants and thousands of dishes in your area"
    },
    {
      icon: "💰",
      title: "Great Value",
      description: "Enjoy competitive prices and regular discounts on your favorite meals"
    },
    {
      icon: "�️",
      title: "Safe & Secure",
      description: "Your orders and payments are protected with enterprise-grade security"
    }
  ];

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1 className="hero-title">
            Delicious food delivered to <span className="brand-name">your door</span>
          </h1>
          <p className="hero-subtitle">
            {heroMessages[Math.floor(Math.random() * heroMessages.length)]}
          </p>
          <div className="hero-description">
            <p>
              Order from hundreds of local restaurants and get your favorite meals 
              delivered fresh and fast, right to your doorstep.
            </p>
          </div>
          <div className="hero-actions">
            <Link to="/restaurants" className="btn btn-primary btn-lg">
              Browse Restaurants
            </Link>
            <Link to="/register" className="btn btn-secondary btn-lg">
              Get Started
            </Link>
          </div>
        </div>
        <div className="hero-image">
          <div className="food-emoji-grid">
            <span className="food-emoji">🍕</span>
            <span className="food-emoji">🍔</span>
            <span className="food-emoji">🌮</span>
            <span className="food-emoji">🍜</span>
            <span className="food-emoji">🍗</span>
            <span className="food-emoji">🥗</span>
            <span className="food-emoji">🍝</span>
            <span className="food-emoji">🍱</span>
            <span className="food-emoji">🌯</span>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <div className="container">
          <h2 className="section-title">Why Choose Wiggy? 🤔</h2>
          <p className="section-subtitle">
            Because we're the only food app that admits we're completely ridiculous!
          </p>
          <div className="features-grid">
            {features.map((feature, index) => (
              <div key={index} className="feature-card">
                <div className="feature-icon">{feature.icon}</div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-description">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Restaurants */}
      <section className="featured-restaurants">
        <div className="container">
          <h2 className="section-title">Featured Comedy Restaurants 🎪</h2>
          <p className="section-subtitle">
            Our top picks for maximum confusion and minimum satisfaction!
          </p>
          
          {loading ? (
            <div className="loading">
              <div className="spinner"></div>
              <p>Loading our collection of ridiculous restaurants...</p>
            </div>
          ) : (
            <div className="restaurants-grid">
              {featuredRestaurants.map((restaurant) => (
                <div key={restaurant._id} className="restaurant-card">
                  <ImageWithFallback 
                    src={restaurant.image} 
                    alt={restaurant.name}
                    className="restaurant-image"
                  />
                  <div className="restaurant-info">
                    <h3 className="restaurant-name">{restaurant.name}</h3>
                    <p className="restaurant-tagline">"{restaurant.funnyTagline}"</p>
                    <div className="restaurant-meta">
                      <span className="rating">⭐ {restaurant.rating}</span>
                      <span className="delivery-time">🕒 {restaurant.deliveryTime}</span>
                      <span className="delivery-fee">💰 ₹{restaurant.deliveryFee}</span>
                    </div>
                    <p className="restaurant-description">{restaurant.description}</p>
                    <Link 
                      to={`/restaurant/${restaurant._id}`} 
                      className="btn btn-primary"
                    >
                      View Menu 📋
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          <div className="section-footer">
            <Link to="/restaurants" className="btn btn-secondary btn-large">
              View All Restaurants 🍽️
            </Link>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="cta">
        <div className="container">
          <div className="cta-content">
            <h2 className="cta-title">Ready to Order Some Digital Deliciousness? 🤤</h2>
            <p className="cta-description">
              Join thousands of confused but happy customers who keep coming back for more imaginary food!
            </p>
            <div className="cta-stats">
              <div className="stat">
                <span className="stat-number">1000+</span>
                <span className="stat-label">Confused Customers</span>
              </div>
              <div className="stat">
                <span className="stat-number">50+</span>
                <span className="stat-label">Hilarious Restaurants</span>
              </div>
              <div className="stat">
                <span className="stat-number">∞</span>
                <span className="stat-label">Imaginary Calories</span>
              </div>
            </div>
            <Link to="/register" className="btn btn-primary btn-large">
              Get Started Now! 🚀
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;