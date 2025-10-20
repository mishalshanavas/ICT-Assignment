import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const location = useLocation();

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <h2>Employee Hub</h2>
        </div>
        <ul className="navbar-nav">
          <li className="nav-item">
            <Link 
              to="/" 
              className={`nav-link ${location.pathname === '/' || location.pathname === '/dashboard' ? 'active' : ''}`}
            >
              Home
            </Link>
          </li>
          <li className="nav-item">
            <Link 
              to="/employee-form" 
              className={`nav-link ${location.pathname === '/employee-form' ? 'active' : ''}`}
            >
              Employee Form
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;