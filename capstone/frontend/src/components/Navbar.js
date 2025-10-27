import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { getCartItemCount } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <span className="logo-text">🍔 Wiggy</span>
          <span className="logo-subtitle">When hunger meets comedy!</span>
        </Link>

        <div className="navbar-menu">
          <Link to="/" className="navbar-link">Home</Link>
          <Link to="/restaurants" className="navbar-link">Restaurants</Link>
          
          {user ? (
            <>
              <Link to="/orders" className="navbar-link">My Orders</Link>
              <Link to="/cart" className="navbar-link cart-link">
                🛒 Cart
                {getCartItemCount() > 0 && (
                  <span className="cart-badge">{getCartItemCount()}</span>
                )}
              </Link>
              <div className="navbar-user">
                <span className="user-name">Hi, {user.name}! 👋</span>
                <div className="user-dropdown">
                  <Link to="/profile" className="dropdown-link">Profile</Link>
                  <button onClick={handleLogout} className="dropdown-link logout-btn">
                    Logout
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="navbar-auth">
              <Link to="/login" className="btn btn-secondary">Login</Link>
              <Link to="/register" className="btn btn-primary">Sign Up</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;