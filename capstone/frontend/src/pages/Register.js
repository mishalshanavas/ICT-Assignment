import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: ''
    }
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name.startsWith('address.')) {
      const addressField = name.split('.')[1];
      setFormData({
        ...formData,
        address: {
          ...formData.address,
          [addressField]: value
        }
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setMessage('Passwords don\'t match! They should be as compatible as pineapple on pizza (controversial)!');
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setMessage('Password too short! Make it longer than your attention span during a diet!');
      setLoading(false);
      return;
    }

    const result = await register(formData);
    
    if (result.success) {
      setMessage(result.message);
      setTimeout(() => navigate('/'), 1500);
    } else {
      setMessage(result.message);
    }
    
    setLoading(false);
  };

  return (
    <div className="auth-container">
      <div className="auth-card register-card">
        <div className="auth-header">
          <h1 className="auth-title">Join the Wiggy Family! 🍕</h1>
          <p className="auth-subtitle">Sign up for a lifetime of imaginary satisfaction!</p>
        </div>

        {message && (
          <div className={`alert ${message.includes('successful') || message.includes('Welcome') ? 'alert-success' : 'alert-error'}`}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="name" className="form-label">Full Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="form-input"
              placeholder="Your awesome name"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email" className="form-label">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="form-input"
              placeholder="your.email@example.com"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="phone" className="form-label">Phone Number</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="form-input"
              placeholder="+1234567890"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="form-input"
              placeholder="Super secret password"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="form-input"
              placeholder="Type it again (we don't trust you)"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="address.street" className="form-label">Street Address</label>
            <input
              type="text"
              id="address.street"
              name="address.street"
              value={formData.address.street}
              onChange={handleChange}
              className="form-input"
              placeholder="123 Hungry Street"
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="address.city" className="form-label">City</label>
              <input
                type="text"
                id="address.city"
                name="address.city"
                value={formData.address.city}
                onChange={handleChange}
                className="form-input"
                placeholder="Foodville"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="address.state" className="form-label">State</label>
              <input
                type="text"
                id="address.state"
                name="address.state"
                value={formData.address.state}
                onChange={handleChange}
                className="form-input"
                placeholder="Hungerland"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="address.zipCode" className="form-label">ZIP Code</label>
              <input
                type="text"
                id="address.zipCode"
                name="address.zipCode"
                value={formData.address.zipCode}
                onChange={handleChange}
                className="form-input"
                placeholder="12345"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-full"
            disabled={loading}
          >
            {loading ? 'Creating your food account...' : 'Join the Madness! 🎭'}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Already part of our crazy family? 
            <Link to="/login" className="auth-link"> Login here!</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;