import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { restaurantAPI } from '../services/api';
import ImageWithFallback from '../components/ImageWithFallback';
import './Restaurants.css';

const Restaurants = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    cuisine: '',
    sortBy: ''
  });
  const [error, setError] = useState('');

  const cuisineTypes = ['All', 'Fast Food', 'Indian', 'Italian', 'Chinese', 'Mexican', 'Pizza', 'Curry', 'Asian'];
  const sortOptions = [
    { value: '', label: 'Default' },
    { value: 'rating', label: 'Rating' },
    { value: 'deliveryTime', label: 'Delivery Time' },
    { value: 'name', label: 'Name' }
  ];

  useEffect(() => {
    fetchRestaurants();
  }, [filters]);

  const fetchRestaurants = async () => {
    try {
      setLoading(true);
      const params = {};
      
      if (filters.search) params.search = filters.search;
      if (filters.cuisine && filters.cuisine !== 'All') params.cuisine = filters.cuisine;
      if (filters.sortBy) params.sortBy = filters.sortBy;

      const response = await restaurantAPI.getAll(params);
      setRestaurants(response.data.restaurants || []);
      setError('');
    } catch (error) {
      console.error('Error fetching restaurants:', error);
      setError('Failed to load restaurants. Our chefs might be on a coffee break! ☕');
      setRestaurants([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchRestaurants();
  };

  return (
    <div className="restaurants-page">
      <div className="container">
        {/* Header */}
        <div className="page-header">
          <h1 className="page-title">Our Comedy Restaurants 🎪</h1>
          <p className="page-subtitle">
            Where food meets comedy and hunger meets confusion! Choose your adventure below:
          </p>
        </div>

        {/* Filters */}
        <div className="filters-section">
          <form onSubmit={handleSearchSubmit} className="search-form">
            <div className="search-group">
              <input
                type="text"
                placeholder="Search for restaurants or food..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="search-input"
              />
              <button type="submit" className="search-btn">🔍</button>
            </div>
          </form>

          <div className="filter-controls">
            <div className="filter-group">
              <label className="filter-label">Cuisine Type:</label>
              <select
                value={filters.cuisine}
                onChange={(e) => handleFilterChange('cuisine', e.target.value)}
                className="filter-select"
              >
                {cuisineTypes.map(cuisine => (
                  <option key={cuisine} value={cuisine === 'All' ? '' : cuisine}>
                    {cuisine}
                  </option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label className="filter-label">Sort By:</label>
              <select
                value={filters.sortBy}
                onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                className="filter-select"
              >
                {sortOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="loading">
            <div className="spinner"></div>
            <p>Loading our collection of ridiculous restaurants...</p>
          </div>
        ) : error ? (
          <div className="error-state">
            <h3>Oops! Something went wrong! 😅</h3>
            <p>{error}</p>
            <button onClick={fetchRestaurants} className="btn btn-primary">
              Try Again
            </button>
          </div>
        ) : restaurants.length === 0 ? (
          <div className="empty-state">
            <h3>No restaurants found! 🤷‍♂️</h3>
            <p>Looks like our restaurants are playing hide and seek!</p>
            <button onClick={() => setFilters({ search: '', cuisine: '', sortBy: '' })} className="btn btn-secondary">
              Clear Filters
            </button>
          </div>
        ) : (
          <>
            <div className="results-header">
              <h2>Found {restaurants.length} amazing restaurants!</h2>
              <p>Each one more confusing than the last! 🎭</p>
            </div>

            <div className="restaurants-grid">
              {restaurants.map((restaurant) => (
                <Link 
                  key={restaurant._id} 
                  to={`/restaurant/${restaurant._id}`}
                  className="restaurant-card"
                >
                  <div className="restaurant-image-container">
                    <ImageWithFallback 
                      src={restaurant.image} 
                      alt={restaurant.name}
                      className="restaurant-image"
                    />
                    <div className="restaurant-discount">
                      {restaurant.deliveryFee === 0 ? "FREE DELIVERY" : `₹${restaurant.deliveryFee} DELIVERY`}
                    </div>
                  </div>

                  <div className="restaurant-content">
                    <div className="restaurant-header">
                      <h3 className="restaurant-name">{restaurant.name}</h3>
                      <div className="restaurant-rating">
                        <span className="rating-star">
                          ⭐ {restaurant.rating}
                        </span>
                      </div>
                    </div>
                    
                    <div className="restaurant-rating-delivery">
                      <div className="restaurant-rating">
                        <span>⭐ {restaurant.rating}</span>
                      </div>
                      <div className="delivery-time">{restaurant.deliveryTime}</div>
                    </div>
                    
                    <div className="restaurant-cuisines">
                      {restaurant.cuisine.join(', ')}
                    </div>
                    
                    <div className="restaurant-location">
                      📍 {restaurant.location || 'Multiple locations'}
                    </div>

                    <div className="restaurant-info">
                      <div className={`delivery-fee ${restaurant.deliveryFee === 0 ? 'free' : ''}`}>
                        {restaurant.deliveryFee === 0 ? "Free Delivery" : `₹${restaurant.deliveryFee} delivery`}
                      </div>
                      <button className="view-menu-btn">
                        View Menu →
                      </button>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Restaurants;