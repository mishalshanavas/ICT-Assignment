import React from 'react';
import './Footer.css';

const Footer = () => {
  const funnyQuotes = [
    "Wiggy: Where your hunger meets our imaginary chef's creativity!",
    "We promise our food is as real as your willpower to diet!",
    "Delivering happiness, one virtual bite at a time!",
    "Our delivery time is faster than your ex's new relationship!",
    "Warning: Side effects may include excessive drooling and empty wallets!",
    "Wiggy - Because cooking is overrated!"
  ];

  const randomQuote = funnyQuotes[Math.floor(Math.random() * funnyQuotes.length)];

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <h3 className="footer-title">🍔 Wiggy</h3>
          <p className="footer-quote">"{randomQuote}"</p>
          <div className="footer-social">
            <span>Follow us for more food comedy!</span>
            <div className="social-links">
              <a href="#" className="social-link">📘</a>
              <a href="#" className="social-link">📸</a>
              <a href="#" className="social-link">🐦</a>
              <a href="#" className="social-link">📺</a>
            </div>
          </div>
        </div>

        <div className="footer-section">
          <h4 className="footer-subtitle">Quick Links</h4>
          <ul className="footer-links">
            <li><a href="/">Home Sweet Home</a></li>
            <li><a href="/restaurants">Restaurant Paradise</a></li>
            <li><a href="/orders">Order History</a></li>
            <li><a href="/profile">My Hungry Profile</a></li>
          </ul>
        </div>

        <div className="footer-section">
          <h4 className="footer-subtitle">Company (Barely)</h4>
          <ul className="footer-links">
            <li><a href="#">About Our Madness</a></li>
            <li><a href="#">Careers (We're Always Hungry)</a></li>
            <li><a href="#">Press (Please Don't)</a></li>
            <li><a href="#">Contact (If You Dare)</a></li>
          </ul>
        </div>

        <div className="footer-section">
          <h4 className="footer-subtitle">Legal Stuff</h4>
          <ul className="footer-links">
            <li><a href="#">Terms & Conditions (Don't Read)</a></li>
            <li><a href="#">Privacy Policy (We Know Nothing)</a></li>
            <li><a href="#">Refund Policy (Good Luck)</a></li>
            <li><a href="#">FAQ (Frequently Avoided Questions)</a></li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="footer-container">
          <p>&copy; 2024 Wiggy. All rights reserved. No actual food was harmed in the making of this app.</p>
          <p className="footer-disclaimer">
            🎭 This is a parody app created for educational purposes. 
            No real food delivery service. No real hunger satisfaction guaranteed.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;